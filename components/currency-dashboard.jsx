"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Calculator,
  MapPin,
  Users,
  CreditCard,
  TrendingUp,
  Refresh,
} from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";
import { CurrencyConverter } from "./currency-converter";
import { CurrencyCombobox } from "@/components/currency-combobox";

export function CurrencyDashboard() {
  const {
    allAvailableCurrencies,
    popularCurrencies,
    exchangeRates,
    loading,
    lastUpdated,
    refreshRates,
    convertBetween,
  } = useCurrency();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [convertAmount, setConvertAmount] = useState("100");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [page, setPage] = useState(1);
  const itemsPerPage = 18;

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCurrency, targetCurrency, convertAmount]);

  const filteredCurrencies = useMemo(() => {
    const entries = Object.entries(allAvailableCurrencies);
    const term = searchTerm.toLowerCase();
    const filtered = entries.filter(
      ([code, info]) =>
        code.toLowerCase().includes(term) ||
        info.name?.toLowerCase().includes(term) ||
        info.country?.toLowerCase().includes(term)
    );
    return filtered;
  }, [searchTerm, allAvailableCurrencies]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCurrencies.length / itemsPerPage)
  );
  const startIndex = (page - 1) * itemsPerPage;
  const displayedCurrencies = filteredCurrencies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const calculateConversion = (amount, fromCurrency, toCurrency) => {
    if (!exchangeRates) return "...";
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    const usdAmount = parseFloat(amount || 0) / fromRate; // convert to USD first
    return (usdAmount * toRate).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Quick Currency Converter */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Currency Converter</CardTitle>
          </div>
          <CardDescription>
            Convert between currencies for your financial planning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Amount
              </label>
              <Input
                type="number"
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value)}
                className="bg-background/50"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                From
              </label>
              <CurrencyCombobox
                value={selectedCurrency}
                onChange={setSelectedCurrency}
                currencies={allAvailableCurrencies}
                placeholder="Select base"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                To
              </label>
              <CurrencyCombobox
                value={targetCurrency}
                onChange={setTargetCurrency}
                currencies={allAvailableCurrencies}
                placeholder="Select target"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Result
              </label>
              <div className="px-3 py-2 bg-muted/50 border border-border/60 rounded-md text-sm font-mono">
                {exchangeRates && allAvailableCurrencies[targetCurrency]
                  ? `${allAvailableCurrencies[targetCurrency].symbol || targetCurrency} ${calculateConversion(
                      convertAmount,
                      selectedCurrency,
                      targetCurrency
                    )}`
                  : "Loading..."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search currencies or countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-card/50 backdrop-blur-sm border-border/60"
        />
      </div>

      {/* Supported Currencies */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Supported Currencies
        </h2>
        <div className="text-xs text-muted-foreground">
          {filteredCurrencies.length} total • Page {page} / {totalPages}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedCurrencies.map(([code, info]) => {
          const rate = exchangeRates ? exchangeRates[code] : null;
          return (
            <Card
              key={code}
              className="relative overflow-hidden border border-border/50 bg-gradient-to-br from-background via-background to-primary/5 hover:to-primary/10 transition-all duration-300 group hover:shadow-lg"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_60%)] transition-opacity" />
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg shadow-inner">
                      {info.flag || info.symbol || code}
                    </div>
                    <div className="space-y-0.5">
                      <CardTitle className="text-sm font-semibold leading-none">
                        {code}
                      </CardTitle>
                      <CardDescription className="text-[11px] truncate max-w-[140px]">
                        {info.name}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="h-5 px-2 text-[10px] font-medium bg-background/60 backdrop-blur-sm"
                  >
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-3 relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    1 USD
                  </span>
                  <span className="font-mono text-sm font-medium">
                    = {rate ? rate.toFixed(4) : "—"} {code}
                  </span>
                </div>
                {info.country && (
                  <div className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {info.country}
                  </div>
                )}
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </Card>
          );
        })}
      </div>
      {filteredCurrencies.length === 0 && (
        <div className="text-center py-12 border rounded-lg border-dashed text-muted-foreground text-sm">
          No currencies match your search.
        </div>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-muted-foreground">
            Showing {filteredCurrencies.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, filteredCurrencies.length)} of{" "}
            {filteredCurrencies.length}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(1)}
              className="h-7 px-2 text-xs"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2 text-xs"
            >
              Prev
            </Button>
            {Array.from({ length: totalPages })
              .slice(0, 7)
              .map((_, i) => {
                const pageNumber = i + 1;
                // For many pages, show first 3, current +/-1, last
                if (totalPages > 7) {
                  const shouldShow =
                    pageNumber <= 2 ||
                    pageNumber === totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1) ||
                    (page <= 3 && pageNumber <= 4) ||
                    (page >= totalPages - 2 && pageNumber >= totalPages - 3);
                  if (!shouldShow) return null;
                }
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNumber)}
                    className="h-7 px-3 text-xs"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            {totalPages > 7 && page < totalPages - 3 && (
              <span className="px-2 text-xs text-muted-foreground">…</span>
            )}
            {totalPages > 7 && page < totalPages - 2 && (
              <Button
                variant={page === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(totalPages)}
                className="h-7 px-3 text-xs"
              >
                {totalPages}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 px-2 text-xs"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
              className="h-7 px-2 text-xs"
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
