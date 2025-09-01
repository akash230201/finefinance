import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import { startOfMonth, endOfMonth } from "date-fns";

// Helper function to calculate the next recurring date
const calculateNextRecurringDate = (startDate, interval) => {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid interval");
  }

  return date;
};

// Helper function to check if a transaction is due
const isTransactionDue = (transaction) => {
  if (!transaction.nextRecurringDate) {
    // If no nextRecurringDate is set, calculate it based on last transaction date
    return true;
  }

  const now = new Date();
  const dueDate = new Date(transaction.nextRecurringDate);

  return now >= dueDate;
};

export const checkBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alert" },
  { cron: "0 */6 * * *" }, // Every 6 hours
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue; // Skip if no default account

      await step.run(`check-budget-${budget.id}`, async () => {
        // Define the current month's start and end dates
        const currentDate = new Date();
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.user.id,
            type: "EXPENSE", // Only count expense transactions
            date: {
              // Use actual transaction date
              gte: monthStart,
              lte: monthEnd,
            },
            accountId: defaultAccount.id, // Filter by default account only
          },
          _sum: {
            amount: true,
          },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        // Convert budget.amount to a number if it's a Decimal
        const budgetLimit =
          typeof budget.amount === "object" && budget.amount.toNumber
            ? budget.amount.toNumber()
            : Number(budget.amount);

        // Calculate percentage used correctly with proper conversion
        const percentageUsed = (totalExpenses / budgetLimit) * 100;

        console.log(
          `Total expenses: ${totalExpenses}, Budget limit: ${budgetLimit}, Percentage used: ${percentageUsed}%`
        );

        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          // 🚨 BUDGET THRESHOLD REACHED - ALERT REQUIRED 🚨
          console.log(
            `Alert threshold reached! ${percentageUsed}% of budget used. Last alert sent: ${budget.lastAlertSent}`
          );

          try {
            console.log("📧 Attempting to send budget alert email...");
            console.log("📋 Email recipient:", budget.user.email);
            console.log("📋 User name:", budget.user.name);
            console.log("📊 Budget data:", {
              percentageUsed: parseFloat(percentageUsed.toFixed(1)),
              budgetAmount: budgetLimit,
              totalExpenses: totalExpenses,
              accountName: defaultAccount?.name || "Default Account",
            });

            const emailResult = await sendEmail({
              to: budget.user.email,
              subject: `Budget Alert: ${percentageUsed.toFixed(1)}% of monthly budget used`,
              react: EmailTemplate({
                userName: budget.user.name || "User",
                type: "budget-alert",
                data: {
                  percentageUsed: parseFloat(percentageUsed.toFixed(1)),
                  budgetAmount: budgetLimit,
                  totalExpenses: totalExpenses,
                  accountName: defaultAccount?.name || "Default Account",
                },
              }),
            });

            console.log("✅ Email sent successfully:", emailResult);

            // Update lastAlertSent timestamp in database
            const updatedBudget = await db.budget.update({
              where: { id: budget.id },
              data: {
                lastAlertSent: new Date(),
              },
            });

            console.log(
              `✅ Successfully updated lastAlertSent for budget ${budget.id}:`,
              updatedBudget.lastAlertSent
            );
          } catch (emailError) {
            console.error(
              `❌ Failed to send email for budget ${budget.id}:`,
              emailError
            );

            // Still update lastAlertSent even if email fails to prevent spam
            try {
              await db.budget.update({
                where: { id: budget.id },
                data: {
                  lastAlertSent: new Date(),
                },
              });
              console.log("✅ Updated lastAlertSent despite email failure");
            } catch (dbError) {
              console.error(
                `❌ Failed to update lastAlertSent for budget ${budget.id}:`,
                dbError
              );
            }
          }
        }
      });
    }
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

// 1. Recurring Transaction Processing with Throttling
export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10, // Process 10 transactions
      period: "1m", // per minute
      key: "event.data.userId", // Throttle per user
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    // Validate event data
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    return await step.run("process-transaction", async () => {
      try {
        const transaction = await db.transaction.findUnique({
          where: {
            id: event.data.transactionId,
            userId: event.data.userId,
          },
          include: {
            account: true,
          },
        });

        if (!transaction) {
          return { error: "Transaction not found" };
        }

        if (!transaction.isRecurring) {
          return { error: "Transaction is not recurring" };
        }

        if (!isTransactionDue(transaction)) {
          return { message: "Transaction not due yet" };
        }

        // Create new transaction and update account balance in a transaction
        const result = await db.$transaction(async (tx) => {
          // Create new transaction
          const newTransaction = await tx.transaction.create({
            data: {
              type: transaction.type,
              amount: transaction.amount,
              description: `${transaction.description} (Recurring)`,
              date: new Date(),
              category: transaction.category,
              userId: transaction.userId,
              accountId: transaction.accountId,
              isRecurring: false,
              status: "COMPLETED",
            },
          });

          // Update account balance
          const balanceChange =
            transaction.type === "EXPENSE"
              ? -transaction.amount.toNumber()
              : transaction.amount.toNumber();

          await tx.account.update({
            where: { id: transaction.accountId },
            data: { balance: { increment: balanceChange } },
          });

          // Update last processed date and next recurring date
          await tx.transaction.update({
            where: { id: transaction.id },
            data: {
              lastProcessed: new Date(),
              nextRecurringDate: calculateNextRecurringDate(
                new Date(),
                transaction.recurringInterval
              ),
            },
          });

          return { newTransaction };
        });

        return { success: true, newTransactionId: result.newTransaction.id };
      } catch (error) {
        console.error(`Error processing recurring transaction:`, error);
        throw error;
      }
    });
  }
);

// Trigger recurring transactions with batching
export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions", // Unique ID,
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" }, // Daily at midnight
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              {
                nextRecurringDate: {
                  lte: new Date(),
                },
              },
            ],
          },
          include: {
            account: true,
          },
        });
      }
    );

    // Send event for each recurring transaction in batches
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));

      // Send events directly using inngest.send()
      await inngest.send(events);
    }

    return {
      triggered: recurringTransactions.length,
      timestamp: new Date().toISOString(),
    };
  }
);
