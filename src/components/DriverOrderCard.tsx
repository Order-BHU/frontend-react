import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Package } from "lucide-react";
import { cn } from "@/lib/utils";

// Order type definition
export interface Order {
  id: number;
  restaurant: string;
  status: string;
  time: string;
  amount: number;
  customerName: string;
  address: string;
  items: {
    menu_id: number;
    quantity: number;
    menu_name: string;
    menu_price: number;
    item_name: string /*man... he changed the names without telling, and now idk what to add or remove. bear with me here, this is for ready orders but idk if the change carries over to all order types */;
  }[];
}

// Props for the OrderCard component
interface OrderCardProps {
  order: Order;
  className?: string;
  onViewDetails?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export function OrderCard({
  order,
  className,
  //onViewDetails,
  onAccept,
  //onReject,
  onComplete,
}: OrderCardProps) {
  const { id, restaurant, status, time, amount, customerName, items, address } =
    order;

  const statusConfig = {
    ready: {
      label: "ready",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    delivering: {
      label: "In Progress",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    delivered: {
      label: "completed",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  };

  return (
    <Card className={cn("animate-scale overflow-hidden mb-4", className)}>
      <CardContent className="p-0">
        {/* Card Header with Restaurant Name */}
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-black">{restaurant}</h3>
            <span className="text-gray-400 text-sm">
              #{String(id).slice(-4)}
            </span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "font-medium",
              statusConfig[
                status as "ready" | "delivering" | "delivered" | "cancelled"
              ].color
            )}
          >
            {
              statusConfig[
                status as "ready" | "delivering" | "delivered" | "cancelled"
              ].label
            }
          </Badge>
        </div>

        {/* Order Details */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm">{time}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-gray-500" />
              <span className="text-sm font-medium">{amount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package size={16} className="text-gray-500" />
              <ul>
                {items.map((item) => (
                  <li
                    key={item.menu_id}
                  >{`${item.menu_name} x${item.quantity}`}</li>
                ))}
              </ul>
            </div>
          </div>

          {
            <div className="space-y-1">
              <span className="text-sm font-medium">Delivery Address:</span>
              <p className="text-sm text-gray-500">{address}</p>
            </div>
          }

          <div className="border-t pt-3 flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">Customer:</span> {customerName}
            </div>

            <div className="flex gap-2 items-center">
              {status === "ready" && (
                <>
                  {/* <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => onReject && onReject(String(id))}
                  >
                    Reject
                  </Button> */}
                  <Button
                    size="sm"
                    variant="orange"
                    onClick={() => onAccept && onAccept(String(id))}
                  >
                    Start Order
                  </Button>
                </>
              )}

              {status === "delivering" && (
                <Button
                  size="sm"
                  variant="green"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => onComplete && onComplete(String(id))}
                >
                  Complete Delivery
                </Button>
              )}

              {/* {onViewDetails && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex gap-1 items-center"
                  onClick={() => onViewDetails(String(id))}
                >
                  <span className="sr-md:inline-block">Details</span>
                  <ExternalLink size={14} />
                </Button>
              )} */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
