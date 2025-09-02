"use client";

import { useCurrency } from "@/contexts/currency-context";
import { formatCurrency } from "@/lib/currency";

/**
 * Component to display currency amounts with proper formatting
 * and conversion based on user's selected currency
 */
export function CurrencyDisplay({
  amount,
  className = "",
  showCode = false,
  originalCurrency = "USD",
  ...props
}) {
  const { convertBetween, currentCurrency, exchangeRates } = useCurrency();

  if (!amount && amount !== 0) {
    return (
      <span className={className} {...props}>
        -
      </span>
    );
  }

  // Convert amount if needed
  const convertedAmount =
    exchangeRates && originalCurrency !== currentCurrency
      ? convertBetween(amount, originalCurrency, currentCurrency)
      : amount;

  const formattedAmount = formatCurrency(
    convertedAmount,
    currentCurrency,
    showCode
  );

  return (
    <span className={className} {...props}>
      {formattedAmount}
    </span>
  );
}

/**
 * Hook to get formatted currency amount
 */
export function useFormattedCurrency() {
  const { formatAmount, convertFromUSD, currentCurrency } = useCurrency();

  return {
    formatAmount,
    convertFromUSD,
    currentCurrency,
    format: (amount, showCode = false) => formatAmount(amount, showCode),
  };
}
