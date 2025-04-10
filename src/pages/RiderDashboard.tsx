import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { OrderCard } from "@/components/DriverOrderCard";
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
import { myOrders, updateOrderStatus, setDriverStatus } from "@/api/restaurant";
import { orderHistoryType, orderType } from "@/interfaces/restaurantType";
import Loader from "@/components/loaderAnimation";
import EditProfileModal from "@/components/editProfileModal";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import UseAuthStore from "@/stores/useAuthStore";
import { FiCreditCard, FiDollarSign, FiShoppingBag } from "react-icons/fi";
import { useState, useEffect } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 },
  }),
};

export default function RiderDashboardPage() {
  const [allOrders, setAllOrders] = useState<orderType[]>([]); //I'll place all orders(pending and delivering) in the same array so it's better for a responsive UI and not redundant
  const navigate = useNavigate();
  const { logout } = UseAuthStore();
  const { toast } = useToast();
  const { data: userDetails, refetch: refetchDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: dashboard,
    refetchOnWindowFocus: false,
  });

  const {
    status: pendingStatus,
    data: pendingOrders,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ["activeOrders"],
    queryFn: () => myOrders("ready"),
  });

  const {
    data: deliveringOrders,
    refetch: refetchDelivering,
    status: deliveringStatus,
  } = useQuery({
    queryKey: ["deliveringOrders"],
    queryFn: () => myOrders("delivering"),
  });

  useEffect(() => {
    if (pendingOrders) {
      //since I'm adding them one by one, I'll have to make sure the items I'm adding don't exist so we dont' have duplicates
      setAllOrders((prev) => {
        const newOrders = pendingOrders.orders
          .map((item: orderType) => ({
            ...item,
            status: "ready",
          }))
          .filter(
            (newItem: orderType) =>
              !prev.some(
                (existingItem) => existingItem.order_id === newItem.order_id
              )
          ); // Check for duplicates

        return [...prev, ...newOrders];
      });
    }
  }, [pendingOrders]);
  useEffect(() => {
    console.log("all orders: ", allOrders);
  }, [allOrders]);
  useEffect(() => {
    if (deliveringOrders) {
      //since I'm adding them one by one, I'll have to make sure the items I'm adding don't exist so we dont' have duplicates
      setAllOrders((prev) => {
        const newOrders = deliveringOrders.orders
          .map((item: orderType) => ({
            ...item,
            status: "delivering",
          }))
          .filter(
            (newItem: orderType) =>
              !prev.some(
                (existingItem) => existingItem.order_id === newItem.order_id
              )
          ); // Check for duplicates

        return [...prev, ...newOrders];
      });
    }
  }, [deliveringOrders]);

  const { data: orderHistory, status: historyStatus } = useQuery({
    queryFn: () => myOrders("history"),
    queryKey: ["history"],
  });
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

  useEffect(() => {
    console.log("history: ", orderHistory);
  }, [orderHistory]);

  const handleLogout = () => {
    const usertoken = localStorage.getItem("token");
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

  if (logoutStatus === "pending") {
    return (
      <div>
        <Loader />
        <p>Logging you Out</p>
      </div>
    );
  }
  const { mutate: orderStatusMutate, status: completeOrderStatus } =
    useMutation({
      mutationFn: updateOrderStatus,
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: data.message,
        });
        refetchPending();
        refetchDelivering();
        // refetchHistory();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const handlecategoryStatusChange = (
    orderId: number,
    newcategoryStatus: string,
    code?: string
  ) => {
    console.log("order id: ", orderId);
    console.log("verification code: ", code);
    orderStatusMutate({
      orderId: Number(orderId),
      status: newcategoryStatus,
      code: code,
    });
  };
  const { mutate: driverStatusMutate } = useMutation({
    mutationFn: setDriverStatus,
    onSuccess: () => {
      refetchPending();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const handleDriverStatusChange = () => {
    console.log("running");
    if (!userDetails) {
      return;
    }
    if (userDetails && userDetails.user.status === "online") {
      driverStatusMutate("offline", {
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update driver status. Please try again.",
            variant: "destructive",
          });
        },
      });
    } else if (userDetails && userDetails.user.status === "offline") {
      driverStatusMutate("online", {
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update driver status. Please try again.",
            variant: "destructive",
          });
        },
      });
    }
    refetchDetails();
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={3}
            className=""
          >
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
                  <EditProfileModal
                    successFn={refetchDetails}
                    userDetails={{
                      name: userDetails?.user?.name,
                      phone_number_type: userDetails?.user?.phone_number_type,
                    }}
                  />
                  <Button
                    onClick={handleDriverStatusChange}
                    variant="outline"
                    className={`${
                      userDetails?.user?.status === "online"
                        ? " bg-green-600"
                        : ""
                    }w-full justify-between rounded-xl border-gray-200 bg-white shadow-sm overflow-hidden px-0`}
                  >
                    <span className="flex items-center">
                      {userDetails?.user?.status === "online"
                        ? "Online"
                        : "Offline: Click to go online"}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>

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
          </motion.div>

          {/**db stats section */}
          {/* Dashboard Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={3}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8"
          >
            {/* Wallet Balance */}
            <div className="bg-white rounded-2xl shadow-soft-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-secondary-500">
                  Total Deliveries
                </h3>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <FiCreditCard />
                </div>
              </div>
              <div className="text-2xl font-bold text-secondary-900">
                number
              </div>
            </div>

            {/* Completed Orders */}
            <div className="bg-white rounded-2xl shadow-soft-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-secondary-500">
                  Completed Orders
                </h3>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <FiShoppingBag />
                </div>
              </div>
              <div className="text-2xl font-bold text-secondary-900">
                {userDetails?.statistics?.completed_orders}
              </div>
              <p className="text-xs mt-1 text-secondary-900">
                {userDetails?.statistics?.pending_orders} Pending
              </p>
              <p className="text-xs mt-1 text-secondary-900">
                {userDetails?.statistics?.accepted_orders} Accepted
              </p>
            </div>

            {/* Total Earnings */}
            <div className="bg-white rounded-2xl shadow-soft-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-secondary-500">
                  Total Earnings
                </h3>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <FiDollarSign />
                </div>
              </div>
              <div className="text-2xl font-bold text-secondary-900">₦50</div>
              <p className="text-xs text-green-600 mt-1">
                +50% from last month
              </p>
            </div>
          </motion.div>

          {/* Orders Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={3}
            className=""
          >
            <div className="mt-8">
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full max-w-sm grid-cols-2 rounded-xl bg-slate-100">
                  <TabsTrigger
                    value="active"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Current Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Completed Orders
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-4">
                  {pendingStatus === "pending" ? (
                    <Loader />
                  ) : (
                    <>
                      {allOrders.some((order) => order.status === "ready") && (
                        <div>
                          <h1 className="text-xl my-4 text-black">
                            Pending Deliveries
                          </h1>
                          {allOrders
                            .filter((order) => order.status === "ready")
                            .map((item) => (
                              <OrderCard
                                key={item.order_id}
                                order={{
                                  id: item.order_id,
                                  restaurant: item.restaurant_name,
                                  status: item.status,
                                  time: "30 min",
                                  phone_number: item.user_phoneNumber,
                                  amount: item.total,
                                  customerName: item.user_name,
                                  items: item.items,
                                  address: item.location,
                                }}
                                onAccept={() => {
                                  setAllOrders((prev) =>
                                    prev.map((order) =>
                                      item.order_id === order.order_id
                                        ? { ...order, status: "delivering" }
                                        : order
                                    )
                                  );
                                  handlecategoryStatusChange(
                                    item.order_id,
                                    "delivering"
                                  );
                                }}
                                onComplete={() =>
                                  handlecategoryStatusChange(
                                    item.order_id,
                                    "completed"
                                  )
                                }
                              />
                            ))}
                        </div>
                      )}
                      {allOrders.some(
                        (order) => order.status === "delivering"
                      ) && (
                        <div>
                          <h1 className="text-xl text-black">
                            Currently Delivering
                          </h1>
                          {allOrders
                            .filter((order) => order.status === "delivering")
                            .map((item) => (
                              <OrderCard
                                key={item.order_id}
                                order={{
                                  id: item.order_id,
                                  restaurant: item.restaurant_name,
                                  status: item.status,
                                  time: "30 min",
                                  amount: item.total,
                                  customerName: item.user_name,
                                  phone_number: item.user_phoneNumber,
                                  items: item.items,
                                  address: item.location,
                                }}
                                onAccept={() => {
                                  allOrders.map((leorder) =>
                                    leorder.order_id === item.order_id
                                      ? { ...leorder, status: "delivering" }
                                      : leorder
                                  );
                                  handlecategoryStatusChange(
                                    item.order_id,
                                    "delivering"
                                  );
                                }}
                                onComplete={(code) =>
                                  handlecategoryStatusChange(
                                    item.order_id,
                                    "completed",
                                    code
                                  )
                                }
                              />
                            ))}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  {historyStatus === "pending" ? (
                    <Loader />
                  ) : (
                    <>
                      <div>
                        {orderHistory &&
                          orderHistory.orders.map((item: orderHistoryType) => (
                            <OrderCard
                              key={item.order_id}
                              order={{
                                id: item.order_id,
                                restaurant: item.restaurant_name,
                                status: "completed",
                                time: "30 min",
                                amount: Number(item.total),
                                phone_number: item.user_phoneNumber,
                                customerName: item.user_name,
                                items: item.items,
                                address: item.location,
                                date: item.order_date,
                              }}
                              onAccept={() => {
                                setAllOrders((prev) =>
                                  prev.map((order) =>
                                    item.order_id === order.order_id
                                      ? { ...order, status: "delivering" }
                                      : order
                                  )
                                );
                                handlecategoryStatusChange(
                                  item.order_id,
                                  "delivering"
                                );
                              }}
                              onComplete={() =>
                                handlecategoryStatusChange(
                                  item.order_id,
                                  "completed"
                                )
                              }
                            />
                          ))}
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// StarRating component for displaying ratings
