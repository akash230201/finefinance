"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyDisplay } from "@/components/currency-display";
import { useCurrency } from "@/contexts/currency-context";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DATE_RANGE = {
  last7Days: { label: "Last 7 Days", days: 7 },
  last30Days: { label: "Last 30 Days", days: 30 },
  last90Days: { label: "Last 90 Days", days: 90 },
  last180Days: { label: "Last 180 Days", days: 180 },
  lastYear: { label: "Last Year", days: 365 },
  allTime: { label: "All Time", days: null },
};

const AccountChart = ({ transactions }) => {
  const [dateRange, setDateRange] = useState("last30Days");
  const { formatAmount } = useCurrency();

  const filteredData = useMemo(() => {
    const range = DATE_RANGE[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0)); // Start from epoch if no limit

    // Filter transactions based on the selected date range
    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");

      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }

      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }

      return acc;
    }, {});

    //convert grouped object to array
    const data = Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return data; // Return the processed data
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-base font-normal">
            Transaction Overview
          </CardTitle>
          <div className="border rounded-md">
            <Select defaultValue={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATE_RANGE).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around mb-6 text-sm">
            <div className="text-center">
              <p className="text-muted-foreground">Total Income:</p>
              <p className="text-lg font-bold text-green-500">
                <CurrencyDisplay amount={totals.income} />
              </p>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground">Total Expenses:</p>
              <p className="text-lg font-bold text-red-500">
                <CurrencyDisplay amount={totals.expense} />
              </p>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground">Net:</p>
              <p
                className={`text-lg font-bold ${
                  totals.income - totals.expense < 0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                <CurrencyDisplay
                  amount={Math.max(totals.income - totals.expense, 0)}
                />
              </p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatAmount(value)}
                />
                <Tooltip
                  formatter={(value, name) => [formatAmount(value), name]}
                  labelStyle={{ color: "#666" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name={"Income"}
                  fill="#008000"
                  activeBar={<Rectangle fill="pink" stroke="blue" />}
                />
                <Bar
                  dataKey="expense"
                  name={"Expense"}
                  fill="#ff0000"
                  activeBar={<Rectangle fill="gold" stroke="purple" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountChart;
