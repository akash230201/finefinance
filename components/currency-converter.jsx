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
  const { supportedCurrencies, exchangeRates, convertBetween } = useCurrency();

  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState(null);

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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(supportedCurrencies).map(([code, info]) => (
                <SelectItem key={code} value={code}>
                  <div className="flex items-center gap-2">
                    <span>{info.flag}</span>
                    <span>{code}</span>
                    <span className="text-muted-foreground text-sm">
                      {info.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(supportedCurrencies).map(([code, info]) => (
                <SelectItem key={code} value={code}>
                  <div className="flex items-center gap-2">
                    <span>{info.flag}</span>
                    <span>{code}</span>
                    <span className="text-muted-foreground text-sm">
                      {info.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
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
