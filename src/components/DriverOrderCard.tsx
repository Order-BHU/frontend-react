import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, DollarSign, Package, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  id: string;
  restaurant: string;
  status: "pending" | "delivering" | "delivered" | "cancelled";
  time: string;
  distance: string;
  amount: string;
  address: string;
  customerName: string;
  items: number;
  className?: string;
  onViewDetails?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export function OrderCard({
  id,
  restaurant,
  status,
  time,
  distance,
  amount,
  address,
  customerName,
  items,
  className,
  onViewDetails,
  onAccept,
  onReject,
  onComplete,
}: OrderCardProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
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
    <Card className={cn("animate-scale overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Card Header with Restaurant Name */}
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{restaurant}</h3>
            <span className="text-gray-400 text-sm">#{id.slice(-4)}</span>
          </div>
          <Badge
            variant="outline"
            className={cn("font-medium", statusConfig[status].color)}
          >
            {statusConfig[status].label}
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
              <MapPin size={16} className="text-gray-500" />
              <span className="text-sm">{distance}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-gray-500" />
              <span className="text-sm font-medium">{amount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package size={16} className="text-gray-500" />
              <span className="text-sm">{items} items</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium">Delivery Address:</span>
            <p className="text-sm text-gray-500">{address}</p>
          </div>

          <div className="border-t pt-3 flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">Customer:</span> {customerName}
            </div>

            <div className="flex gap-2 items-center">
              {status === "pending" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => onReject && onReject(id)}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="orange"
                    onClick={() => onAccept && onAccept(id)}
                  >
                    Accept
                  </Button>
                </>
              )}

              {status === "delivering" && (
                <Button
                  size="sm"
                  variant="green"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => onComplete && onComplete(id)}
                >
                  Complete Delivery
                </Button>
              )}

              {onViewDetails && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex gap-1 items-center"
                  onClick={() => onViewDetails(id)}
                >
                  <span className="sr-md:inline-block">Details</span>
                  <ExternalLink size={14} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
