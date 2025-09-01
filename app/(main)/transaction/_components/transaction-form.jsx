"use client";

import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ca } from "date-fns/locale";
import { CalendarRangeIcon, Receipt, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ReceiptScanner } from "./recipt-scanner";

const AddTransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  // Determine if we're in edit mode based on editId or editMode prop
  const isEditMode = editMode || !!editId;
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      date: new Date(),
      accountId: accounts?.find((ac) => ac.isDefault)?.id || "",
      category: "",
      isRecurring: false,
    },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(isEditMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const recurringInterval = watch("recurringInterval");
  const accountId = watch("accountId");
  const category = watch("category");

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    if (isEditMode) {
      transactionFn(editId, formData);
    } else {
      await transactionFn(formData);
    }
  };

  useEffect(() => {
    if (transactionResult && !transactionLoading) {
      if (transactionResult.success) {
        toast.success(
          isEditMode
            ? "Transaction updated successfully."
            : "Transaction created successfully."
        );
        reset();
        router.push(`/accounts/${transactionResult.data.accountId}`);
      } else if (transactionResult.error) {
        // Handle error responses (defensive programming)
        toast.error(transactionResult.error);
      }
    }
  }, [transactionResult, transactionLoading, isEditMode, reset, router]);

  // Populate form when in edit mode and initialData is available
  useEffect(() => {
    if (isEditMode && initialData) {
      // Only populate if we're in edit mode AND have initial data
      setValue("type", initialData.type);
      setValue("amount", initialData.amount.toString());
      setValue("description", initialData.description || "");
      setValue("accountId", initialData.accountId);
      setValue("category", initialData.category);
      setValue("date", new Date(initialData.date));
      setValue("isRecurring", initialData.isRecurring);
      if (initialData.recurringInterval) {
        setValue("recurringInterval", initialData.recurringInterval);
      }
    } else if (!isEditMode) {
      // Reset to clean default values when NOT in edit mode
      setValue("type", "EXPENSE");
      setValue("amount", "");
      setValue("description", "");
      setValue("accountId", accounts?.find((ac) => ac.isDefault)?.id || "");
      setValue("category", "");
      setValue("date", new Date());
      setValue("isRecurring", false);
      setValue("recurringInterval", "");
    }
  }, [isEditMode, initialData, setValue, accounts]);

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Main Form Card */}
      <div className="bg-card border border-border/40 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-6 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Receipt Scanner - Only show in create mode */}
            {!isEditMode && (
              <ReceiptScanner onScanComplete={handleScanComplete} />
            )}

            {/* Transaction Type Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <h3 className="text-lg font-semibold">Transaction Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Transaction Type
                  </label>
                  <Select
                    onValueChange={(value) => setValue("type", value)}
                    value={type}
                  >
                    <SelectTrigger className="h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 bg-background/50">
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent className="border shadow-md">
                      <SelectItem value="EXPENSE">💸 Expense</SelectItem>
                      <SelectItem value="INCOME">💰 Income</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-destructive">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Amount
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="h-11 text-lg border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 focus:shadow-md transition-all duration-200 bg-background/50"
                    {...register("amount")}
                  />
                  {errors.amount && (
                    <p className="text-sm text-destructive">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account & Category Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full shadow-sm"></div>
                <h3 className="text-lg font-semibold">Account & Category</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Account
                  </label>
                  <Select
                    onValueChange={(value) => setValue("accountId", value)}
                    value={accountId}
                  >
                    <SelectTrigger className="h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 bg-background/50">
                      <SelectValue placeholder="Choose account" />
                    </SelectTrigger>
                    <SelectContent className="border shadow-md">
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{account.name}</span>
                            <span className="text-muted-foreground ml-2">
                              ${parseFloat(account.balance).toFixed(2)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      <CreateAccountDrawer>
                        <Button
                          variant="outline"
                          className="w-full mt-2 h-9 text-sm border-dashed border-border/50 hover:border-border/70 hover:shadow-sm transition-all duration-200"
                        >
                          + Add New Account
                        </Button>
                      </CreateAccountDrawer>
                    </SelectContent>
                  </Select>
                  {errors.accountId && (
                    <p className="text-sm text-destructive">
                      {errors.accountId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Category
                  </label>
                  <Select
                    onValueChange={(value) => setValue("category", value)}
                    value={category}
                  >
                    <SelectTrigger className="h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 bg-background/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="border shadow-md">
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Date & Description Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full shadow-sm"></div>
                <h3 className="text-lg font-semibold">
                  Additional Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Transaction Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-11 justify-start text-left font-normal border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 bg-background/50"
                      >
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        <CalendarRangeIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 border shadow-md"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => setValue("date", date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-destructive">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter transaction description"
                    className="h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 focus:shadow-md transition-all duration-200 bg-background/50"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recurring Transaction Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full shadow-sm"></div>
                <h3 className="text-lg font-semibold">Recurring Settings</h3>
              </div>

              <div className="bg-muted/30 rounded-lg border border-border/40 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label
                      htmlFor="isRecurring"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Set as Recurring Transaction
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Automatically create this transaction on a schedule
                    </p>
                  </div>
                  <Switch
                    id="isRecurring"
                    checked={isRecurring}
                    onCheckedChange={(checked) =>
                      setValue("isRecurring", checked)
                    }
                  />
                </div>

                {isRecurring && (
                  <div className="mt-4 space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Recurrence Frequency
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setValue("recurringInterval", value)
                      }
                      value={recurringInterval}
                    >
                      <SelectTrigger className="h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 bg-background/50">
                        <SelectValue placeholder="How often should this repeat?" />
                      </SelectTrigger>
                      <SelectContent className="border shadow-md">
                        <SelectItem value="DAILY">📅 Daily</SelectItem>
                        <SelectItem value="WEEKLY">📍 Weekly</SelectItem>
                        <SelectItem value="MONTHLY">🗓️ Monthly</SelectItem>
                        <SelectItem value="YEARLY">🎯 Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.recurringInterval && (
                      <p className="text-sm text-destructive">
                        {errors.recurringInterval.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200"
                onClick={() => router.back()}
                disabled={transactionLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
                disabled={transactionLoading}
              >
                {transactionLoading ? (
                  <div className="flex items-center justify-center w-full h-full relative">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/70 to-primary/40 animate-pulse rounded-md" />

                    {/* Main content container */}
                    <div className="relative z-10 flex items-center space-x-3">
                      {/* Spinning loader with enhanced styling */}
                      <div className="relative">
                        <Loader2 className="h-4 w-4 animate-spin text-white drop-shadow-sm" />
                        {/* Glow effect behind the spinner */}
                        <div className="absolute inset-0 h-4 w-4 bg-white/30 rounded-full blur-[2px] animate-pulse" />
                      </div>

                      {/* Text with animated dots */}
                      <div className="flex items-center space-x-1">
                        <span className="text-white font-medium text-sm drop-shadow-sm">
                          {isEditMode
                            ? "Updating Transaction"
                            : "Creating Transaction"}
                        </span>
                        <div className="flex space-x-0.5 ml-1">
                          <div
                            className="w-1 h-1 bg-white/90 rounded-full animate-bounce"
                            style={{
                              animationDelay: "0ms",
                              animationDuration: "1s",
                            }}
                          />
                          <div
                            className="w-1 h-1 bg-white/90 rounded-full animate-bounce"
                            style={{
                              animationDelay: "200ms",
                              animationDuration: "1s",
                            }}
                          />
                          <div
                            className="w-1 h-1 bg-white/90 rounded-full animate-bounce"
                            style={{
                              animationDelay: "400ms",
                              animationDuration: "1s",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shimmer overlay effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer rounded-md"
                      style={{
                        animation: "shimmer 2s infinite",
                        transform: "translateX(-100%) skewX(12deg)",
                      }}
                    />
                  </div>
                ) : (
                  <span className="relative z-10 font-medium">
                    {isEditMode ? "Update Transaction" : "Create Transaction"}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionForm;
