import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User } from "lucide-react";

interface OrderItem {
  menu_id: number;
  quantity: number;
  menu_name: string;
  menu_price: number;
  item_name?: string;
}

interface TrackedOrder {
  order_id: string;
  order_code: string;
  status: "pending" | "accepted" | "ready" | "delivering" | "completed";
  items: OrderItem[];
  restaurant_name: string;
  total: number;
}

interface OrderTrackingCardProps {
  trackedOrder: TrackedOrder;
}

const getProgressData = (status: string) => {
  const statusMap = {
    pending: { progress: 10, message: "Restaurant is reviewing your order" },
    accepted: { progress: 25, message: "Your order is being prepared" },
    ready: { progress: 60, message: "Order is ready for pickup" },
    delivering: { progress: 85, message: "Your order is on the way!" },
    completed: { progress: 100, message: "Order delivered successfully" },
  };
  return statusMap[status as keyof typeof statusMap] || statusMap.pending;
};

const getStatusColor = (status: string) => {
  const colorMap = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-blue-100 text-blue-800 border-blue-200",
    ready: "bg-green-100 text-green-800 border-green-200",
    delivering: "bg-orange-100 text-orange-800 border-orange-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return colorMap[status as keyof typeof colorMap] || colorMap.pending;
};

export default function OrderTrackingCard({
  trackedOrder,
}: OrderTrackingCardProps) {
  const progressData = getProgressData(trackedOrder.status);
  const isDelivering = trackedOrder.status === "delivering";

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              Active Order
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Track your order in real-time
            </CardDescription>
          </div>
          <Badge
            className={`px-3 py-1 font-medium ${getStatusColor(
              trackedOrder.status
            )}`}
          >
            {trackedOrder.status === "pending"
              ? "Waiting for restaurant..."
              : trackedOrder.status.charAt(0).toUpperCase() +
                trackedOrder.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Details */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Order #{trackedOrder.order_id}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {trackedOrder.items?.map((order, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-900">
                      {order.menu_name} × {order.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{trackedOrder.restaurant_name}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">
                ₦{Number(trackedOrder.total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Code Section - Prominent when delivering */}
        {isDelivering && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200 shadow-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <User className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700 uppercase tracking-wide">
                  Delivery Confirmation Code
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Share this code with your rider
              </h3>
              <div className="flex justify-center items-center gap-3">
                {trackedOrder.order_code.split("").map((digit, index) => (
                  <div
                    key={index}
                    className="w-14 h-14 bg-white rounded-lg border-2 border-orange-300 flex items-center justify-center shadow-sm"
                  >
                    <span className="text-2xl font-bold text-gray-900">
                      {digit}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-orange-600 mt-3 font-medium">
                Show this code to confirm delivery
              </p>
            </div>
          </div>
        )}

        {/* Regular Code Display for other statuses */}
        {!isDelivering && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Order Code:
              </span>
              <div className="flex gap-1">
                {trackedOrder.order_code.split("").map((digit, index) => (
                  <span
                    key={index}
                    className="w-8 h-8 bg-white rounded border flex items-center justify-center text-sm font-bold text-gray-900"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">
              Order Progress
            </span>
            <span className="text-sm font-semibold text-orange-600">
              {progressData.progress}%
            </span>
          </div>

          <Progress
            value={progressData.progress}
            className="h-3 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-amber-500"
          />

          {/* Progress Steps */}
          <div className="flex justify-between items-center text-xs">
            {[
              { status: "accepted", label: "Preparing", threshold: 20 },
              { status: "ready", label: "Ready", threshold: 50 },
              { status: "delivering", label: "Delivering", threshold: 80 },
              { status: "completed", label: "Delivered", threshold: 100 },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    progressData.progress >= step.threshold
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {progressData.progress >= step.threshold ? "✓" : index + 1}
                </div>
                <span className="mt-1 text-gray-600 hidden sm:block">
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 italic">
              {progressData.message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
