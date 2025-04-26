import React from "react";
import { Button } from "./Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  console.log(transactions);
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction._id}>
            <TableCell>
              {format(new Date(transaction.date), "MMM dd, yyyy")}
            </TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>
              <span
                className="inline-block h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: transaction.category.color }}
              />
              {transaction.category}
            </TableCell>
            <TableCell className="text-right font-medium">
              ${transaction.amount.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(transaction)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(transaction._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionList;
