import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
//import ButtonLoader from "@/components/buttonLoader";

// Order type definition
export interface Order {
  id: number;
  restaurant: string;
  status: string;
  time: string;
  amount: number;
  customerName: string;
  phone_number: string;
  address: string;
  date?: string | null;
  phone_number_type?: string;
  items:
    | {
        menu_id: number;
        quantity: number;
        menu_name: string;
        menu_price: number;
        item_name: string;
      }[]
    | {
        menu_id: number; //this is here to accomodate orderHistoryType as it has two extra fields
        quantity: number;
        menu_name: string;
        menu_price: number;
        is_available: string;
        menu_picture: string;
      }[];
}

// Props for the OrderCard component
interface OrderCardProps {
  order: Order;
  className?: string;
  onViewDetails?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (code: string) => void;
}

export function OrderCard({
  order,
  className,
  //onViewDetails,
  onAccept,
  //onReject,
  onComplete,
}: OrderCardProps) {
  const {
    id,
    restaurant,
    status,
    time,
    amount,
    customerName,
    items,
    address,
    phone_number,
    date = "",
    phone_number_type = "", //default values for the optional mandem
  } = order;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [completionCode, setCompletionCode] = useState("");

  const handleCompleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleSubmitCode = () => {
    onComplete && onComplete(completionCode);
    setIsDialogOpen(false);
    setCompletionCode(""); // Reset code after submission
  };

  const statusConfig = {
    ready: {
      label: "ready",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    delivering: {
      label: "In Progress",
      color: "bg-orange-400 text-black border-blue-200",
    },
    completed: {
      label: "completed",
      color: "bg-green-500 text-green-800 border-green-200",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  };

  return (
    <>
      <Card
        className={cn(
          "animate-scale overflow-hidden mb-4 shadow-soft-md",
          className
        )}
      >
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
                  status as "ready" | "delivering" | "completed" | "cancelled"
                ].color
              )}
            >
              {
                statusConfig[
                  status as "ready" | "delivering" | "completed" | "cancelled"
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
                <p className="text-sm text-gray-500">
                  {address}
                  {date && `•${date}`}
                </p>
              </div>
            }

            <div className="border-t pt-3 flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">Customer:</span>{" "}
                {`${customerName} •${" "}
                ${phone_number} •`}
                {phone_number_type && (
                  <span className="italic">{phone_number_type}</span>
                )}
              </div>

              <div className="flex gap-2 items-center">
                {status === "ready" && (
                  <Button
                    size="sm"
                    variant="orange"
                    onClick={() => onAccept && onAccept(String(id))}
                  >
                    Start Order
                  </Button>
                )}

                {status === "delivering" && (
                  <Button
                    size="sm"
                    variant="green"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleCompleteClick}
                  >
                    Complete Delivery
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Code Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Delivery Completion Code</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter the verification code"
              value={completionCode}
              onChange={(e) => setCompletionCode(e.target.value)}
              className="mb-2"
            />
            <p className="text-sm text-gray-500">
              Please enter the code provided by the customer to complete this
              delivery.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="green"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmitCode}
              disabled={!completionCode.trim()}
            >
              Verify & Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
