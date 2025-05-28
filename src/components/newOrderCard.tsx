import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Img } from "react-image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import ButtonLoader from "@/components/buttonLoader";
import { format } from "date-fns";

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
}

// Props for the OrderCard component
interface OrderCardProps {
  order: Order;
  isPendingForThisItem: boolean;
  className?: string;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (code: string) => void;
  isdriver?: boolean;
}

export default function OrderCard({
  order,
  isPendingForThisItem,
  className,
  onAccept,
  onComplete,
  isdriver,
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
    phone_number_type = "",
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

  // Get the first item's picture if available
  const firstItemWithPicture = items.find(
    (item) => "image" in item && item.image
  ) as { image: string } | undefined;

  const defaultImage = "/placeholder.svg?height=80&width=80";
  const imageSrc = firstItemWithPicture?.image || defaultImage;

  const statusConfig = {
    ready: {
      label: "Ready for Pickup",
      color: "bg-amber-500 text-black border-amber-200",
    },
    delivering: {
      label: "In Progress",
      color: "bg-red-500 text-blue-800 border-blue-200",
    },
    completed: {
      label: "Completed",
      color: "bg-emerald-500 text-emerald-800 border-emerald-200",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-rose-500 text-rose-800 border-rose-200",
    },
  };

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden mb-4 transition-all duration-200 hover:shadow-md",
          className
        )}
      >
        <CardContent className="p-0">
          {/* Card Header with Restaurant Name */}
          <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full border bg-gradient-to-r from-orange-200 to-primary-400 flex items-center justify-center text-slate-700 font-medium overflow-hidden">
                {restaurant.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium text-slate-900">{restaurant}</h3>
                <span className="text-slate-500 text-xs">
                  Order #{String(id).slice(-4)}
                </span>
              </div>
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
          <div className="p-5 space-y-4 ">
            <div className="flex gap-4">
              {/* Image Section */}
              <div className="relative h-20 w-20 rounded-md overflow-hidden border bg-slate-50 flex-shrink-0">
                <Img
                  src={imageSrc || "/placeholder.svg"}
                  alt="Order item"
                  className="object-cover w-full h-full"
                  loader={
                    <div className="w-full h-full bg-slate-100 animate-pulse" />
                  }
                  unloader={
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      No image
                    </div>
                  }
                />
              </div>

              {/* Order Info */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    {isdriver && (
                      <>
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-sm">{time}</span>
                      </>
                    )}
                    {date && (
                      <span className="text-sm text-slate-400">• {date}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-slate-900">
                      ₦{amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-900">
                    Items:
                  </div>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {items.slice(0, 2).map((item) => (
                      <li key={item.menu_id} className="flex justify-between">
                        <span>{item.menu_name}</span>
                        <span className="text-slate-500">x{item.quantity}</span>
                      </li>
                    ))}
                    {items.length > 2 && (
                      <li className="text-xs text-slate-500">
                        +{items.length - 2} more items
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    Delivery Address
                  </div>
                  <p className="text-sm text-slate-600">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                {date !== null && (
                  <>
                    <Clock size={16} className="text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {format(date, "PPpp")}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {onAccept && (
                <div className="flex items-start gap-2">
                  <User size={16} className="text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      Customer
                    </div>
                    <p className="text-sm text-slate-600">{customerName}</p>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Phone size={12} />
                      <span>{phone_number}</span>
                      {phone_number_type && (
                        <span className="text-xs italic">
                          ({phone_number_type})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end items-center gap-3">
              {status === "ready" && (
                <Button
                  size="sm"
                  className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white ${
                    isdriver === false ? " hidden" : ""
                  }`}
                  onClick={() => onAccept && onAccept(String(id))}
                >
                  Start Order
                </Button>
              )}

              {status === "delivering" && (
                <Button
                  size="sm"
                  className={`${
                    isdriver === false ? "hidden " : ""
                  }bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white`}
                  onClick={handleCompleteClick}
                >
                  {isPendingForThisItem ? (
                    <ButtonLoader size="w-8 h-8" />
                  ) : (
                    "Complete Delivery"
                  )}
                </Button>
              )}
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
            <p className="text-sm text-slate-500">
              Please enter the code provided by the customer to complete this
              delivery.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
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
