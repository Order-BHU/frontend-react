import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import ButtonLoader from "@/components/buttonLoader";

import { useQuery } from "@tanstack/react-query";
import { Order, Driver } from "@/pages/Admin/types";
import { allOrders } from "@/api/adminRoutes";

import OrderList from "./orderItem";
interface managementProps {
  driversError: Error | null;
  driversLoading: boolean;
  onlineDrivers: Driver[] | undefined;
  onlinedriversRefetch: () => void;
}
export default function OrderManagement({
  driversError,
  driversLoading,
  onlineDrivers,
  onlinedriversRefetch,
}: managementProps) {
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery<Order[], Error>({
    queryKey: ["allorders"],
    queryFn: allOrders,
  });

  return (
    <Card className="w-full max-h-[25rem] overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Package className="h-5 w-5" />
          Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[25rem] pb-16">
          {ordersLoading || driversLoading ? (
            <div className="flex items-center justify-center">
              <ButtonLoader />
            </div>
          ) : ordersError || driversError ? (
            <div className="flex items-center justify-center">
              <p>Error getting data</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              <OrderList
                orders={orders}
                onlineDrivers={onlineDrivers}
                onlinedriversRefetch={onlinedriversRefetch}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm">
                Orders will appear here when customers place them.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
