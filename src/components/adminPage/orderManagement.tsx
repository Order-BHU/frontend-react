import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Separator } from "@radix-ui/react-separator";
import {
  Package,
  Loader,
  User,
  MapPin,
  DollarSign,
  Truck,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import ButtonLoader from "../buttonLoader";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Driver, Order } from "@/interfaces/adminPageAllOrders";
import { updateOrder, allOrders } from "@/api/misc";
import { useToast } from "@/hooks/use-toast";

interface orderProps {
  onlineDrivers: Driver[] | undefined;
  driversLoading: boolean;
  driversError: Error | null;
  driversRefetch: () => {};
}
export default function OrderManagement({
  onlineDrivers,
  driversError,
  driversLoading,
  driversRefetch,
}: orderProps) {
  const [loadingOrder, setLoadingOrder] = useState<string | null>(); //state here to show that
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getDriverName = (
    driverId: string | undefined,
    drivers: Driver[] | undefined
  ) => {
    if (!driverId) return "Select driver";
    const driver = drivers?.find((d) => String(d.id) === driverId);
    return driver ? `${driver.name} (${driver.phone_number})` : "Select driver";
  };

  const getStatusDisplay = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Fetch all orders
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery<Order[], Error>({
    queryKey: ["allorders"],
    queryFn: allOrders,
  });

  // Fetch online drivers

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "delivering":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-emerald-500 text-emerald-800 border-emerald-200";
    }
  };

  // Mutation for updating an order
  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onMutate: ({ orderId }) => {
      setLoadingOrder(orderId);
    },
    onSuccess: (data) => {
      driversRefetch();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setLoadingOrder(null);
      toast({
        title: "Success",
        description: data.message,
      });
    },
    onError: (error) => {
      setLoadingOrder(null);
      toast({
        title: "something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // State to manage form inputs for each order
  const [orderUpdates, setOrderUpdates] = useState<{
    [key: number]: { status: string; driver_id: string };
  }>({});

  const handleUpdate = (orderId: number) => {
    //this function updates the details of an order. Status and driver assigned
    const updateData = orderUpdates[orderId] || {};
    if (!updateData.status && !updateData.driver_id) return;
    updateOrderMutation.mutate({
      driver_id: updateData.driver_id || "",
      status: updateData.status || "",
      orderId: String(orderId),
    });
  };

  const handleInputChange = (
    orderId: number,
    field: "status" | "driver_id",
    value: string
  ) => {
    setOrderUpdates((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

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
              <Loader />
            </div>
          ) : ordersError || driversError ? (
            <div className="flex items-center justify-center">
              <p>Error getting data</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Order Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            Order #{order.id}
                          </h3>
                          <Badge
                            variant="outline"
                            className={getStatusColor(order.status)}
                          >
                            {order.status}
                          </Badge>
                          {order.created_at !== null && (
                            <span className="text-sm italic">
                              {format(order.created_at, "PPpp")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">{order.user.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">
                          {order.customer_location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-green-600">
                          ₦
                          {Number.parseFloat(
                            order.total.toLocaleString()
                          ).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Driver:</span>
                        {order.driver ? (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {order.driver.name}
                            </span>
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {order.driver.phone_number}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">
                            Not Assigned
                          </span>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Update Controls */}
                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Update Status
                        </label>
                        <Select
                          value={orderUpdates[order.id]?.status || order.status}
                          onValueChange={(value) =>
                            handleInputChange(order.id, "status", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {getStatusDisplay(
                                orderUpdates[order.id]?.status || order.status
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="delivering">
                              Delivering
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Assign Driver
                        </label>
                        <Select
                          value={
                            orderUpdates[order.id]?.driver_id ||
                            order.driver_id ||
                            ""
                          }
                          onValueChange={(value) =>
                            handleInputChange(order.id, "driver_id", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {getDriverName(
                                orderUpdates[order.id]?.driver_id ||
                                  order.driver_id,
                                onlineDrivers
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no_driver">No Driver</SelectItem>
                            {onlineDrivers?.map((driver) => (
                              <SelectItem
                                key={driver.id}
                                value={String(driver.id)}
                              >
                                {driver.name} ({driver.phone_number})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={() => handleUpdate(order.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                        disabled={loadingOrder === String(order.id)}
                      >
                        {loadingOrder === String(order.id) ? (
                          <ButtonLoader size="w-7 h-7" />
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
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
