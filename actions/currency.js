"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Update user's preferred currency in the database
 */
export async function updateUserCurrency(currencyCode) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Validate currency code
    const validCurrencies = [
      "USD",
      "EUR",
      "GBP",
      "INR",
      "JPY",
      "CAD",
      "AUD",
      "CHF",
      "CNY",
      "KRW",
      "SGD",
      "HKD",
      "NZD",
      "SEK",
      "NOK",
      "DKK",
      "BRL",
      "MXN",
      "ZAR",
      "RUB",
    ];

    if (!validCurrencies.includes(currencyCode)) {
      throw new Error("Invalid currency code");
    }

    // Update user's preferred currency
    const user = await db.user.update({
      where: { clerkUserId: userId },
      data: { preferredCurrency: currencyCode },
    });

    // Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    revalidatePath("/transaction");

    return {
      success: true,
      currency: currencyCode,
      message: `Currency updated to ${currencyCode}`,
    };
  } catch (error) {
    console.error("Error updating user currency:", error);
    return {
      success: false,
      error: error.message || "Failed to update currency preference",
    };
  }
}

/**
 * Get user's preferred currency from the database
 */
export async function getUserCurrency() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { preferredCurrency: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      currency: user.preferredCurrency || "USD",
    };
  } catch (error) {
    console.error("Error fetching user currency:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch currency preference",
      currency: "USD", // fallback
    };
  }
}

/**
 * Sync currency preference between database and localStorage
 */
export async function syncCurrencyPreference() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { preferredCurrency: true },
    });

    return {
      success: true,
      currency: user?.preferredCurrency || "USD",
    };
  } catch (error) {
    console.error("Error syncing currency preference:", error);
    return {
      success: false,
      error: error.message,
      currency: "USD", // fallback
    };
  }
}
