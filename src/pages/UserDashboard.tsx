import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Progress } from "@/components/ui/progress";

import { User, LogOut, ChevronRight, MapPin, CreditCard } from "lucide-react";
import { editProfile, dashboard, changePassword } from "@/api/misc";
import { useQuery, useMutation } from "@tanstack/react-query";
import { myOrders, trackOrder } from "@/api/restaurant";
import { orderType, orderHistoryType } from "@/interfaces/restaurantType";
import Loader from "@/components/loaderAnimation";
import EditProfileModal from "@/components/editProfileModal";

export default function UserDashboardPage() {
  const { data: userDetails, refetch: refetchDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: dashboard,
    refetchOnWindowFocus: false,
  });

  const { data: trackedOrder, status: trackedStatus } = useQuery({
    queryFn: () => trackOrder(),
    queryKey: ["trackedorders"], // Ensure key changes when userOrder changes
    staleTime: 30000,
  });
  const { data: orderHistory, status: historyStatus } = useQuery({
    queryFn: () => myOrders("history"),
    queryKey: ["history"],
  });
  const setTrackedProgress = () => {
    if (!trackedOrder) {
      return {
        progress: 0,
        message: "no order",
      };
    } else {
      const status: string = trackedOrder.status;
      switch (status) {
        case "pending":
          return {
            progress: 0,
            message:
              "Your order has been made and is waiting to be confirmed by the restaurant",
          };
        case "accepted":
          return {
            progress: 20,
            message:
              "Your order has been accepted. Waiting for the chefs to work their magic",
          };
        case "ready":
          return {
            progress: 50,
            message:
              "Almost There! A delivery person will be assigned in no time!",
          };
        case "delivering":
          return {
            progress: 80,
            message: "Any minute now... Your food is on its way to you",
          };
        case "delivered":
          return {
            progress: 100,
            message: "Enjoy your meal!!",
          };
        default:
          return {
            progress: 0,
            message:
              "Your order has been made and is waiting to be confirmed by the restaurant",
          };
      }
    }
    //this passes the progress to the progress element
  };
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Customer Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back! Manage your orders and account settings
              </p>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Profile Card */}
            <Card className="card-hover-effect md:col-span-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent h-40" />
              <CardHeader className="flex flex-row items-center justify-between relative z-10">
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                    <AvatarImage
                      src={userDetails?.user?.profile_picture_url}
                      alt={userDetails?.user?.name}
                    />
                    <AvatarFallback className="bg-orange-100 text-orange-600">
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {userDetails?.user?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {userDetails?.user?.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {userDetails?.user?.phone_number}
                    </p>
                    <div className="flex items-center mt-2"></div>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span>123 Main Street, Apt 4B, New York, NY 10001</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Frequently used actions and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <EditProfileModal
                  successFn={refetchDetails}
                  userDetails={{
                    name: userDetails?.user?.name,
                    phone_number_type: userDetails?.user?.phone_number_type,
                  }}
                />
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl border-gray-200 bg-white shadow-sm"
                >
                  <span className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Transactions
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl border-gray-200 bg-white shadow-sm"
                >
                  <span className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Orders Section */}
          <div className="mt-8">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full max-w-sm grid-cols-2 rounded-xl bg-slate-100">
                <TabsTrigger
                  value="active"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Active Orders
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Order History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                {trackedStatus === "pending" ? (
                  <Loader />
                ) : (
                  trackedOrder && (
                    <Card className="gradient-border">
                      <CardHeader>
                        <CardTitle className="text-xl text-gray-900">
                          Active Orders
                        </CardTitle>
                        <CardDescription>
                          Track your current orders in real-time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-lg bg-orange-50 p-4 border border-orange-100">
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-500">
                                  Order BHUO-{trackedOrder.order_id}{" "}
                                  <span className="italic text-sm font-medium text-black">
                                    {trackedOrder.order_code}
                                  </span>
                                </span>
                                <span className="ml-3 rounded-full bg-orange-200 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                                  {trackedOrder.status === "pending"
                                    ? "Waiting for restaurant..."
                                    : trackedOrder.status}
                                </span>
                              </div>
                              <ul>
                                {trackedOrder.items.map(
                                  (order: {
                                    menu_id: number;
                                    quantity: number;
                                    menu_name: string;
                                    menu_price: number;
                                    item_name: string /*man... he changed the names without telling, and now idk what to add or remove. bear with me here, this is for pending orders but idk if the change carries over to all order types */;
                                  }) => (
                                    <li>
                                      <h3 className="mt-1 text-lg font-medium text-gray-900">
                                        {`${order.menu_name} x${order.quantity}`}
                                      </h3>
                                    </li>
                                  )
                                )}
                              </ul>

                              <p className="text-sm text-gray-600">
                                {trackedOrder.restaurant_name}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="mt-2 font-medium text-gray-900">
                                ₦{Number(trackedOrder.total).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                Order Progress
                              </span>
                              <span className="text-sm font-medium text-orange-600">
                                {setTrackedProgress().progress}%
                              </span>
                            </div>
                            <Progress
                              value={setTrackedProgress().progress}
                              className="h-2"
                            />

                            <div className="flex w-full justify-between text-xs text-gray-600 mt-2">
                              <span className="flex flex-col items-center">
                                <span className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px]">
                                  ✓
                                </span>
                                <span className="mt-1">Preparing</span>
                              </span>
                              <span className="flex flex-col items-center">
                                <span className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center text-white relative text-[10px]">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                                  ✓
                                </span>
                                <span className="mt-1">Ready for Pickup</span>
                              </span>
                              <span className="flex flex-col items-center">
                                <span className="h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-[10px]">
                                  3
                                </span>
                                <span className="mt-1">On the way</span>
                              </span>
                              <span className="flex flex-col items-center">
                                <span className="h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-[10px]">
                                  4
                                </span>
                                <span className="mt-1">Delivered</span>
                              </span>
                            </div>
                          </div>
                          <span className="italic h-4 flex items-center justify-left text-gray-500 text-[12px] mt-3">
                            {setTrackedProgress().message}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">
                      Order History
                    </CardTitle>
                    <CardDescription>
                      View your past orders and reorder your favorites
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Past order item */}
                      {orderHistory &&
                        orderHistory.orders.map((order: orderHistoryType) => (
                          <div
                            key={order.order_id}
                            className="rounded-lg border border-gray-200 p-4 transition-all hover:bg-gray-50 hover:border-orange-200"
                          >
                            <div className="flex flex-col sm:flex-row justify-between">
                              <div>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-500">
                                    Order #BHUO-{order.order_id}
                                  </span>
                                  <span className="ml-3 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                    Delivered
                                  </span>
                                </div>
                                <h3 className="mt-1 text-lg font-medium text-gray-900">
                                  {order.restaurant_name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {order.order_date}
                                </p>
                                <ul>
                                  {order.items.map(
                                    (item: {
                                      menu_id: number;
                                      quantity: number;
                                      menu_name: string;
                                      menu_price: number;
                                      is_available: string;
                                      menu_picture: string;
                                    }) => (
                                      <li className="text-sm font-medium text-gray-500">{`${item.menu_name} x${item.quantity} `}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                              <div className="flex flex-col sm:items-end mt-3 sm:mt-0">
                                <span className="font-medium text-gray-900">
                                  ₦{order.total}
                                </span>

                                {/* <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 rounded-xl text-orange-600 border-orange-200"
                          >
                            Reorder
                          </Button> */}
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Past order item */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

// StarRating component for displaying ratings
