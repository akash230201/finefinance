"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  SUPPORTED_CURRENCIES,
  POPULAR_CURRENCIES,
  DEFAULT_CURRENCY,
  fetchExchangeRates,
  convertCurrency,
  formatCurrency,
  getAllAvailableCurrencies,
} from "@/lib/currency";
import { toast } from "sonner";
import { updateUserCurrency, getUserCurrency } from "@/actions/currency";
import { useAuth } from "@clerk/nextjs";

const CurrencyContext = createContext();

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

export function CurrencyProvider({ children }) {
  const { isSignedIn, userId } = useAuth();
  const [currentCurrency, setCurrentCurrency] = useState(DEFAULT_CURRENCY);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load currency preference on mount
  useEffect(() => {
    async function loadCurrencyPreference() {
      try {
        // Always start with localStorage for now due to database schema issue
        const savedCurrency = localStorage.getItem("preferred-currency");
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }

        // For authenticated users, attempt to load from database (but don't fail if it doesn't work)
        if (isSignedIn && userId) {
          try {
            const result = await getUserCurrency();
            if (result.success && result.currency && !result.useLocalStorage) {
              // Only update if database actually returned a preference
              setCurrentCurrency(result.currency);
              localStorage.setItem("preferred-currency", result.currency);
            }
          } catch (dbError) {
            console.warn(
              "Database currency fetch failed, using localStorage:",
              dbError
            );
            // Continue with localStorage value
          }
        }
      } catch (error) {
        console.error("Failed to load currency preference:", error);
        // Fallback to localStorage
        const savedCurrency = localStorage.getItem("preferred-currency");
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }
      } finally {
        setIsInitialized(true);
      }
    }

    loadCurrencyPreference();
  }, [isSignedIn, userId]);

  // Fetch exchange rates on mount and when currency changes
  useEffect(() => {
    async function loadExchangeRates() {
      try {
        setLoading(true);
        const rates = await fetchExchangeRates(DEFAULT_CURRENCY); // Always fetch USD as base
        setExchangeRates(rates);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to load exchange rates:", error);
        toast.error("Failed to load exchange rates. Using cached data.");
      } finally {
        setLoading(false);
      }
    }

    if (isInitialized) {
      loadExchangeRates();

      // Refresh rates every 30 minutes
      const interval = setInterval(loadExchangeRates, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isInitialized]);

  // Change currency and save preference
  const changeCurrency = async (newCurrency) => {
    const allCurrencies = getAllAvailableCurrencies(exchangeRates);
    if (!allCurrencies[newCurrency]) {
      toast.error("Unsupported currency selected");
      return;
    }

    try {
      setCurrentCurrency(newCurrency);
      localStorage.setItem("preferred-currency", newCurrency);

      // Try to save to database if user is authenticated (but don't fail if it doesn't work)
      if (isSignedIn && userId) {
        try {
          const result = await updateUserCurrency(newCurrency);
          if (!result.success) {
            console.warn(
              "Database currency save failed, using localStorage:",
              result.error
            );
            // Continue - localStorage save still works
          }
        } catch (dbError) {
          console.warn("Database currency save error:", dbError);
          // Continue - localStorage save still works
        }
      }

      const currencyInfo = allCurrencies[newCurrency];
      toast.success(
        `Currency changed to ${currencyInfo.name} (${currencyInfo.code})`
      );
    } catch (error) {
      console.error("Failed to change currency:", error);
      toast.error("Failed to update currency preference");
    }
  };

  // Convert amount from USD to current currency
  const convertFromUSD = (amount) => {
    if (!exchangeRates || currentCurrency === "USD") return amount;
    return convertCurrency(amount, "USD", currentCurrency, exchangeRates);
  };

  // Convert amount from current currency to USD
  const convertToUSD = (amount) => {
    if (!exchangeRates || currentCurrency === "USD") return amount;
    return convertCurrency(amount, currentCurrency, "USD", exchangeRates);
  };

  // Convert between any two currencies
  const convertBetween = (amount, fromCurrency, toCurrency) => {
    if (!exchangeRates) return amount;
    return convertCurrency(amount, fromCurrency, toCurrency, exchangeRates);
  };

  // Format amount in current currency
  const formatAmount = (amount, showCode = false) => {
    const convertedAmount = convertFromUSD(amount);
    return formatCurrency(convertedAmount, currentCurrency, showCode);
  };

  // Get current currency info
  const getCurrencyInfo = () => {
    const allCurrencies = getAllAvailableCurrencies(exchangeRates);
    return (
      allCurrencies[currentCurrency] ||
      SUPPORTED_CURRENCIES[currentCurrency] || {
        code: currentCurrency,
        symbol: currentCurrency,
        name: `${currentCurrency} Currency`,
        flag: "🌐",
        country: "Unknown",
      }
    );
  };

  // Get exchange rate for current currency
  const getCurrentRate = () => {
    if (!exchangeRates || currentCurrency === "USD") return 1;
    return exchangeRates[currentCurrency] || 1;
  };

  // Refresh exchange rates manually
  const refreshRates = async () => {
    try {
      setLoading(true);
      const rates = await fetchExchangeRates(DEFAULT_CURRENCY);
      setExchangeRates(rates);
      setLastUpdated(new Date());
      toast.success("Exchange rates updated successfully");
    } catch (error) {
      console.error("Failed to refresh exchange rates:", error);
      toast.error("Failed to refresh exchange rates");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentCurrency,
    currencyInfo: getCurrencyInfo(),
    exchangeRates,
    loading,
    lastUpdated,
    isInitialized,
    changeCurrency,
    convertFromUSD,
    convertToUSD,
    convertBetween,
    formatAmount,
    getCurrentRate,
    refreshRates,
    supportedCurrencies: SUPPORTED_CURRENCIES,
    popularCurrencies: POPULAR_CURRENCIES,
    allAvailableCurrencies: getAllAvailableCurrencies(exchangeRates),
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
