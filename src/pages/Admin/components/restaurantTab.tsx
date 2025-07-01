import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageWrapper } from "@/components/pagewrapper";
import { Badge } from "@/components/ui/badge";
import CreateUserModal from "@/pages/Admin/components/modals/createUserModal/createUserModal";
import ButtonLoader from "@/components/buttonLoader";
import { useState } from "react";
import { restaurantMetric } from "@/interfaces/restaurantType";
import { useToast } from "@/hooks/use-toast";
import {
  adminSetDriverStatus,
  driverList,
  setRestaurantStatus,
} from "@/api/adminRoutes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Driver } from "@/pages/Admin/adminPageAllOrders";

interface cardProps {
  userDetails: any;
  onlineDrivers: any;
  onlinedriversRefetch: () => void;
  detailStatus: string;
}
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

export default function RestaurantDriverTab({
  userDetails,
  onlineDrivers,
  onlinedriversRefetch,
  detailStatus,
}: cardProps) {
  type TimeRange = "day" | "week" | "month" | "year";
  const { toast } = useToast();
  const [restaurantTimeRange, setRestaurantTimeRange] =
    useState<TimeRange>("month");
  const {
    data: offlineDrivers,
    isLoading: offlinedriversLoading,
    error: offlinedriversError,
    refetch: offlineDriversRefetch,
  } = useQuery<Driver[], Error>({
    queryKey: ["alldrivers", "offline"],
    queryFn: () => driverList("offline"),
  });
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

  const { mutateAsync: restaurantStatusMutate } = useMutation({
    mutationFn: setRestaurantStatus,
    onSuccess: () => {
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

  const [restStatusUpdates, setResStatusUpdates] = useState<{
    [key: number]: { status: string | null };
  }>({});
  const handleRestaurantStatusChange = async (
    id: number,
    newStatus: string,
    oldStatus: string | null
  ) => {
    if (newStatus !== "active" && newStatus !== "inactive") {
      //type checks for safety
      return;
    }
    setResStatusUpdates((prev) => ({ ...prev, [id]: { status: newStatus } }));
    try {
      await restaurantStatusMutate({
        restaurantId: String(id),
        status: newStatus,
      });
    } catch (err) {
      setResStatusUpdates((prev) => ({ ...prev, [id]: { status: oldStatus } }));
    }
  };

  return (
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
          {detailStatus === "pending" ? (
            <ButtonLoader color="bg-primary-600" />
          ) : detailStatus === "error" ? (
            <div>
              <p>Something Went Wrong</p>
            </div>
          ) : (
            <Card className="max-h-96 overflow-auto">
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
                          Total Revenue
                        </TableHead>

                        <TableHead className="whitespace-nowrap">
                          Status
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

                            <TableCell>{restaurant.total_revenue}</TableCell>

                            <TableCell>
                              <Select
                                value={
                                  restStatusUpdates[restaurant.id]?.status ||
                                  restaurant.status ||
                                  ""
                                }
                                onValueChange={(value) =>
                                  handleRestaurantStatusChange(
                                    restaurant.id,
                                    value,
                                    restaurant.status
                                  )
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue>
                                    {restStatusUpdates[restaurant.id]?.status ||
                                      restaurant.status ||
                                      ""}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">
                                    Inactive
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <div className="bottom-0 sticky ml-6 bg-white p-4">
                <CreateUserModal isDriver={false} className="pb-4" />
              </div>
            </Card>
          )}
        </PageWrapper>
      </TabsContent>
      <TabsContent value="drivers">
        <PageWrapper>
          {offlinedriversLoading ? (
            <ButtonLoader color="border-primary-600" className="py-7" />
          ) : offlinedriversError ? (
            <div className="text-center">
              <p>Error Loading Drivers</p>
            </div>
          ) : (
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
                        onlineDrivers.map((driver: Driver) => (
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
                                  <SelectItem value="online">Online</SelectItem>
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
                                  <SelectItem value="online">Online</SelectItem>
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
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <div className="bottom-0 sticky ml-6 bg-white">
                <CreateUserModal isDriver={true} className="pb-4" />
              </div>
            </Card>
          )}
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
                      <TableHead className="whitespace-nowrap">Total</TableHead>
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
  );
}
