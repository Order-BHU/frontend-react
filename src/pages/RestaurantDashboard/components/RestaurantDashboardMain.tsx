import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { dashboard } from "@/api/misc";
import { logOut } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import UseAuthStore from "@/stores/useAuthStore";
import EditProfileModal from "@/components/EditRestaurantProfleModal";
import RestaurantOrdersTab from "./RestaurantOrdersTab";
import RestaurantMenuTab from "./RestaurantMenuTab";
import RestaurantFinancialTab from "./RestaurantFinancialTab";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 },
  }),
};

type TabType = "orders" | "menu" | "financial";

const RestaurantDashboardMain: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = UseAuthStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("orders");

  // Fetch user details
  const { data: userDetails, refetch: refetchDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: dashboard,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (userDetails) {
      console.log("userdeets:", userDetails);
    }
  }, [userDetails]);

  // Logout mutation
  const { status: logoutStatus, mutate: logoutMutate } = useMutation({
    mutationFn: logOut,
    onSuccess: (data) => {
      logout();
      navigate("/login");
      toast({
        title: "Success!",
        description: data.message,
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
  function cutOffAtFirstSpace(str: string) {
    const spaceIndex = str.indexOf(" ");
    if (spaceIndex === -1) {
      // No space found, return the full string
      return str;
    } else {
      // Cut off the string at the first space
      return str.slice(0, spaceIndex);
    }
  }

  const handleLogout = () => {
    const token = localStorage.getItem("BHUO-token");
    logoutMutate(token);
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={1}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userDetails?.profile_image} />
                <AvatarFallback>
                  {userDetails?.name?.charAt(0)?.toUpperCase() || "R"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                  Welcome back,{" "}
                  {(userDetails &&
                    cutOffAtFirstSpace(userDetails?.user?.name)) ||
                    "Restaurant Owner"}
                </h1>
                <p className="text-secondary-600">
                  {userDetails?.restaurant_name || "Restaurant Dashboard"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EditProfileModal
                userDetails={userDetails}
                successFn={refetchDetails}
              />
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={logoutStatus === "pending"}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={2}
          className="grid gap-6 md:grid-cols-4 mb-8"
        >
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {menuItemArrayState.length}
              </div>
              <p className="text-xs text-muted-foreground">Available items</p>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userDetails?.status === "online" ? "Online" : "Offline"}
              </div>
              <p className="text-xs text-muted-foreground">Restaurant status</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={3}
          className="bg-white rounded-lg shadow-sm"
        >
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabType)}
          >
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="orders" className="space-y-6">
                <RestaurantOrdersTab />
              </TabsContent>

              <TabsContent value="menu" className="space-y-6">
                <RestaurantMenuTab
                  restaurantId={userDetails?.restaurant_details?.id}
                />
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <RestaurantFinancialTab />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default RestaurantDashboardMain;
