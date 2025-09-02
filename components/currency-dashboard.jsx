"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calculator,
  Zap,
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";
import { CurrencyConverter } from "@/components/currency-converter";
import { useState } from "react";

export function CurrencyDashboard() {
  const {
    currentCurrency,
    currencyInfo,
    exchangeRates,
    loading,
    lastUpdated,
    supportedCurrencies,
    refreshRates,
  } = useCurrency();

  const [showConverter, setShowConverter] = useState(false);

  // Get popular currencies to show rates for
  const popularCurrencies = [
    "USD",
    "EUR",
    "GBP",
    "INR",
    "JPY",
    "CAD",
    "AUD",
    "CNY",
  ];

  const formatTime = (date) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never updated";
    const now = new Date();
    const diff = Math.floor((now - lastUpdated) / 1000 / 60); // minutes

    if (diff < 1) return "Just updated";
    if (diff < 60) return `Updated ${diff}m ago`;
    if (diff < 1440) return `Updated ${Math.floor(diff / 60)}h ago`;
    return `Updated ${lastUpdated.toLocaleDateString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Current Currency Status */}
      <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Currency Status
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />
                {formatLastUpdated()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshRates}
                disabled={loading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw
                  className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Currency */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currencyInfo?.flag}</span>
                <div>
                  <h3 className="font-semibold text-lg">{currentCurrency}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currencyInfo?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currencyInfo?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-sm">Current Rate</span>
              </div>
              <p className="text-lg font-bold">
                1 USD ={" "}
                {exchangeRates?.[currentCurrency]?.toFixed(4) || "1.0000"}{" "}
                {currentCurrency}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated ? formatTime(lastUpdated) : "Never"}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConverter(!showConverter)}
                  className="w-full justify-start gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Currency Converter
                </Button>
                <div className="text-xs text-muted-foreground">
                  Convert between {Object.keys(supportedCurrencies).length}{" "}
                  currencies
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Converter */}
      {showConverter && (
        <div className="flex justify-center">
          <CurrencyConverter />
        </div>
      )}

      {/* Popular Exchange Rates */}
      <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Popular Exchange Rates
            <Badge variant="outline" className="ml-auto text-xs">
              Base: {currentCurrency}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCurrencies
              .filter((code) => code !== currentCurrency)
              .slice(0, 8)
              .map((code) => {
                const info = supportedCurrencies[code];
                const rate = exchangeRates
                  ? exchangeRates[code] / (exchangeRates[currentCurrency] || 1)
                  : 1;

                return (
                  <div
                    key={code}
                    className="p-3 border border-border/40 rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{info?.flag}</span>
                      <span className="font-medium text-sm">{code}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      1 {currentCurrency} =
                    </div>
                    <div className="font-bold text-sm">
                      {rate.toFixed(4)} {code}
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Supported Currencies Overview */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Supported Currencies
            <Badge variant="secondary" className="ml-auto">
              {Object.keys(supportedCurrencies).length} currencies
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {Object.entries(supportedCurrencies).map(([code, info]) => (
              <div
                key={code}
                className={`p-2 rounded border text-center text-xs transition-all ${
                  code === currentCurrency
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border/40 hover:bg-muted/20"
                }`}
              >
                <div className="text-base mb-1">{info.flag}</div>
                <div className="font-medium">{code}</div>
                <div className="text-muted-foreground truncate">
                  {info.country}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
