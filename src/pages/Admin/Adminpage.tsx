import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, ChevronRight } from "lucide-react";
import { logOut } from "@/api/auth";
import UseAuthStore from "@/stores/useAuthStore";

import { Button } from "@/components/ui/button";

import { Utensils, Bike, DollarSign } from "lucide-react";
import { PageWrapper } from "@/components/pagewrapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { dashboard } from "@/api/misc";

import { Driver } from "@/pages/Admin/types";
import RestaurantDriverTab from "./components/restaurantTab";
import OrderManagement from "./components/orderManagement";
import { driverList } from "@/api/adminRoutes";
import RevenueTab from "./components/revenueTab";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = UseAuthStore();
  //creating restaurant details

  const { data: userDetails, status: detailStatus } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => dashboard(),
    refetchOnWindowFocus: false,
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

  //everything down here handles managing and updating orders

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
  useEffect(() => console.log("oneeline: ", onlineDrivers), [onlineDrivers]);

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
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8 mt-20">
        <PageWrapper>
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-cfont-dark">
            Admin Dashboard
          </h1>
          <div className="flex gap-5 fold:gap-2">
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

            <Button
              variant="outline"
              className=" justify-between rounded-xl border-gray-200 bg-orange-600 hover:opacity-45 shadow-sm"
              disabled={logoutStatus === "pending"}
              onClick={() => navigate("/admin/contact")}
            >
              <span className="flex items-center">Contacts</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
                {(userDetails &&
                  Number(
                    userDetails?.transactions?.total_revenue
                  ).toLocaleString()) ||
                  0}
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
        <PageWrapper>
          <OrderManagement
            driversError={driversError}
            driversLoading={driversLoading}
            onlineDrivers={onlineDrivers}
            onlinedriversRefetch={onlinedriversRefetch}
          />
        </PageWrapper>

        <PageWrapper>
          <RevenueTab userDetails={userDetails} />
        </PageWrapper>

        <PageWrapper>
          <RestaurantDriverTab
            userDetails={userDetails && userDetails}
            onlineDrivers={onlineDrivers}
            onlinedriversRefetch={onlinedriversRefetch}
            detailStatus={detailStatus}
          />
        </PageWrapper>
      </main>
    </div>
  );
}
