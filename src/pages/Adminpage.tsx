import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, ChevronRight } from "lucide-react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { dashboard } from "@/api/misc";
import { restaurantMetric, transactionType } from "@/interfaces/restaurantType";
import CreateUserModal from "@/components/createUserModal";

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

const drivers = [
  {
    id: "1",
    name: "John Doe",
    totalOrders: 50,
    completedOrders: 48,
    totalEarnings: "₦75,000",
  },
  {
    id: "2",
    name: "Jane Smith",
    totalOrders: 45,
    completedOrders: 44,
    totalEarnings: "₦68,000",
  },
  {
    id: "3",
    name: "Mike Johnson",
    totalOrders: 40,
    completedOrders: 39,
    totalEarnings: "₦62,000",
  },
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
                <Card>
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
                              Completion Rate
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Total Earnings
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {drivers.map((driver) => (
                            <TableRow key={driver.id}>
                              <TableCell className="whitespace-nowrap">
                                {driver.name}
                              </TableCell>
                              <TableCell>{driver.totalOrders}</TableCell>
                              <TableCell>{driver.completedOrders}</TableCell>
                              <TableCell>
                                {(
                                  (driver.completedOrders /
                                    driver.totalOrders) *
                                  100
                                ).toFixed(2)}
                                %
                              </TableCell>
                              <TableCell>{driver.totalEarnings}</TableCell>
                            </TableRow>
                          ))}
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
