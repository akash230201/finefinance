"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CurrencyDisplay,
  useFormattedCurrency,
} from "@/components/currency-display";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const DashboardOverview = ({ account, transactions }) => {
  const { format: formatCurrency } = useFormattedCurrency();

  // Handle case when user has no accounts
  if (!account || account.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="text-center space-y-4 py-12">
            <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <ArrowUpRight className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Create Your First Account
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground max-w-sm mx-auto">
                To start tracking transactions, you need to create at least one
                account first. Click "Add New Account" below to get started.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="text-center space-y-4 py-12">
            <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Ready to Track Finances
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground max-w-sm mx-auto">
                Once you create an account, you'll be able to add transactions,
                set budgets, and monitor your financial health.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const [selectedAccount, setSelectedAccount] = useState(
    account.find((a) => a.isDefault)?.id || account[0]?.id
  );

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccount
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 15); // Increased from 5 to 15

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter(
    (t) =>
      t.type === "EXPENSE" &&
      new Date(t.date).getMonth() === currentDate.getMonth() &&
      new Date(t.date).getFullYear() === currentDate.getFullYear()
  );

  const currentMonthIncome = accountTransactions.filter(
    (t) =>
      t.type === "INCOME" &&
      new Date(t.date).getMonth() === currentDate.getMonth() &&
      new Date(t.date).getFullYear() === currentDate.getFullYear()
  );

  // Calculate totals
  const totalExpenses = currentMonthExpenses.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0
  );
  const totalIncome = currentMonthIncome.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0
  );

  // group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(transaction.amount);
    return acc;
  }, {});

  // Define colors for the pie chart
  const COLORS = [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
    "#ec4899", // Pink
    "#6b7280", // Gray
  ];

  // format data for pie chart
  const pieChartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: ((amount / totalExpenses) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border/40 rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm">{data.payload.name}</p>
          <p className="text-sm text-muted-foreground">
            <CurrencyDisplay amount={data.value} /> ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
      <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-card/80 dark:bg-card/70 flex flex-col backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/30 bg-gradient-to-r from-background/40 to-background/10 flex-shrink-0">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full shadow-sm" />
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Latest activity from your selected account
            </CardDescription>
          </div>
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[160px] h-10 border-border/50 shadow-sm bg-background/60 backdrop-blur-sm">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent className="border shadow-lg backdrop-blur-md">
              {account.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center justify-between w-full max-w-[170px]">
                    <span className="font-medium truncate">{account.name}</span>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      <CurrencyDisplay amount={parseFloat(account.balance)} />
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6 flex-1">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-muted/40 to-muted/20 flex items-center justify-center mb-4 shadow-sm">
                <ArrowUpRight className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                No recent transactions
              </p>
              <p className="text-xs text-muted-foreground/70">
                Start by creating your first transaction
              </p>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              {/* Scrollable transaction list */}
              <div className="relative flex-1">
                <div
                  className="max-h-[26rem] md:max-h-[32rem] overflow-y-auto py-2 scroll-smooth pr-2"
                  role="list"
                  aria-label="Recent Transactions"
                >
                  <div className="px-4 md:px-6 space-y-2">
                    {recentTransactions.map((transaction, index) => (
                      <div
                        key={transaction.id}
                        role="listitem"
                        className={cn(
                          "group relative flex items-start justify-between gap-3 p-3 md:p-4 rounded-lg border transition-colors",
                          "bg-muted/10 hover:bg-muted/20 dark:bg-muted/15 dark:hover:bg-muted/25",
                          "border-border/40 hover:border-border/60 focus-visible:outline-2 focus-visible:outline-primary/50",
                          index === 0 &&
                            "ring-1 ring-primary/30 border-primary/40"
                        )}
                      >
                        {/* Transaction Icon & Details */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-md border shadow-sm flex-shrink-0",
                              transaction.type === "EXPENSE"
                                ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400"
                                : "bg-green-50 border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-500/30 dark:text-green-400"
                            )}
                          >
                            {transaction.type === "EXPENSE" ? (
                              <ArrowDownRight className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex flex-col space-y-1 min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {transaction.description || "Unknown Transaction"}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] leading-none">
                              <span className="text-muted-foreground">
                                {format(
                                  new Date(transaction.date),
                                  "MMM dd, h:mm a"
                                )}
                              </span>
                              {transaction.category && (
                                <span className="px-2 py-0.5 rounded-md bg-background/60 border border-border/40 text-muted-foreground truncate max-w-[120px]">
                                  {transaction.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Transaction Amount */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <p
                            className={cn(
                              "text-sm font-semibold tabular-nums",
                              transaction.type === "EXPENSE"
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                            )}
                          >
                            {transaction.type === "EXPENSE" ? "-" : "+"}
                            <CurrencyDisplay
                              amount={parseFloat(transaction.amount)}
                            />
                          </p>
                          {transaction.isRecurring && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-400/30 font-medium">
                              Recurring
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced "See more" section */}
              {accountTransactions.length > 15 && (
                <div className="px-4 md:px-6 py-2 border-t border-border/30 bg-background/40 backdrop-blur-sm mt-auto">
                  <div className="flex items-center justify-between p-2 rounded-md bg-muted/10 border border-border/40">
                    <p className="text-xs text-muted-foreground">
                      Showing {Math.min(15, accountTransactions.length)} of{" "}
                      {accountTransactions.length} transactions
                    </p>
                    <Link
                      href={`/accounts/${selectedAccount}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-card/80 dark:bg-card/70 flex flex-col backdrop-blur-sm">
        <CardHeader className="pb-4 border-b border-border/30 bg-gradient-to-r from-background/40 to-background/10 flex-shrink-0">
          <div className="flex flex-row items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5 min-w-[180px]">
              <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                Monthly Overview
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {format(currentDate, "MMMM yyyy")} expense breakdown
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="rounded-md border bg-green-50 border-green-200 text-green-600 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300 px-3 py-2 text-right">
                <div className="flex items-center gap-1 mb-1 text-green-600 dark:text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-[11px] font-medium">Income</span>
                </div>
                <p className="text-sm font-semibold text-green-300/90 truncate">
                  <CurrencyDisplay amount={totalIncome} />
                </p>
              </div>
              <div className="rounded-md border bg-red-50 border-red-200 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 px-3 py-2 text-right">
                <div className="flex items-center gap-1 mb-1 text-red-600 dark:text-red-400">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-[11px] font-medium">Expenses</span>
                </div>
                <p className="text-sm font-semibold text-red-300/90 truncate">
                  <CurrencyDisplay amount={totalExpenses} />
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          {pieChartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6 flex-1">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-muted/40 to-muted/20 flex items-center justify-center mb-4 shadow-sm">
                <TrendingDown className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                No expenses this month
              </p>
              <p className="text-xs text-muted-foreground/70">
                Start tracking your expenses to see insights
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-6 flex-1 flex flex-col">
              {/* Pie Chart */}
              <div className="relative">
                <div className="h-48 rounded-xl border p-3 backdrop-blur-sm shadow-sm hover:shadow-md transition-all bg-white/60 border-border/40 dark:bg-background/60 dark:border-border/30">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            className="hover:opacity-80 transition-all duration-300 cursor-pointer drop-shadow-sm"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category List - Vertical Scrolling */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary/60 to-primary rounded-full" />
                    Top Categories
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground/60 font-medium">
                      {pieChartData.length} categories
                    </span>
                  </div>
                </div>

                {/* Vertical scrollable categories */}
                <div className="relative flex-1">
                  {/* Enhanced gradient indicators for vertical scroll */}
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-card via-card/80 to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none z-10" />

                  <div className="h-40 overflow-y-auto py-2 scroll-smooth">
                    <div className="grid grid-cols-2 gap-2">
                      {pieChartData.map((category, index) => (
                        <div
                          key={category.name}
                          className="group p-2.5 rounded-lg border bg-white/70 hover:bg-white dark:bg-background/60 dark:hover:bg-background/70 border-border/40 dark:border-border/30 transition-all duration-300 hover:shadow-sm"
                        >
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-3 h-3 rounded-full shadow-sm ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      COLORS[index % COLORS.length],
                                  }}
                                />
                                <span className="text-xs text-muted-foreground/70 font-medium">
                                  #{index + 1}
                                </span>
                              </div>
                              <p className="text-sm font-bold tabular-nums tracking-tight text-foreground">
                                <CurrencyDisplay amount={category.value} />
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-foreground/90 group-hover:text-foreground transition-colors truncate">
                                {category.name}
                              </p>
                              <p className="text-xs text-muted-foreground/80 font-medium">
                                {category.percentage}% of expenses
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Show more indicator if there are more than 6 categories */}
                {pieChartData.length > 6 && (
                  <div className="px-1">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-background/60 to-background/40 border border-border/30 backdrop-blur-sm">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary/60 to-primary rounded-full animate-pulse" />
                        <p className="text-xs text-muted-foreground font-medium">
                          Showing all{" "}
                          <span className="font-semibold text-foreground">
                            {pieChartData.length}
                          </span>{" "}
                          categories
                        </p>
                      </div>
                      <span className="text-xs text-primary/80 font-semibold">
                        Scroll for more ↓
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Net Income Summary */}
              <div className="p-2.5 rounded-lg bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 border border-border/40 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:border-border/60 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary/60 to-primary rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Net Income
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-bold tabular-nums tracking-tight px-2.5 py-1 rounded-lg backdrop-blur-sm",
                      totalIncome - totalExpenses >= 0
                        ? "chip-net-positive"
                        : "chip-net-negative"
                    )}
                  >
                    {totalIncome - totalExpenses >= 0 ? "+" : ""}
                    <CurrencyDisplay amount={totalIncome - totalExpenses} />
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
