import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { transactions } from "@/api/misc";
import { FiDollarSign, FiCreditCard, FiTrendingUp } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionCard, {
  Transaction,
} from "@/components/restaurantTransactionCard";
import ButtonLoader from "@/components/buttonLoader";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 },
  }),
};

const RestaurantFinancialTab: React.FC = () => {
  // Fetch transactions
  const { data: transactionsData, status: transactionsStatus } = useQuery({
    queryFn: transactions,
    queryKey: ["transactions"],
  });
  useEffect(() => {
    if (transactionsData) console.log("transData: ", transactionsData);
  }, [transactionsData]);

  if (transactionsStatus === "pending") {
    return (
      <div className="flex justify-center items-center h-64">
        <ButtonLoader color="border-primary-500" />
      </div>
    );
  }

  // Calculate financial metrics
  const totalRevenue =
    transactionsData?.data?.reduce((sum: number, transaction: Transaction) => {
      return sum + parseFloat(transaction.amount);
    }, 0) || 0;

  const totalTransactions = transactionsData?.data?.length || 0;
  const averageTransactionValue =
    totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  if (transactionsStatus === "error") {
    return (
      <div className="text-center py-8 text-secondary-500">
        Something went wrong. Please try again
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Financial Overview Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={1}
        className="grid gap-6 md:grid-cols-3"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FiDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <FiCreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <FiTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{averageTransactionValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={2}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-secondary-900">
          Recent Transactions
        </h3>
        {transactionsData && transactionsData?.data?.length > 0 ? (
          <div className="space-y-4">
            {transactionsData?.data
              ?.slice(0, 10)
              .map((transaction: Transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-secondary-500">
            No transactions found
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RestaurantFinancialTab;
