import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, User, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, memo } from "react";
import { Separator } from "@/components/ui/separator";
import ButtonLoader from "@/components/buttonLoader";

// Order type definition
export interface Order {
  id: number;
  status: string;
  customer_location: string;
  time: string;
  total: number;
  customerName: string;
  address: string;
  date?: string | null;
  phone_number_type?: string;
  items:
    | {
        image: string;
        menu_id: number;
        quantity: number;
        menu_name: string;
        menu_price: number;
        item_name: string;
      }[]
    | {
        menu_id: number;
        quantity: number;
        menu_name: string;
        menu_price: number;
        is_available: string;
        image: string;
      }[];
  user?: {
    phone_number: string;
    phone_number_type: string;
  };
}

// Props for the OrderCard component
interface OrderCardProps {
  order: Order;
  isPendingForThisItem: boolean;
  className?: string;
  onStatusChange: () => void;
  //onReady?: (id: string) => void;
}

const RestaurantOrderCard = memo(function OrderCard({
  order,
  isPendingForThisItem,
  className,
  onStatusChange,
}: // onReady,
OrderCardProps) {
  const {
    id,
    status,
    time,
    total,
    customerName,
    items,
    customer_location,
    user,
    date = "",
  } = order;

  const statusConfig = {
    ready: {
      label: "Ready for Pickup",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      bgGradient: "from-amber-50 to-orange-50",
    },
    pending: {
      label: "Waiting to be accepted",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      bgGradient: "from-blue-50 to-indigo-50",
    },
    delivering: {
      label: "In Progress",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      bgGradient: "from-orange-50 to-amber-50",
    },
    completed: {
      label: "Completed",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      bgGradient: "from-emerald-50 to-green-50",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-rose-100 text-rose-800 border-rose-200",
      bgGradient: "from-rose-50 to-red-50",
    },
  };

  const currentStatus =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    order && (
      <>
        <Card
          className={cn(
            "overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:shadow-xl",
            className
          )}
        >
          <CardContent className="p-0">
            {/* Header Section */}
            <div
              className={cn(
                "p-6 bg-gradient-to-r",
                currentStatus.bgGradient,
                "border-b border-gray-100"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Order #{String(id).slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  className={cn(
                    "px-3 py-1 font-semibold shadow-sm",
                    currentStatus.color
                  )}
                >
                  {currentStatus.label}
                </Badge>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-6">
              {/* Order Items with Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-500" />
                    Order Items
                  </h4>
                  <span className="text-2xl font-bold text-gray-900">
                    ₦{total.toLocaleString()}
                  </span>
                </div>

                <div className="grid gap-3">
                  {items &&
                    items.map((item) => (
                      <div
                        key={item.menu_id}
                        className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={
                              "image" in item && item.image
                                ? item.image
                                : "/placeholder.svg?height=64&width=64"
                            }
                            alt={item.menu_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "/placeholder.svg?height=64&width=64";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {item.menu_name}
                          </h5>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {/* ₦{item.menu_price?.toLocaleString()} */}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <Separator className="bg-gray-200" />

              {/* Time and Date Info */}
              {date && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>{time}</span>
                  </div>
                  {date && (
                    <div className="flex items-center gap-2">
                      <span>•</span>
                      <span>{date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Customer and Address Info */}
              <div className="grid gap-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">
                        Delivery Address
                      </h5>
                      <p className="text-gray-700 leading-relaxed">
                        {customer_location || "no adress"}
                      </p>
                    </div>
                  </div>

                  {
                    <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                      <User className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">
                          Customer Details
                        </h5>
                        <p className="text-gray-700 font-medium">
                          {customerName}
                        </p>
                        {user && (
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              {user.phone_number}
                            </span>

                            <span className="text-xs text-gray-500 italic">
                              ({user.phone_number_type})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  }
                </div>
              </div>

              {/* Action Buttons */}
              {(status === "pending" || status === "accepted") && (
                <div className="flex justify-end pt-2">
                  {status === "pending" && (
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => onStatusChange()}
                    >
                      Accept Order
                    </Button>
                  )}

                  {status === "accepted" && (
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => {
                        onStatusChange();
                      }}
                      disabled={isPendingForThisItem}
                    >
                      Set Ready
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </>
    )
  );
});

export default RestaurantOrderCard;
