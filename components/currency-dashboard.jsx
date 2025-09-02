"use client";

import React, { useState, useMemo } from "react";
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
import { Search, Calculator, MapPin, Users, CreditCard } from "lucide-react";

// Exchange rates for personal finance management
const exchangeRates = {
  USD: { rate: 1.0, symbol: "$" },
  EUR: { rate: 0.85, symbol: "€" },
  GBP: { rate: 0.73, symbol: "£" },
  JPY: { rate: 110.25, symbol: "¥" },
  CAD: { rate: 1.25, symbol: "C$" },
  AUD: { rate: 1.35, symbol: "A$" },
  CHF: { rate: 0.92, symbol: "Fr" },
  CNY: { rate: 6.45, symbol: "¥" },
};

// Currency information for personal finance tracking
const currencyInfo = {
  USD: {
    name: "US Dollar",
    symbol: "$",
    countries: ["United States", "Ecuador", "El Salvador"],
    region: "Americas",
    population: "330M+",
    usage: "International transactions",
  },
  EUR: {
    name: "Euro",
    symbol: "€",
    countries: ["Germany", "France", "Italy", "Spain"],
    region: "Europe",
    population: "340M+",
    usage: "European expenses",
  },
  GBP: {
    name: "British Pound",
    symbol: "£",
    countries: ["United Kingdom"],
    region: "Europe",
    population: "67M",
    usage: "UK transactions",
  },
  JPY: {
    name: "Japanese Yen",
    symbol: "¥",
    countries: ["Japan"],
    region: "Asia",
    population: "125M",
    usage: "Asian market purchases",
  },
  CAD: {
    name: "Canadian Dollar",
    symbol: "C$",
    countries: ["Canada"],
    region: "Americas",
    population: "38M",
    usage: "Canadian expenses",
  },
  AUD: {
    name: "Australian Dollar",
    symbol: "A$",
    countries: ["Australia"],
    region: "Oceania",
    population: "26M",
    usage: "Australian purchases",
  },
  CHF: {
    name: "Swiss Franc",
    symbol: "Fr",
    countries: ["Switzerland", "Liechtenstein"],
    region: "Europe",
    population: "9M",
    usage: "Swiss banking",
  },
  CNY: {
    name: "Chinese Yuan",
    symbol: "¥",
    countries: ["China"],
    region: "Asia",
    population: "1.4B",
    usage: "Chinese commerce",
  },
};

export function CurrencyDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [convertAmount, setConvertAmount] = useState("100");
  const [targetCurrency, setTargetCurrency] = useState("EUR");

  const filteredCurrencies = useMemo(() => {
    return Object.entries(currencyInfo).filter(
      ([code, info]) =>
        code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.countries.some((country) =>
          country.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm]);

  const calculateConversion = (amount, fromCurrency, toCurrency) => {
    const fromRate = exchangeRates[fromCurrency]?.rate || 1;
    const toRate = exchangeRates[toCurrency]?.rate || 1;
    const usdAmount = parseFloat(amount || 0) / fromRate;
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
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-background/50 border border-border/60 rounded-md text-sm"
              >
                {Object.entries(currencyInfo).map(([code, info]) => (
                  <option key={code} value={code}>
                    {code} - {info.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                To
              </label>
              <select
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-background/50 border border-border/60 rounded-md text-sm"
              >
                {Object.entries(currencyInfo).map(([code, info]) => (
                  <option key={code} value={code}>
                    {code} - {info.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Result
              </label>
              <div className="px-3 py-2 bg-muted/50 border border-border/60 rounded-md text-sm font-mono">
                {exchangeRates[targetCurrency]?.symbol || ""}
                {calculateConversion(
                  convertAmount,
                  selectedCurrency,
                  targetCurrency
                )}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCurrencies.map(([code, info]) => {
          const rate = exchangeRates[code];
          return (
            <Card
              key={code}
              className="bg-card/80 backdrop-blur-sm border-border/60 hover:bg-card/90 transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {info.symbol}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {code}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {info.name}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    Supported
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Exchange Rate (USD)
                  </span>
                  <span className="text-sm font-mono font-medium">
                    {rate.rate.toFixed(4)}
                  </span>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Region:</span>
                    <span className="font-medium">{info.region}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Population:</span>
                    <span className="font-medium">{info.population}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <CreditCard className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Usage:</span>
                    <span className="font-medium truncate">{info.usage}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    Primary Countries:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {info.countries.slice(0, 2).map((country) => (
                      <Badge
                        key={country}
                        variant="outline"
                        className="text-xs px-2 py-0 bg-muted/50"
                      >
                        {country}
                      </Badge>
                    ))}
                    {info.countries.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0 bg-muted/50"
                      >
                        +{info.countries.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
