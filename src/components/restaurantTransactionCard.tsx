import React from "react";
import { Check, X, ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Transaction {
  amount: string;
  created_at: string;
  reference: string;
  status: string;
  type: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const formattedDate = new Date(transaction.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const formattedTime = new Date(transaction.created_at).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check size={16} className="text-green-500" />;
      case "failed":
        return <X size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "credit":
        return <ArrowDown size={16} className="text-green-500" />;
      case "debit":
        return <ArrowUp size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
          )}
        >
          {getTypeIcon(transaction.type)}
        </div>
        <div>
          <p className="font-medium text-sm">{transaction.reference}</p>
          <p className="text-xs text-gray-500">
            {formattedDate} • {formattedTime}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {getStatusIcon(transaction.status)}
          <span
            className={cn(
              "text-xs capitalize",
              transaction.status === "completed"
                ? "text-green-500"
                : transaction.status === "failed"
                ? "text-red-500"
                : "text-yellow-500"
            )}
          >
            {transaction.status}
          </span>
        </div>
        <p
          className={cn(
            "font-medium",
            transaction.type === "credit" ? "text-green-600" : "text-red-600"
          )}
        >
          {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;
