"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { de } from "date-fns/locale";
import { revalidatePath } from "next/cache";

const serializeAmount = (obj) => {
  return {
    ...obj,
    amount: obj.amount.toNumber(),
  };
};

export const createTransaction = async (data) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Arcjet rate limiting
    const req = await request();

    // Check the rate limit status
    console.log("Checking rate limit for user:", userId);
    const decision = await aj.protect(req, { userId, requested: 1 });
    console.log(
      "Rate limit decision:",
      decision.isAllowed() ? "ALLOWED" : "DENIED"
    );

    // Use isAllowed() instead of isDenied to avoid beta version bugs
    if (!decision.isAllowed()) {
      if (decision.reason && decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });
        throw new Error("Rate limit exceeded. Please try again later.");
      } else {
        // Handle other denial reasons
        console.error("Request denied by security policy:", decision.reason);
        throw new Error("Request denied by security policy.");
      }
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: { id: data.accountId, userId: user.id },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });
      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });
      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    console.error("Transaction creation error:", error);
    // Throw the error instead of returning it to trigger useFetch error handling
    throw error;
  }
};

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
