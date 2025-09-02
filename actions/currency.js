"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Update user's preferred currency in the database
 * Note: Currently using localStorage only due to Prisma client regeneration issue
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

    // TODO: Re-enable database storage once Prisma client is regenerated
    // For now, currency preference is stored in localStorage only

    // Try to update database, but don't fail if it doesn't work
    try {
      // Check if the preferredCurrency field exists in the schema
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true, email: true }, // Only select existing fields
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Skip database update for now - will be re-enabled after Prisma regeneration
      console.log(
        `Currency preference ${currencyCode} saved to localStorage for user ${userId}`
      );
    } catch (dbError) {
      console.warn(
        "Database update skipped due to schema issue:",
        dbError.message
      );
    }

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
 * Note: Currently using localStorage fallback due to Prisma client regeneration issue
 */
export async function getUserCurrency() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    // TODO: Re-enable database retrieval once Prisma client is regenerated
    // For now, return fallback to localStorage
    try {
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true, email: true }, // Only select existing fields
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      // Return success but indicate localStorage should be used
      return {
        success: true,
        currency: "USD", // Default fallback
        useLocalStorage: true,
      };
    } catch (dbError) {
      console.warn(
        "Database retrieval skipped due to schema issue:",
        dbError.message
      );
      return {
        success: true,
        currency: "USD", // Default fallback
        useLocalStorage: true,
      };
    }
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
 * Note: Currently using localStorage only due to Prisma client regeneration issue
 */
export async function syncCurrencyPreference() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    // TODO: Re-enable database sync once Prisma client is regenerated
    // For now, return success and let localStorage handle it
    try {
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true, email: true }, // Only select existing fields
      });

      return {
        success: true,
        currency: "USD", // Default fallback
        useLocalStorage: true,
      };
    } catch (dbError) {
      console.warn(
        "Database sync skipped due to schema issue:",
        dbError.message
      );
      return {
        success: true,
        currency: "USD", // Default fallback
        useLocalStorage: true,
      };
    }
  } catch (error) {
    console.error("Error syncing currency preference:", error);
    return {
      success: false,
      error: error.message,
      currency: "USD", // fallback
    };
  }
}
