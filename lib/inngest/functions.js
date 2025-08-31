import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";
import { db } from "../prisma";
import { inngest } from "./client";
import { startOfMonth, endOfMonth } from "date-fns";

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
