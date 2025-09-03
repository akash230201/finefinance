"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Calculator, TrendingUp } from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";
import { formatCurrency } from "@/lib/currency";

export function CurrencyConverter({ className = "" }) {
  const {
    allAvailableCurrencies,
    popularCurrencies,
    exchangeRates,
    convertBetween,
  } = useCurrency();

  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState(null);
  // NEW: search state for dropdowns
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const handleConvert = () => {
    if (!amount || !fromCurrency || !toCurrency || !exchangeRates) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return;

    const convertedAmount = convertBetween(numAmount, fromCurrency, toCurrency);
    setResult(convertedAmount);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  // Group currencies: popular first, then alphabetical
  const groupedCurrencies = () => {
    const popular = [];
    const others = [];

    Object.entries(allAvailableCurrencies).forEach(([code, info]) => {
      if (popularCurrencies.includes(code)) {
        popular.push([code, info]);
      } else {
        others.push([code, info]);
      }
    });

    // Sort popular by the order in popularCurrencies array
    popular.sort(
      (a, b) =>
        popularCurrencies.indexOf(a[0]) - popularCurrencies.indexOf(b[0])
    );

    // Sort others alphabetically
    others.sort((a, b) => a[1].name.localeCompare(b[1].name));

    return { popular, others };
  };

  const { popular: popularCurrencyList, others: otherCurrencyList } =
    groupedCurrencies();

  const filterCurrencies = (list, term) => {
    if (!term) return list;
    const t = term.toLowerCase();
    return list.filter(
      ([code, info]) =>
        code.toLowerCase().includes(t) || info.name.toLowerCase().includes(t)
    );
  };

  const filteredFromPopular = filterCurrencies(popularCurrencyList, fromSearch);
  const filteredFromOthers = filterCurrencies(otherCurrencyList, fromSearch);
  const filteredToPopular = filterCurrencies(popularCurrencyList, toSearch);
  const filteredToOthers = filterCurrencies(otherCurrencyList, toSearch);

  const getCurrentRate = () => {
    if (!exchangeRates || !fromCurrency || !toCurrency) return null;
    return convertBetween(1, fromCurrency, toCurrency);
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Currency Converter
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg font-medium"
          />
        </div>

        {/* From Currency */}
        <div className="space-y-2">
          <Label>From</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="max-h-80 p-0">
              <div className="p-2 sticky top-0 bg-popover border-b z-10">
                <Input
                  value={fromSearch}
                  onChange={(e) => setFromSearch(e.target.value)}
                  placeholder="Search currency..."
                  className="h-8 text-xs"
                />
              </div>
              {filteredFromPopular.length > 0 && (
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/30">
                  Popular
                </div>
              )}
              {filteredFromPopular.map(([code, info]) => (
                <SelectItem key={`from-${code}`} value={code}>
                  <div className="flex items-center gap-2">
                    <span>{info.flag}</span>
                    <span>{code}</span>
                    <span className="text-muted-foreground text-xs truncate">
                      {info.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
              {filteredFromOthers.length > 0 && (
                <>
                  <div className="h-px bg-border my-1" />
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/30">
                    All ({filteredFromOthers.length})
                  </div>
                </>
              )}
              {filteredFromOthers.map(([code, info]) => (
                <SelectItem key={`from-${code}`} value={code}>
                  <div className="flex items-center gap-2">
                    <span>{info.flag}</span>
                    <span>{code}</span>
                    <span className="text-muted-foreground text-xs truncate">
                      {info.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
              {filteredFromPopular.length === 0 &&
                filteredFromOthers.length === 0 && (
                  <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                    No matches
                  </div>
                )}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={swapCurrencies}
            className="rounded-full h-8 w-8 p-0"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <Label>To</Label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="max-h-80 p-0">
              <div className="p-2 sticky top-0 bg-popover border-b z-10">
                <Input
                  value={toSearch}
                  onChange={(e) => setToSearch(e.target.value)}
                  placeholder="Search currency..."
                  className="h-8 text-xs"
                />
              </div>
              {filteredToPopular.length > 0 && (
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/30">
                  Popular
                </div>
              )}
              {filteredToPopular.map(([code, info]) => (
                <SelectItem key={`to-${code}`} value={code}>
                  <div className="flex items-center gap-2">
                    <span>{info.flag}</span>
                    <span>{code}</span>
                    <span className="text-muted-foreground text-xs truncate">
                      {info.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
              {filteredToOthers.length > 0 && (
                <>
                  <div className="h-px bg-border my-1" />
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/30">
                    All ({filteredToOthers.length})
                  </div>
                </>
              )}
              {filteredToOthers.map(([code, info]) => (
                <SelectItem key={`to-${code}`} value={code}>
                  <div className="flex items-center gap-2">
                    <span>{info.flag}</span>
                    <span>{code}</span>
                    <span className="text-muted-foreground text-xs truncate">
                      {info.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
              {filteredToPopular.length === 0 &&
                filteredToOthers.length === 0 && (
                  <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                    No matches
                  </div>
                )}
            </SelectContent>
          </Select>
        </div>

        {/* Convert Button */}
        <Button
          onClick={handleConvert}
          className="w-full"
          disabled={!amount || !exchangeRates}
        >
          Convert
        </Button>

        {/* Result */}
        {result !== null && (
          <div className="mt-4 p-4 bg-muted/20 rounded-lg border">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(result, toCurrency, false)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {amount} {fromCurrency} ={" "}
                {formatCurrency(result, toCurrency, true)}
              </div>
            </div>
          </div>
        )}

        {/* Exchange Rate Info */}
        {getCurrentRate() && (
          <div className="text-center text-sm text-muted-foreground bg-muted/10 p-2 rounded">
            <TrendingUp className="h-3 w-3 inline mr-1" />1 {fromCurrency} ={" "}
            {getCurrentRate().toFixed(4)} {toCurrency}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
