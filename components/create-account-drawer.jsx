"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/currency-context";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const { convertToUSD, currentCurrency, currencyInfo, formatAmount } =
    useCurrency();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    // Convert the balance from selected currency to USD for database storage
    const balanceInSelectedCurrency = parseFloat(data.balance);
    if (isNaN(balanceInSelectedCurrency)) {
      toast.error("Please enter a valid balance amount");
      return;
    }

    // Convert to USD before saving to database
    const balanceInUSD = convertToUSD(balanceInSelectedCurrency);

    const accountData = {
      ...data,
      balance: balanceInUSD.toString(), // Convert back to string for form handling
    };

    await createAccountFn(accountData);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 tracking-tight"
              >
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                className="h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 bg-background/50"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 tracking-tight"
              >
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger
                  id="type"
                  className="h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 bg-background/50"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="border shadow-md">
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive font-medium">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="balance"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 tracking-tight"
              >
                Initial Balance ({currencyInfo?.symbol || currentCurrency})
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 bg-background/50"
                {...register("balance")}
              />
              {currentCurrency !== "USD" && (
                <p className="text-xs text-muted-foreground">
                  Amount will be converted from {currentCurrency} to USD and
                  stored in the database.
                </p>
              )}
              {errors.balance && (
                <p className="text-sm text-destructive font-medium">
                  {errors.balance.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/30 p-3 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-base font-medium cursor-pointer tracking-tight text-foreground/90"
                >
                  Set as Default
                </label>
                <p className="text-sm text-muted-foreground/80">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-border/30">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200"
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                className="flex-1 h-11 shadow-sm hover:shadow-md transition-all duration-200"
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
