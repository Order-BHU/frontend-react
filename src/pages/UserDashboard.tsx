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

import { User, LogOut, ChevronRight } from "lucide-react";
import { logOut } from "@/api/auth";
import { dashboard } from "@/api/misc";
import { useQuery, useMutation } from "@tanstack/react-query";
import { myOrders, trackOrder } from "@/api/restaurant";
import { orderHistoryType } from "@/interfaces/restaurantType";
import Loader from "@/components/loaderAnimation";
import EditProfileModal from "@/components/EditUserProfileModal";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import UseAuthStore from "@/stores/useAuthStore";
import { useEffect } from "react";
import OrderCard from "@/components/OrderCard";
import OrderTrackingCard from "@/components/trackOrderCard";

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { logout } = UseAuthStore();
  const { toast } = useToast();
  const { data: userDetails, refetch: refetchDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: dashboard,
    refetchOnWindowFocus: false,
  });

  const { data: trackedOrder, status: trackedStatus } = useQuery({
    queryFn: trackOrder,
    queryKey: ["trackedorders"], // Ensure key changes when userOrder changes
    staleTime: 30000,
  });
  const { data: orderHistory, status: historyStatus } = useQuery({
    queryFn: () => myOrders("history"),
    queryKey: ["history"],
    staleTime: 300000,
  });
  useEffect(() => {
    console.log("tracked: ", trackedOrder);
  }, [trackedOrder]);
  const { status: logoutStatus, mutate: logoutMutate } = useMutation({
    mutationFn: logOut,
    onSuccess: (data) => {
      logout();
      navigate("/login/");
      toast({
        title: "success!",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    },
  });

  const handleLogout = () => {
    const usertoken = localStorage.getItem("BHUO-token");
    if (!usertoken) {
      toast({
        title: "Error",
        description: "Not authenticated",
        variant: "destructive",
      });
      return;
    }
    logoutMutate(usertoken);
  };

  useEffect(() => {
    //this handles the toast so user's can add their numbers if it's null
    if (userDetails && !userDetails.user.phone_number) {
      setTimeout(() => {
        toast({
          title: "Phone Number not set",
          description: "please update your phone number in 'Edit Profile'",
        });
      }, 500);
    }
  }, [userDetails]);
  useEffect(() => {
    if (userDetails) {
      localStorage.setItem("pfp", userDetails.user.profile_picture_url);
    }
  }, [userDetails]);

  if (logoutStatus === "pending") {
    return (
      <div>
        <Loader />
        <p>Logging you Out</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pt-32">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              {userDetails && (
                <h1 className="text-3xl font-bold text-gray-900">
                  {`Hello, ${userDetails?.user?.name.split(" ")[0] || ""}`}
                </h1>
              )}

              <p className="text-gray-500 mt-1">
                {`Welcome back! Manage your orders and account settings`}
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
                      src={
                        localStorage.getItem("pfp") ||
                        userDetails?.user?.profile_picture_url
                      }
                      alt={
                        localStorage.getItem("name") || userDetails?.user?.name
                      }
                      className="object-cover object-center"
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
                    {/* <div className="mt-2 flex items-center text-xs text-gray-500">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span></span>
                    </div> */}
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
                {userDetails && (
                  <EditProfileModal
                    successFn={refetchDetails}
                    userDetails={{
                      name: userDetails?.user?.name,
                      phone_number_type: userDetails?.user?.phone_number_type,
                      phone_number: userDetails?.user?.phone_number,
                    }}
                  />
                )}
                {/* <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl border-gray-200 bg-white shadow-sm"
                >
                  <span className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Transactions
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button> */}

                <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl border-gray-200 bg-white shadow-sm"
                  onClick={handleLogout}
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
                    <>
                      {trackedOrder.message === "No Active Order" ? (
                        <p className="text-center text-black my-8">
                          No Active Order
                        </p>
                      ) : (
                        <OrderTrackingCard trackedOrder={trackedOrder} />
                      )}
                    </>
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
                      {historyStatus === "pending" ? (
                        <Loader />
                      ) : (
                        orderHistory &&
                        orderHistory?.orders?.map((order: orderHistoryType) => (
                          <OrderCard
                            key={order.order_id}
                            isdriver={false}
                            order={{
                              id: order.order_id,
                              restaurant: order.restaurant_name,
                              status: order.status,
                              time: "30 min",
                              amount: Number(order.total),
                              phone_number: order.user_phoneNumber,
                              customerName: order.user_name,
                              items: order.items,
                              address: order.location,
                              date: order.order_date,
                            }}
                            isPendingForThisItem={false}
                          />
                        ))
                      )}

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
