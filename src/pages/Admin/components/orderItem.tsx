import { FixedSizeList } from "react-window";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, MapPin, Truck, Phone, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import ButtonLoader from "@/components/buttonLoader";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { Order, Driver } from "@/pages/Admin/types";
import { updateOrder } from "@/api/adminRoutes";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Define props for the Row component
interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    orders: Order[];
    onlinedriversRefetch: () => void;
    onlineDrivers: Driver[] | undefined;
  };
}

// Row component with TypeScript
const Row = ({ index, style, data }: RowProps) => {
  const { toast } = useToast();
  const [loadingOrder, setLoadingOrder] = useState<string | null>(); //state here to show that
  const queryClient = useQueryClient();
  const order = data.orders && data.orders[index];
  const { onlinedriversRefetch, onlineDrivers } = data;
  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onMutate: ({ orderId }) => {
      setLoadingOrder(orderId);
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      onlinedriversRefetch();
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

  const [orderUpdates, setOrderUpdates] = useState<{
    [key: number]: { status: string; driver_id: string };
  }>({});

  const handleUpdate = (orderId: number) => {
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

  const getDriverName = (
    driverId: string | number | undefined, // Allow number type
    drivers: Driver[] | undefined
  ) => {
    if (!driverId) return "Select driver";
    const driverIdString = String(driverId); // Convert to string for comparison
    const driver = drivers?.find((d) => String(d.id) === driverIdString);
    return driver ? `${driver.name} (${driver.phone_number})` : "Select driver";
  };

  const getStatusDisplay = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  return (
    <div style={style}>
      {/* Render single order card */}
      {order && (
        <div
          key={order.id}
          className="p-6 hover:bg-gray-50/50 transition-colors"
        >
          <div className="space-y-4">
            {/* Order Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h3 className="font-semibold text-md md:text-lg">
                  Order #{order.id}-{order.restaurant?.name}
                </h3>

                <Badge
                  variant="outline"
                  className={`${getStatusColor(order.status)} self-start`}
                >
                  {order.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {order.created_at !== null && (
                    <span className="text-xs md:text-sm italic">
                      {format(order.created_at, "PPpp")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col md:flex-row md:gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Customer:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{order.user.name}</span>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {order.user.phone_number}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{order.customer_location}</span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-green-600">
                  ₦{Number(order.total).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Driver:</span>
                {order.driver ? (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{order.driver.name}</span>
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {order.driver.phone_number}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Not Assigned</span>
                )}
              </div>
            </div>

            <Separator />

            {/* Update Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-gray-700 fold:hidden">
                    Update Status
                  </label>
                  <label className="hidden fold:inline text-sm font-medium text-gray-700">
                    Status
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
                      <SelectItem value="delivering">Delivering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 space-y-2">
                  <label className="fold:hidden text-sm font-medium text-gray-700">
                    Assign Driver
                  </label>
                  <label className="hidden fold:inline text-sm font-medium text-gray-700">
                    Driver
                  </label>
                  <Select
                    value={
                      orderUpdates[order.id]?.driver_id ||
                      (order.driver_id ? String(order.driver_id) : "") ||
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
                            (order.driver_id ? String(order.driver_id) : ""),
                          onlineDrivers
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_driver">No Driver</SelectItem>
                      {onlineDrivers?.map((driver: Driver) => (
                        <SelectItem key={driver.id} value={String(driver.id)}>
                          {driver.name} ({driver.phone_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
      )}
    </div>
  );
};

// OrderList component with TypeScript
interface OrderListProps {
  orders: Order[];
  onlinedriversRefetch: () => void;
  onlineDrivers: Driver[] | undefined;
}
const OrderList = ({
  orders,
  onlinedriversRefetch,
  onlineDrivers,
}: OrderListProps) => (
  <FixedSizeList
    height={400} // Adjust to max-h-[25rem]
    itemCount={orders.length}
    itemSize={430} // Adjust based on card height
    width="100%"
    itemData={{ orders, onlineDrivers, onlinedriversRefetch }}
  >
    {Row}
  </FixedSizeList>
);

export default OrderList;
