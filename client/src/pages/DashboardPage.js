import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dailog";
import TransactionForm from "../components/ui/TransactionForm";
import TransactionList from "../components/ui/TransactionList";
import DashboardCards from "../components/ui/DashboardCards";
import ExpenseChart from "../components/ui/ExpenseChart";
import CategoryChart from "../components/ui/CategoryChart";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txnRes, catRes, monthlyRes, categoryRes] = await Promise.all([
        axios.get("https://financehelper-5mpy.onrender.com/api/transactions", {
          withCredentials: true,
        }),
        axios.get("https://financehelper-5mpy.onrender.com/api/categories", {
          withCredentials: true,
        }),
        axios.get(
          "https://financehelper-5mpy.onrender.com/api/transactions/summary/monthly",
          {
            withCredentials: true,
          }
        ),
        axios.get(
          "https://financehelper-5mpy.onrender.com/api/transactions/summary/category",
          {
            withCredentials: true,
          }
        ),
      ]);

      setTransactions(txnRes.data);
      setCategories(catRes.data);
      setMonthlyData(monthlyRes.data);
      setCategoryData(categoryRes.data);
      console.log(categoryRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddTransaction = () => {
    setCurrentTransaction(null);
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(
          `https://financehelper-5mpy.onrender.com/api/transactions/${id}`,
          {
            withCredentials: true,
          }
        );
        fetchData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };
  console.log(transactions);
  const handleSubmitTransaction = async (formData) => {
    try {
      if (currentTransaction) {
        await axios.put(
          `https://financehelper-5mpy.onrender.com/api/transactions/${currentTransaction._id}`,
          formData,
          {
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          "https://financehelper-5mpy.onrender.com/api/transactions",
          formData,
          {
            withCredentials: true,
          }
        );
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };
  const getCategoryWiseData = (transactions) => {
    // Initialize an object to store category totals
    const categoryTotals = {};

    // Process each transaction
    transactions.forEach((transaction) => {
      // Skip if not an expense or missing amount
      if (transaction.type !== "expense" || !transaction.amount) return;

      // Get category name (handle different possible formats)
      const categoryName =
        typeof transaction.category === "string"
          ? transaction.category
          : transaction.category?.name
          ? transaction.category.name
          : "Uncategorized";

      // Initialize category if not exists
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = 0;
      }

      // Add the amount (convert to number if needed)
      const amount = Number(transaction.amount) || 0;
      categoryTotals[categoryName] += amount;
    });

    // Convert to array of objects and sort by amount (descending)
    const result = Object.entries(categoryTotals)
      .map(([name, totalAmount]) => ({
        category: name,
        totalAmount,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return result;
  };

  const getCategoryWiseChartData = (transactions, categories = []) => {
    // Create color map from available categories
    const colorMap = {};
    categories.forEach((cat) => {
      if (cat.name) colorMap[cat.name] = cat.color;
    });

    // Get base category data
    const categoryData = getCategoryWiseData(transactions);
    console.log(categoryData);
    // Add colors and reformat for chart
    return categoryData.map((item) => ({
      category: {
        name: item.category,
        color: colorMap[item.category] || getRandomColor(),
      },
      totalAmount: item.totalAmount,
    }));
  };

  // Helper function for random colors
  const getRandomColor = () => {
    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  console.log(categoryData);
  // Usage:
  const chartData = getCategoryWiseChartData(transactions, categories);
  // Usage:
  console.log(chartData);
  // Helper function to generate random colors

  // Then use it in your component:

  // Calculate dashboard metrics
  const totalExpenses = categoryData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );
  // console.log(totalExpenses);
  // Add this function inside your DashboardPage component
  // Replace your getHighestCategoryForCurrentMonth function with this:
  const getHighestCategoryForCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear();

    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date);
      return (
        txnDate.getMonth() + 1 === currentMonth &&
        txnDate.getFullYear() === currentYear
      );
    });

    // Group by category and calculate totals
    const categoryTotals = currentMonthTransactions.reduce((acc, txn) => {
      const category = txn.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + txn.amount;
      return acc;
    }, {});

    // Find the category with highest spending
    let highestCategory = null;
    let maxAmount = 0;

    for (const [category, amount] of Object.entries(categoryTotals)) {
      if (amount > maxAmount) {
        maxAmount = amount;
        highestCategory = {
          name: category,
          amount: amount,
        };
      }
    }

    return highestCategory;
  };

  // Usage
  const highestCategory = getHighestCategoryForCurrentMonth();
  // console.log(highestCategory);
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Personal Finance Dashboard</h1>
        <Button onClick={handleAddTransaction}>Add Transaction</Button>
      </div>

      <div className="space-y-6">
        <DashboardCards
          monthlyData={monthlyData}
          highestCategory={highestCategory}
          recentTransactions={recentTransactions}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <ExpenseChart data={monthlyData} />
          {console.log(categoryData)}
          <CategoryChart data={categoryData} />
        </div>

        <div className="bg-white rounded-lg shadow">
          <TransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentTransaction ? "Edit Transaction" : "Add New Transaction"}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={currentTransaction}
            categories={categories}
            onSubmit={handleSubmitTransaction}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
