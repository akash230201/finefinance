"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/contexts/currency-context";
import {
  ChevronDown,
  RefreshCw,
  TrendingUp,
  Search,
  Star,
  StarOff,
  Globe,
  Zap,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export function CurrencySelector() {
  const {
    currentCurrency,
    currencyInfo,
    exchangeRates,
    loading,
    lastUpdated,
    changeCurrency,
    allAvailableCurrencies,
    popularCurrencies,
    getCurrentRate,
    refreshRates,
  } = useCurrency();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(
          localStorage.getItem("currency-favorites") ||
            '["USD", "EUR", "GBP", "INR"]'
        );
      } catch {
        return ["USD", "EUR", "GBP", "INR"];
      }
    }
    return ["USD", "EUR", "GBP", "INR"];
  });

  const handleCurrencyChange = (newCurrency) => {
    changeCurrency(newCurrency);
    setOpen(false);
    setSearchTerm("");
  };

  const toggleFavorite = (currencyCode) => {
    const newFavorites = favorites.includes(currencyCode)
      ? favorites.filter((code) => code !== currencyCode)
      : [...favorites, currencyCode];

    setFavorites(newFavorites);
    localStorage.setItem("currency-favorites", JSON.stringify(newFavorites));

    toast.success(
      favorites.includes(currencyCode)
        ? `${currencyCode} removed from favorites`
        : `${currencyCode} added to favorites`
    );
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never";
    const now = new Date();
    const diff = Math.floor((now - lastUpdated) / 1000 / 60); // minutes

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return lastUpdated.toLocaleDateString();
  };

  const filteredCurrencies = useMemo(() => {
    const entries = Object.entries(allAvailableCurrencies);
    if (!searchTerm) return entries;

    return entries.filter(
      ([code, info]) =>
        code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allAvailableCurrencies, searchTerm]);

  const favoriteCurrencies = useMemo(
    () => filteredCurrencies.filter(([code]) => favorites.includes(code)),
    [filteredCurrencies, favorites]
  );

  const otherCurrencies = useMemo(
    () => filteredCurrencies.filter(([code]) => !favorites.includes(code)),
    [filteredCurrencies, favorites]
  );

  if (loading && !exchangeRates) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-9 border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200"
        disabled
      >
        <RefreshCw className="h-3 w-3 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 bg-background/50 hover:bg-background"
        >
          <span className="mr-2">{currencyInfo?.flag}</span>
          <span className="font-medium">{currentCurrency}</span>
          <ChevronDown className="h-3 w-3 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 border shadow-lg bg-background/95 backdrop-blur-sm"
      >
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="font-semibold">Currency & Exchange Rates</span>
          </div>
          <Badge variant="secondary" className="text-xs gap-1">
            <Zap className="h-3 w-3" />
            {formatLastUpdated()}
          </Badge>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 text-sm border-border/60"
            />
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Current Currency Info */}
        <div className="px-3 py-2 bg-muted/20 border-l-2 border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currencyInfo?.flag}</span>
              <div>
                <p className="font-medium text-sm">{currencyInfo?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currencyInfo?.country} • 1 USD ={" "}
                  {getCurrentRate().toFixed(4)} {currentCurrency}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">Live</span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Favorites Section */}
        {favoriteCurrencies.length > 0 && (
          <>
            <DropdownMenuLabel className="px-3 py-1 text-xs text-muted-foreground flex items-center gap-2">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              Favorite Currencies
            </DropdownMenuLabel>

            <div className="max-h-32 overflow-y-auto">
              {favoriteCurrencies.map(([code, info]) => {
                const rate = exchangeRates?.[code] || 1;
                const isSelected = code === currentCurrency;

                return (
                  <DropdownMenuItem
                    key={`fav-${code}`}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleCurrencyChange(code)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{info.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{code}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {info.country}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs font-mono text-muted-foreground">
                          {rate.toFixed(4)}
                        </div>
                        {isSelected && (
                          <Badge variant="default" className="text-xs h-4 px-1">
                            Active
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(code);
                        }}
                      >
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>

            <DropdownMenuSeparator />
          </>
        )}

        {/* All Currencies */}
        <DropdownMenuLabel className="px-3 py-1 text-xs text-muted-foreground">
          All Currencies ({otherCurrencies.length})
        </DropdownMenuLabel>

        <div className="max-h-48 overflow-y-auto">
          {otherCurrencies.map(([code, info]) => {
            const rate = exchangeRates?.[code] || 1;
            const isSelected = code === currentCurrency;

            return (
              <DropdownMenuItem
                key={code}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => handleCurrencyChange(code)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{info.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{code}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {info.country}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs font-mono text-muted-foreground">
                      {rate.toFixed(4)}
                    </div>
                    {isSelected && (
                      <Badge variant="default" className="text-xs h-4 px-1">
                        Active
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(code);
                    }}
                  >
                    <StarOff className="h-3 w-3 text-muted-foreground hover:text-yellow-400" />
                  </Button>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>

        {filteredCurrencies.length === 0 && (
          <div className="px-3 py-8 text-center text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No currencies found</p>
            <p className="text-xs">Try a different search term</p>
          </div>
        )}

        <DropdownMenuSeparator />

        {/* Exchange Rate Info */}
        <div className="px-3 py-2 text-center bg-muted/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              Rates updated {formatLastUpdated()}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={refreshRates}
              disabled={loading}
            >
              <RefreshCw
                className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/70">
            Powered by exchangerate-api.com • Free & Open Source
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
