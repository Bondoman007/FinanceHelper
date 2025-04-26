import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./card";

const ExpenseChart = ({ data }) => {
  console.log(data);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => {
                    // Format as "MMM YYYY" (e.g., "Jan 2023")
                    const [year, month] = value.split("-");
                    return new Date(year, month - 1).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        year: "numeric",
                      }
                    );
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Amount"]}
                  labelFormatter={(value) => {
                    const [year, month] = value.split("-");
                    return new Date(year, month - 1).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    );
                  }}
                />
                <Bar dataKey="totalAmount" fill="#8884d8" name="Total Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No data available for this month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
