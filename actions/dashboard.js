"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { th } from "date-fns/locale";
import { revalidatePath } from "next/cache";
import { success } from "zod";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };

  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }

  // Convert Date objects to ISO strings for client components
  if (obj.createdAt) {
    serialized.createdAt = obj.createdAt.toISOString();
  }
  if (obj.updatedAt) {
    serialized.updatedAt = obj.updatedAt.toISOString();
  }
  if (obj.date) {
    serialized.date = obj.date.toISOString();
  }

  return serialized;
};

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance value");
    }

    // Check if this is the first account for the user
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isdefault;

    // if this account is default, unset all other accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = {
      ...account,
      balance: account.balance.toNumber(),
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    };

    revalidatePath("/dashboard/accounts");

    return { success: true, account: serializedAccount };
  } catch (error) {
    throw new Error(`Failed to create account: ${error.message}`);
  }
}

export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });

  // Properly serialize accounts with balance conversion
  const serializedAccounts = accounts.map((account) => ({
    ...account,
    balance: account.balance.toNumber(),
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  }));

  return serializedAccounts;
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  // get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return transactions.map(serializeTransaction);
}
