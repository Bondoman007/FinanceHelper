import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const CATEGORY_COLORS = {
  Food: "#ef4444",
  Transport: "#3b82f6",
  Housing: "#10b981",
  Salary: "#22c55e",
  Freelance: "#84cc16",
};

const DEFAULT_COLOR = "#a78bfa"; // fallback if category is unknown

const CategoryChart = ({ transactions }) => {
  console.log(transactions);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getAvailableMonthsAndYears = () => {
    const map = {};
    transactions.forEach((txn) => {
      if (!txn.date) return;
      const dateObj = new Date(txn.date);
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      map[`${year}-${month}`] = { year, month };
    });
    return Object.values(map);
  };

  const availableMonthsYears = getAvailableMonthsAndYears();

  const availableYears = Array.from(
    new Set(availableMonthsYears.map((item) => item.year))
  ).sort((a, b) => b - a);

  const filteredTransactions = transactions.filter((txn) => {
    if (!txn.date || !txn.amount || !txn.category) return false;
    const dateObj = new Date(txn.date);
    return (
      dateObj.getMonth() + 1 === selectedMonth &&
      dateObj.getFullYear() === selectedYear
    );
  });

  const categoryTotals = filteredTransactions.reduce((acc, txn) => {
    const category = txn.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += txn.amount;
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals)
    .map(([category, totalAmount]) => ({
      category,
      totalAmount,
      color: CATEGORY_COLORS[category] || DEFAULT_COLOR,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Expenses by Category</CardTitle>
        <div className="flex space-x-2">
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {new Date(0, month - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.length > 0 ? (
                availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={selectedYear.toString()} disabled>
                  No Years
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="totalAmount"
                  nameKey="category"
                  label={({ category, percent }) =>
                    `${category}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `₹${value.toLocaleString()}`,
                    "Amount",
                  ]}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions for selected month/year
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
