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
  const [selectedAccount, setSelectedAccount] = useState(
    account.find((a) => a.isDefault)?.id || account[0]?.id
  );

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccount
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

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
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Latest activity from your selected account
            </CardDescription>
          </div>
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[160px] h-9 border-border/60 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent className="border shadow-md">
              {account.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{account.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      <CurrencyDisplay amount={parseFloat(account.balance)} />
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No recent transactions
              </p>
              <p className="text-xs text-muted-foreground/80">
                Start by creating your first transaction
              </p>
            </div>
          ) : (
            recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={cn(
                  "group relative flex items-center justify-between p-3 rounded-lg border border-border/40 hover:border-border/60 hover:shadow-sm transition-all duration-200 bg-card/50 hover:bg-card",
                  index === 0 && "ring-1 ring-primary/10"
                )}
              >
                {/* Transaction Icon & Details */}
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                      transaction.type === "EXPENSE"
                        ? "bg-red-50 text-red-600 group-hover:bg-red-100"
                        : "bg-green-50 text-green-600 group-hover:bg-green-100"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none group-hover:text-foreground transition-colors">
                      {transaction.description || "Unknown Transaction"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "MMM dd, h:mm a")}
                      </p>
                      {transaction.category && (
                        <>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                            {transaction.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transaction Amount */}
                <div className="flex flex-col items-end space-y-1">
                  <p
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      transaction.type === "EXPENSE"
                        ? "text-red-600"
                        : "text-green-600"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}
                    <CurrencyDisplay amount={parseFloat(transaction.amount)} />
                  </p>
                  {transaction.isRecurring && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      Recurring
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold tracking-tight">
                Monthly Overview
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {format(currentDate, "MMMM yyyy")} expense breakdown
              </CardDescription>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">Income</span>
                </div>
                <p className="text-sm font-semibold">
                  <CurrencyDisplay amount={totalIncome} />
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="h-3 w-3" />
                  <span className="text-xs font-medium">Expenses</span>
                </div>
                <p className="text-sm font-semibold">
                  <CurrencyDisplay amount={totalExpenses} />
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pieChartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                <TrendingDown className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No expenses this month
              </p>
              <p className="text-xs text-muted-foreground/80">
                Start tracking your expenses to see insights
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pie Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category List */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Top Categories
                </h4>
                <div className="space-y-2">
                  {pieChartData.slice(0, 4).map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          <CurrencyDisplay amount={category.value} />
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Net Income Summary */}
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/20 border border-border/40">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Net Income</span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      totalIncome - totalExpenses >= 0
                        ? "text-green-600"
                        : "text-red-600"
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
