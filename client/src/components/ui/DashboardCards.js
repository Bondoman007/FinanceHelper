import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

const DashboardCards = ({
  monthlyData,
  highestCategory,
  recentTransactions,
}) => {
  // Get current month and year
  console.log(highestCategory);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
  const currentYear = currentDate.getFullYear();

  // Format current month as YYYY-MM (with leading zero)
  const currentMonthFormatted = `${currentYear}-${currentMonth
    .toString()
    .padStart(2, "0")}`;

  // Find current month's data with proper fallback
  const currentMonthData = monthlyData?.find((item) => {
    if (!item?.month) return false;
    return item.month === currentMonthFormatted;
  }) || { totalAmount: 0 }; // Default object if not found

  // Format amount with commas and 2 decimal places
  const formatAmount = (amount) => {
    return (
      amount?.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) || "0.00"
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${formatAmount(currentMonthData.totalAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {currentMonthFormatted}
          </p>
        </CardContent>
      </Card>

      {/* Highest Category Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Highest Category
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {highestCategory ? (
            <>
              <div className="text-2xl font-bold">{highestCategory.name}</div>
              <p className="text-xs text-muted-foreground">
                ${formatAmount(highestCategory.amount)}
              </p>
            </>
          ) : (
            <div className="text-2xl font-bold">-</div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Recent Transactions
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {recentTransactions?.length > 0 ? (
            <div className="space-y-1">
              {recentTransactions.map((txn) => (
                <div key={txn._id} className="flex justify-between">
                  <span className="text-sm truncate max-w-[120px]">
                    {txn.description}
                  </span>
                  <span className="text-sm font-medium">
                    ${formatAmount(txn.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No recent transactions
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
