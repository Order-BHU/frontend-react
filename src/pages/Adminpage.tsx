import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  ChevronRight,
  Package,
  User,
  MapPin,
  Truck,
  Phone,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { logOut } from "@/api/auth";
import UseAuthStore from "@/stores/useAuthStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Utensils, Bike, DollarSign } from "lucide-react";
import { PageWrapper } from "@/components/pagewrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { dashboard, updateOrder, driverList, allOrders } from "@/api/misc";
import { restaurantMetric, transactionType } from "@/interfaces/restaurantType";
import { Driver, Order } from "@/interfaces/adminPageAllOrders";
import CreateUserModal from "@/components/createUserModal";
import ButtonLoader from "@/components/buttonLoader";
import { format } from "date-fns";
import Loader from "@/components/loaderAnimation";
import { adminSetDriverStatus } from "@/api/restaurant";

// Mock data - in a real app, this would come from an API
const revenueData = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 5000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 1890 },
  { name: "Sat", value: 2390 },
  { name: "Sun", value: 3490 },
];

const recentOrders = [
  {
    id: "1",
    customer: "Alice Brown",
    restaurant: "Burger Palace",
    driver: "John Doe",
    total: "₦3,500",
    status: "Delivered",
  },
  {
    id: "2",
    customer: "Bob Wilson",
    restaurant: "Pizza Heaven",
    driver: "Jane Smith",
    total: "₦4,200",
    status: "In Transit",
  },
  {
    id: "3",
    customer: "Charlie Davis",
    restaurant: "Sushi Sensation",
    driver: "Mike Johnson",
    total: "₦5,500",
    status: "Preparing",
  },
];

type TimeRange = "day" | "week" | "month" | "year";
export default function AdminDashboardPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = UseAuthStore();
  //creating restaurant details

  const [restaurantTimeRange, setRestaurantTimeRange] =
    useState<TimeRange>("month");

  const { data: userDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => dashboard(),
    refetchOnWindowFocus: false,
  });

  const [timeRange, setTimeRange] = useState<TimeRange>("week");

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

  //everything down here handles managing and updating orders

  const [loadingOrder, setLoadingOrder] = useState<string | null>(); //state here to show that
  const queryClient = useQueryClient();

  // Fetch all orders
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery<Order[], Error>({
    queryKey: ["allorders"],
    queryFn: allOrders,
  });

  // Fetch online drivers
  const {
    data: onlineDrivers,
    isLoading: driversLoading,
    error: driversError,
    refetch: onlinedriversRefetch,
  } = useQuery<Driver[], Error>({
    queryKey: ["alldrivers", "online"],
    queryFn: () => driverList("online"),
  });

  const {
    data: offlineDrivers,
    isLoading: offlinedriversLoading,
    error: offlinedriversError,
    refetch: offlineDriversRefetch,
  } = useQuery<Driver[], Error>({
    queryKey: ["alldrivers", "offline"],
    queryFn: () => driverList("offline"),
  });

  // Mutation for updating an order
  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onMutate: ({ orderId }) => {
      setLoadingOrder(orderId);
    },
    onSuccess: (data) => {
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

  // State to manage form inputs for each order
  const [orderUpdates, setOrderUpdates] = useState<{
    [key: number]: { status: string; driver_id: string };
  }>({});

  const handleUpdate = (orderId: number) => {
    //this function updates the details of an order. Status and driver assigned
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
    driverId: string | undefined,
    drivers: Driver[] | undefined
  ) => {
    if (!driverId) return "Select driver";
    const driver = drivers?.find((d) => String(d.id) === driverId);
    return driver ? `${driver.name} (${driver.phone_number})` : "Select driver";
  };

  const getStatusDisplay = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  //end of things regarding managing and updating orders

  //everything with driver management goes here
  const { mutate: driverStatusMutate } = useMutation({
    mutationFn: adminSetDriverStatus,
    onSuccess: () => {
      offlineDriversRefetch();
      onlinedriversRefetch();
      toast({
        title: "Status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const handleDriverStatusChange = (id: number, status: string) => {
    (status === "offline" || status === "online") &&
      driverStatusMutate({ driverID: id, status: status });
    return;
  };
  //end of things with driver management
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8 mt-20">
        <PageWrapper>
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-cfont-dark">
            Admin Dashboard
          </h1>

          <Button
            variant="outline"
            className=" justify-between rounded-xl border-gray-200 bg-gray hover:bg-orange-600 shadow-sm"
            disabled={logoutStatus === "pending"}
            onClick={handleLogout}
          >
            <span className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PageWrapper>

        <PageWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {userDetails?.total_orders}
              </div>
              <div className="italic">
                <p className="text-xs text-muted-foreground">
                  {`${userDetails?.order_metrics?.accepted || ""} Accepted`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {`${userDetails?.order_metrics?.delivering || ""} Delivering`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {`${userDetails?.order_metrics?.completed || ""} Completed`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {`${userDetails?.order_metrics?.pending || ""} Pending`}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                ₦
                {Number(
                  userDetails?.transactions?.total_revenue
                ).toLocaleString() || ""}
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Restaurants
              </CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {userDetails?.total_restaurants || ""}
              </div>
              <p className="text-xs text-muted-foreground"></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Drivers
              </CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {userDetails?.total_drivers || ""}
              </div>
              <p className="text-xs text-muted-foreground italic">
                {`${userDetails?.active_drivers} ${
                  userDetails?.active_drivers != 1
                    ? "Active drivers"
                    : "Active driver"
                }`}
              </p>
              <p className="text-xs text-muted-foreground italic">
                {`${userDetails?.inactive_drivers} Inactive drivers`}
              </p>
            </CardContent>
          </Card>
        </PageWrapper>
        {/**order management */}
        <Card className="w-full max-h-[25rem] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[25rem] pb-16">
              {ordersLoading || driversLoading ? (
                <div className="flex items-center justify-center">
                  <Loader />
                </div>
              ) : ordersError || driversError ? (
                <div className="flex items-center justify-center">
                  <p>Error getting data</p>
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="space-y-4">
                        {/* Order Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <h3 className="font-semibold text-lg">
                              Order #{order.id}
                            </h3>
                            <Badge
                              variant="outline"
                              className={getStatusColor(order.status)}
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {order.created_at !== null && (
                                <span className="text-sm italic">
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
                                <span className="font-medium">
                                  {order.user.name}
                                </span>
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
                            <span className="font-medium">
                              {order.customer_location}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">Total:</span>
                            <span className="font-semibold text-green-600">
                              ₦
                              {Number.parseFloat(
                                order.total.toLocaleString()
                              ).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">Driver:</span>
                            {order.driver ? (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">
                                  {order.driver.name}
                                </span>
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {order.driver.phone_number}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">
                                Not Assigned
                              </span>
                            )}
                          </div>
                        </div>

                        <Separator />

                        {/* Update Controls */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex gap-2">
                            <div className="flex-1 space-y-2">
                              <label className="text-sm font-medium text-gray-700 fold:hidden">
                                Update Status
                              </label>
                              <label className="hidden fold:inline text-sm font-medium text-gray-700">
                                Status
                              </label>
                              <Select
                                value={
                                  orderUpdates[order.id]?.status || order.status
                                }
                                onValueChange={(value) =>
                                  handleInputChange(order.id, "status", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue>
                                    {getStatusDisplay(
                                      orderUpdates[order.id]?.status ||
                                        order.status
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="accepted">
                                    Accepted
                                  </SelectItem>
                                  <SelectItem value="ready">Ready</SelectItem>
                                  <SelectItem value="delivering">
                                    Delivering
                                  </SelectItem>
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
                                  order.driver_id ||
                                  ""
                                }
                                onValueChange={(value) =>
                                  handleInputChange(
                                    order.id,
                                    "driver_id",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue>
                                    {getDriverName(
                                      orderUpdates[order.id]?.driver_id ||
                                        order.driver_id,
                                      onlineDrivers
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="no_driver">
                                    No Driver
                                  </SelectItem>
                                  {onlineDrivers?.map((driver) => (
                                    <SelectItem
                                      key={driver.id}
                                      value={String(driver.id)}
                                    >
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
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No orders found</p>
                  <p className="text-gray-400 text-sm">
                    Orders will appear here when customers place them.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <PageWrapper>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="flex flex-wrap mb-10 sm:mb-4 galaxy-fold:mb-16">
              <TabsTrigger value="overview" className="flex-grow">
                Revenue Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex-grow">
                Transactions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <PageWrapper>
                <Card className="mb-8">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                    <CardTitle className="text-lg md:text-xl font-semibold">
                      Revenue Overview
                    </CardTitle>
                    <Select
                      value={timeRange}
                      onValueChange={(value: TimeRange) => setTimeRange(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </PageWrapper>
            </TabsContent>
            <TabsContent value="transactions">
              <PageWrapper>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Recent Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap">
                              ID
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Customer ID
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Restaurant ID
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Type
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Reference
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDetails?.transactions?.recent?.map(
                            (data: transactionType) => (
                              <TableRow key={data.id}>
                                <TableCell className="whitespace-nowrap">
                                  {data.id}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {data.customer_id}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {data.restaurant_id}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {data.type}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {data.reference}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  <Badge
                                    variant={
                                      data.status === "completed"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {data.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </PageWrapper>
            </TabsContent>
          </Tabs>
        </PageWrapper>

        <PageWrapper>
          <Tabs defaultValue="restaurants" className="space-y-4">
            <TabsList className="flex flex-wrap mb-10 sm:mb-4 galaxy-fold:mb-16">
              <TabsTrigger value="restaurants" className="flex-grow">
                Restaurant Management
              </TabsTrigger>
              <TabsTrigger value="drivers" className="flex-grow">
                Driver Management
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-grow">
                Recent Orders
              </TabsTrigger>
            </TabsList>
            <TabsContent value="restaurants">
              <PageWrapper>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Restaurant Data
                    </CardTitle>
                    <Select
                      value={restaurantTimeRange}
                      onValueChange={(value: TimeRange) =>
                        setRestaurantTimeRange(value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap">
                              Name
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Total Orders
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Pending Orders
                            </TableHead>

                            <TableHead className="whitespace-nowrap">
                              Total Revenue
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Average Value
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Wallet Balance
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDetails?.restaurant_metrics?.map(
                            (restaurant: restaurantMetric) => (
                              <TableRow key={restaurant.id}>
                                <TableCell className="whitespace-nowrap">
                                  {restaurant.name}
                                </TableCell>
                                <TableCell>{restaurant.total_orders}</TableCell>
                                <TableCell>
                                  {restaurant.pending_orders}
                                </TableCell>
                                <TableCell>
                                  {restaurant.total_revenue}
                                </TableCell>
                                <TableCell>
                                  {restaurant.average_order_value}
                                </TableCell>
                                <TableCell>
                                  {restaurant.wallet_balance}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <CreateUserModal isDriver={false} />
                  </CardContent>
                </Card>
              </PageWrapper>
            </TabsContent>
            <TabsContent value="drivers">
              <PageWrapper>
                <Card className="max-h-96 overflow-auto">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Driver Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap">
                              Name
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Total Orders
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Completed Orders
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {onlineDrivers && onlineDrivers.length > 0 ? (
                            onlineDrivers.map((driver) => (
                              <TableRow key={driver.id}>
                                <TableCell className="whitespace-nowrap">
                                  {driver.name}
                                </TableCell>
                                <TableCell>null rn</TableCell>
                                <TableCell>null run</TableCell>

                                <TableCell>
                                  <Select
                                    value={driver.status}
                                    onValueChange={(value) =>
                                      handleDriverStatusChange(driver.id, value)
                                    }
                                  >
                                    <SelectTrigger className="max-w-full mt-3 sm:mt-0">
                                      <SelectValue>{driver.status}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="online">
                                        Online
                                      </SelectItem>
                                      <SelectItem value="offline">
                                        Offline
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <></>
                          )}
                          {offlineDrivers && offlineDrivers.length > 0 ? (
                            offlineDrivers.map((driver) => (
                              <TableRow key={driver.id}>
                                <TableCell className="whitespace-nowrap">
                                  {driver.name}
                                </TableCell>
                                <TableCell>null rn</TableCell>
                                <TableCell>null rn</TableCell>

                                <TableCell>
                                  <Select
                                    value={driver.status}
                                    onValueChange={(value) =>
                                      handleDriverStatusChange(driver.id, value)
                                    }
                                  >
                                    <SelectTrigger className="max-w-full mt-3 sm:mt-0">
                                      <SelectValue>{driver.status}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="online">
                                        Online
                                      </SelectItem>
                                      <SelectItem value="offline">
                                        Offline
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : offlinedriversLoading ? (
                            <div>
                              <Loader />
                            </div>
                          ) : offlinedriversError ? (
                            <div>
                              <p>Something Went Wrong</p>
                            </div>
                          ) : (
                            <></>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <CreateUserModal isDriver={true} />
                  </CardContent>
                </Card>
              </PageWrapper>
            </TabsContent>
            <TabsContent value="orders">
              <PageWrapper>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap">
                              Order ID
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Customer
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Restaurant
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Driver
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Total
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="whitespace-nowrap">
                                {order.id}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {order.customer}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {order.restaurant}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {order.driver}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {order.total}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Badge
                                  variant={
                                    order.status === "Delivered"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </PageWrapper>
            </TabsContent>
          </Tabs>
        </PageWrapper>
      </main>
    </div>
  );
}
