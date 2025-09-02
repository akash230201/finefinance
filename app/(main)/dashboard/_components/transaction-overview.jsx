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
      <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-gradient-to-br from-card via-card to-card/95 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/20 bg-gradient-to-r from-muted/10 to-transparent flex-shrink-0">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-primary/60 rounded-full shadow-sm" />
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground/80">
              Latest activity from your selected account
            </CardDescription>
          </div>
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[160px] h-10 border-border/40 shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-200 bg-background/50 backdrop-blur-sm">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent className="border shadow-lg backdrop-blur-md">
              {account.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center justify-between w-full max-w-[150px]">
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
                <div className="h-[28rem] overflow-y-auto py-2 scroll-smooth">
                  <div className="px-6 space-y-2">
                    {recentTransactions.map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className={cn(
                          "group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01]",
                          "bg-gradient-to-r from-background/90 via-background/95 to-background/90",
                          "border-border/40 hover:border-border/60 hover:shadow-md hover:shadow-primary/5",
                          index === 0 &&
                            "ring-1 ring-primary/20 border-primary/30"
                        )}
                      >
                        {/* Transaction Icon & Details */}
                        <div className="flex items-center space-x-4">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 shadow-sm",
                              transaction.type === "EXPENSE"
                                ? "bg-gradient-to-br from-red-50/80 to-red-100/60 text-red-600/90"
                                : "bg-gradient-to-br from-green-50/80 to-green-100/60 text-green-600/90"
                            )}
                          >
                            {transaction.type === "EXPENSE" ? (
                              <ArrowDownRight className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex flex-col space-y-1.5 min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-none text-foreground/90 group-hover:text-foreground transition-colors truncate">
                              {transaction.description || "Unknown Transaction"}
                            </p>
                            <div className="flex items-center space-x-2 text-xs">
                              <span className="text-muted-foreground/80 font-medium">
                                {format(
                                  new Date(transaction.date),
                                  "MMM dd, h:mm a"
                                )}
                              </span>
                              {transaction.category && (
                                <>
                                  <div className="w-1 h-1 bg-muted-foreground/40 rounded-full flex-shrink-0" />
                                  <span className="text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded-md font-medium truncate max-w-[100px]">
                                    {transaction.category}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Transaction Amount */}
                        <div className="flex flex-col items-end space-y-1.5 ml-4 flex-shrink-0">
                          <p
                            className={cn(
                              "text-sm font-semibold tabular-nums tracking-tight",
                              transaction.type === "EXPENSE"
                                ? "text-red-600/90"
                                : "text-green-600/90"
                            )}
                          >
                            {transaction.type === "EXPENSE" ? "-" : "+"}
                            <CurrencyDisplay
                              amount={parseFloat(transaction.amount)}
                            />
                          </p>
                          {transaction.isRecurring && (
                            <span className="text-xs bg-gradient-to-r from-blue-50/80 to-blue-100/60 text-blue-700/90 px-2 py-1 rounded-full border border-blue-200/50 font-medium whitespace-nowrap">
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
                <div className="px-6 py-2 border-t border-border/20 bg-gradient-to-r from-muted/5 to-muted/10 mt-auto">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-background/60 to-background/40 border border-border/30 backdrop-blur-sm">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary/60 to-primary rounded-full animate-pulse" />
                      <p className="text-xs text-muted-foreground font-medium">
                        Showing {Math.min(15, accountTransactions.length)} of{" "}
                        <span className="font-semibold text-foreground">
                          {accountTransactions.length}
                        </span>{" "}
                        transactions
                      </p>
                    </div>
                    <Link
                      href={`/accounts/${selectedAccount}`}
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-all duration-200 hover:underline flex items-center space-x-1 group"
                    >
                      <span>View All</span>
                      <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-gradient-to-br from-card via-card to-card/95 flex flex-col">
        <CardHeader className="pb-4 border-b border-border/20 bg-gradient-to-r from-muted/10 to-transparent flex-shrink-0">
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-primary to-primary/60 rounded-full shadow-sm" />
                Monthly Overview
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/80">
                {format(currentDate, "MMMM yyyy")} expense breakdown
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="text-right bg-gradient-to-br from-green-50/50 to-green-100/30 p-2.5 rounded-lg border border-green-200/40 backdrop-blur-sm min-w-0">
                <div className="flex items-center gap-1.5 text-green-600 mb-1">
                  <TrendingUp className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs font-medium">Income</span>
                </div>
                <p className="text-sm font-semibold truncate">
                  <CurrencyDisplay amount={totalIncome} />
                </p>
              </div>
              <div className="text-right bg-gradient-to-br from-red-50/50 to-red-100/30 p-2.5 rounded-lg border border-red-200/40 backdrop-blur-sm min-w-0">
                <div className="flex items-center gap-1.5 text-red-600 mb-1">
                  <TrendingDown className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs font-medium">Expenses</span>
                </div>
                <p className="text-sm font-semibold truncate">
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
                <div className="h-48 bg-gradient-to-br from-background/60 to-background/20 rounded-xl border border-border/30 p-3 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
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
                          className="group p-2.5 rounded-lg bg-gradient-to-br from-background/60 via-background/40 to-background/60 border border-border/30 hover:border-border/50 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
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
                        ? "text-green-600 bg-gradient-to-r from-green-50/50 to-green-100/30 border border-green-200/40"
                        : "text-red-600 bg-gradient-to-r from-red-50/50 to-red-100/30 border border-red-200/40"
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
