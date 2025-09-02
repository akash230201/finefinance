// Currency utilities and configuration - Popular currencies used by most people globally
export const SUPPORTED_CURRENCIES = {
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
    country: "United States",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "🇪🇺",
    country: "European Union",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "🇬🇧",
    country: "United Kingdom",
  },
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "🇮🇳",
    country: "India",
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    flag: "🇯🇵",
    country: "Japan",
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    flag: "🇨🇦",
    country: "Canada",
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    flag: "🇦🇺",
    country: "Australia",
  },
  CHF: {
    code: "CHF",
    symbol: "CHF",
    name: "Swiss Franc",
    flag: "🇨🇭",
    country: "Switzerland",
  },
  CNY: {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    flag: "🇨🇳",
    country: "China",
  },
  KRW: {
    code: "KRW",
    symbol: "₩",
    name: "South Korean Won",
    flag: "🇰🇷",
    country: "South Korea",
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    flag: "🇸🇬",
    country: "Singapore",
  },
  HKD: {
    code: "HKD",
    symbol: "HK$",
    name: "Hong Kong Dollar",
    flag: "🇭🇰",
    country: "Hong Kong",
  },
  NZD: {
    code: "NZD",
    symbol: "NZ$",
    name: "New Zealand Dollar",
    flag: "🇳🇿",
    country: "New Zealand",
  },
  SEK: {
    code: "SEK",
    symbol: "kr",
    name: "Swedish Krona",
    flag: "🇸🇪",
    country: "Sweden",
  },
  NOK: {
    code: "NOK",
    symbol: "kr",
    name: "Norwegian Krone",
    flag: "🇳🇴",
    country: "Norway",
  },
  DKK: {
    code: "DKK",
    symbol: "kr",
    name: "Danish Krone",
    flag: "🇩🇰",
    country: "Denmark",
  },
  BRL: {
    code: "BRL",
    symbol: "R$",
    name: "Brazilian Real",
    flag: "🇧🇷",
    country: "Brazil",
  },
  MXN: {
    code: "MXN",
    symbol: "$",
    name: "Mexican Peso",
    flag: "🇲🇽",
    country: "Mexico",
  },
  ZAR: {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    flag: "🇿🇦",
    country: "South Africa",
  },
  RUB: {
    code: "RUB",
    symbol: "₽",
    name: "Russian Ruble",
    flag: "🇷🇺",
    country: "Russia",
  },
};

export const DEFAULT_CURRENCY = "USD";

// Free exchange rate API (no auth required, 1500 requests/month)
const EXCHANGE_API_BASE = "https://api.exchangerate-api.com/v4/latest";

// Cache for exchange rates (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
let rateCache = null;
let cacheTimestamp = null;

/**
 * Fetch exchange rates from API with caching
 * @param {string} baseCurrency - Base currency code
 * @returns {Promise<Object>} Exchange rates object
 */
export async function fetchExchangeRates(baseCurrency = DEFAULT_CURRENCY) {
  const now = Date.now();

  // Return cached data if still valid
  if (rateCache && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
    return rateCache;
  }

  try {
    const response = await fetch(`${EXCHANGE_API_BASE}/${baseCurrency}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the response
    rateCache = data.rates;
    cacheTimestamp = now;

    return data.rates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);

    // Return cached data if available, even if expired
    if (rateCache) {
      console.warn("Using cached exchange rates due to API failure");
      return rateCache;
    }

    // Fallback rates (approximate values) - Updated with more currencies
    console.warn("Using fallback exchange rates");
    return {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      INR: 83.12,
      JPY: 110.0,
      CAD: 1.35,
      AUD: 1.45,
      CHF: 0.92,
      CNY: 7.24,
      KRW: 1310.5,
      SGD: 1.34,
      HKD: 7.8,
      NZD: 1.62,
      SEK: 10.89,
      NOK: 10.64,
      DKK: 6.84,
      BRL: 4.96,
      MXN: 17.12,
      ZAR: 18.75,
      RUB: 74.5,
    };
  }
}

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Object} rates - Exchange rates object
 * @returns {number} Converted amount
 */
export function convertCurrency(amount, fromCurrency, toCurrency, rates) {
  if (fromCurrency === toCurrency) return amount;

  // Convert to USD first, then to target currency
  const usdAmount =
    fromCurrency === "USD" ? amount : amount / rates[fromCurrency];
  const convertedAmount =
    toCurrency === "USD" ? usdAmount : usdAmount * rates[toCurrency];

  return convertedAmount;
}

/**
 * Format currency amount with proper symbol and locale
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @param {boolean} showCode - Whether to show currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(
  amount,
  currencyCode = DEFAULT_CURRENCY,
  showCode = false
) {
  const currency = SUPPORTED_CURRENCIES[currencyCode];
  if (!currency) return `${amount.toFixed(2)}`;

  try {
    // Use Intl.NumberFormat for proper locale formatting
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formatted = formatter.format(amount);

    // For some currencies, we prefer our custom symbols
    if (currency.symbol && currency.symbol !== currencyCode) {
      const numericPart = amount.toFixed(2);
      return showCode
        ? `${currency.symbol}${numericPart} ${currencyCode}`
        : `${currency.symbol}${numericPart}`;
    }

    return showCode ? `${formatted} ${currencyCode}` : formatted;
  } catch (error) {
    console.error("Currency formatting error:", error);
    return showCode
      ? `${currency.symbol}${amount.toFixed(2)} ${currencyCode}`
      : `${currency.symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Get currency symbol for a currency code
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currencyCode) {
  return SUPPORTED_CURRENCIES[currencyCode]?.symbol || currencyCode;
}

/**
 * Validate if currency code is supported
 * @param {string} currencyCode - Currency code to validate
 * @returns {boolean} Whether currency is supported
 */
export function isSupportedCurrency(currencyCode) {
  return currencyCode in SUPPORTED_CURRENCIES;
}
