"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CurrencyCombobox
 * Props:
 *  - value: selected currency code
 *  - onChange: function(newCode)
 *  - currencies: object map { CODE: { name, symbol, flag, country } }
 *  - placeholder: optional placeholder
 *  - label: optional accessible label (id tied via aria-labelledby if provided externally)
 */
export function CurrencyCombobox({
  value,
  onChange,
  currencies,
  placeholder = "Select currency",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const entries = useMemo(() => Object.entries(currencies || {}), [currencies]);
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return entries;
    return entries.filter(
      ([code, info]) =>
        code.toLowerCase().includes(term) ||
        info.name?.toLowerCase().includes(term) ||
        info.country?.toLowerCase().includes(term)
    );
  }, [entries, search]);

  const selectedInfo = value ? currencies?.[value] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 px-3 text-sm"
        >
          {selectedInfo ? (
            <span className="flex items-center gap-2 truncate">
              <span className="text-base leading-none">
                {selectedInfo.flag || selectedInfo.symbol || value}
              </span>
              <span className="truncate">
                {value} – {selectedInfo.name}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-72" align="start">
        <Command shouldFilter={false} className="">
          <CommandInput
            placeholder="Search currency..."
            value={search}
            onValueChange={setSearch}
            autoFocus
          />
          <CommandList className="max-h-60">
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup heading={`Currencies (${filtered.length})`}>
              {filtered.map(([code, info]) => {
                const selected = code === value;
                return (
                  <CommandItem
                    key={code}
                    value={code}
                    onSelect={(current) => {
                      onChange(current);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-5 text-sm">
                      {info.flag || info.symbol || "🏳️"}
                    </span>
                    <span className="text-xs font-mono opacity-70 w-12">
                      {code}
                    </span>
                    <span className="text-sm flex-1 truncate">{info.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                      {info.country}
                    </span>
                    <Check
                      className={cn(
                        "h-4 w-4 ml-2 opacity-0",
                        selected && "opacity-100 text-primary"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
