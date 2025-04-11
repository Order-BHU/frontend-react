"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MapPin, Package, DollarSign, Star, TrendingUp } from "lucide-react";
import { PageWrapper } from "@/components/pagewrapper";
import { myOrders, updateOrderStatus, setDriverStatus } from "@/api/restaurant";
import { dashboard, changePassword, editProfile } from "@/api/misc";
import { useQuery, useMutation } from "@tanstack/react-query";
import { orderType } from "@/interfaces/restaurantType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import driverStore from "@/stores/driverStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This would typically come from an API or database

export default function RiderDashboardPage() {
  const { state, setState } = driverStore();
  const [activeOrders, setActive] = useState<orderType[]>([]);
  const [deliverOrders, setDeliver] = useState<orderType[]>([]);
  //const [orderHistoryState, setHistory] = useState<orderType[]>([]);
  const [orderCode, setCode] = useState(""); //keeps track of the code the rider types in to complete an order
  const username = localStorage.getItem("name")?.slice(0, 2).toUpperCase();
  const {
    status: pendingStatus,
    data: pendingOrders,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ["activeOrders"],
    queryFn: () => myOrders("ready"),
  });

  const { data: deliveringOrders, refetch: refetchDelivering } = useQuery({
    queryKey: ["deliveringOrders"],
    queryFn: () => myOrders("delivering"),
  });

  const { mutate: passwordMutate, status: passwordStatus } = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      setPasswordDetails({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      toast({
        title: "Success",
        description: data.message,
      });
      refetchDetails();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const handlePhoneTypeChange = (type: "whatsapp" | "phone") => {
    setprofileDetails((prev) => ({ ...prev, phone_number_type: type }));
  };

  const [profileDetails, setprofileDetails] = useState({
    name: "",
    profile_picture: null as File | null,
    phone_number_type: "",
  });
  const filteredData = Object.fromEntries(
    //this is here to filter only the truthy values from the edit profile form and we pass it to mutate, since the api can't accept empty strings as they'll override whatever is already there
    Object.entries(profileDetails).filter(([_, value]) => value)
  );
  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    editProfileMutate(filteredData);
    console.log(profileDetails);
    refetchDetails();
  };
  const { status: editProfileStatus, mutate: editProfileMutate } = useMutation({
    mutationFn: editProfile,
    onSuccess: (data) => {
      refetchDetails();
      localStorage.setItem("name", userDetails?.user?.name);
      toast({
        title: "Success",
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

  const [passwordDeetails, setPasswordDetails] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const handleUpdatePassword = () => {
    passwordMutate(passwordDeetails);
  };

  // const {
  //   status: historyStatus,
  //   data: orderHistory,
  //   refetch: refetchHistory,
  // } = useQuery({
  //   queryKey: ["history"],
  //   queryFn: () => myOrders("history"),
  // });

  const { data: userDetails, refetch: refetchDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => dashboard(),
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (userDetails) {
      console.log("user details: ", userDetails);
    }
  }, [userDetails]);

  const { toast } = useToast();
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

  const handleDriverStatusChange = (newState: "offline" | "online") => {
    const prevState = state; // Save the previous state

    // Optimistically update state
    setState(newState);

    driverStatusMutate(newState, {
      onError: () => {
        // Revert state if there's an error
        setState(prevState);
        toast({
          title: "Error",
          description: "Failed to update driver status. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handlecategoryStatusChange = (
    orderId: number,
    newcategoryStatus: string,
    code?: string
  ) => {
    console.log("order id: ", orderId);
    orderStatusMutate({
      orderId: Number(orderId),
      status: newcategoryStatus,
      code: code,
    });
    // Here you would typically update the order categoryStatus in your backend
  };

  useEffect(() => {
    if (pendingOrders) {
      setActive(pendingOrders.orders); //for some reason pendingOrders is an array inside an array in the response
    }
  }, [pendingOrders]);

  useEffect(() => {
    if (deliveringOrders) {
      setDeliver(deliveringOrders.orders); //for some reason pendingOrders is an array inside an array in the response
    }
  }, [deliveringOrders]);

  useEffect(() => {
    console.log("deliverorders: ", deliveringOrders);
  }, [deliveringOrders]);

  // useEffect(() => {
  //   if (orderHistory) {
  //     setHistory(orderHistory.orders[0]); //for some reason pendingOrders is an array inside an array in the response
  //     console.log("order history: ", orderHistoryState);
  //   }
  // }, [orderHistory]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <PageWrapper>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-cfont-dark">
              Rider Dashboard
            </h1>
          </PageWrapper>

          <Button
            onClick={() =>
              handleDriverStatusChange(
                state === "online" ? "offline" : "online"
              )
            }
            variant={state === "online" ? "default" : "secondary"}
          >
            {state === "online" ? "Go Offline" : "Go Online"}
          </Button>
        </div>
        <PageWrapper className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    localStorage.getItem("pfp") ||
                    userDetails?.user?.profile_picture_url
                  }
                  alt={username}
                />
                <AvatarFallback className="text-gray-900 dark:text-gray-300">
                  {username}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {userDetails?.user?.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {userDetails?.user?.email}
                </p>
                <p className="text-sm text-gray-500">
                  {userDetails?.user?.phone_number}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mb-2">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="dark:text-cfont-dark overflow-auto max-h-[95vh]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditProfile} className="space-y-4">
                    <div>
                      <Label
                        htmlFor="restaurantName"
                        className="dark:text-cfont-dark"
                      >
                        Name
                      </Label>
                      <Input
                        id="restaurantName"
                        value={userDetails?.message?.restaurant_name}
                        className="dark:text-cfont-dark"
                        onChange={(e) =>
                          setprofileDetails({
                            ...userDetails,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="restaurantPhoto"
                        className="dark:text-cfont-dark"
                      >
                        How should we contact you:
                      </Label>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={
                            profileDetails.phone_number_type === "whatsapp"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handlePhoneTypeChange("whatsapp")}
                        >
                          WhatsApp
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={
                            profileDetails.phone_number_type === "phone"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handlePhoneTypeChange("phone")}
                        >
                          Phone
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={editProfileStatus === "pending"}
                    >
                      Update Profile
                    </Button>

                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Change Password</AccordionTrigger>
                        <AccordionContent>
                          <div className="mb-4">
                            <Label
                              htmlFor="oldPassword"
                              className="dark:text-cfont-dark"
                            >
                              Old Password
                            </Label>
                            <Input
                              id="oldPassword"
                              type="password"
                              value={passwordDeetails?.current_password}
                              className="dark:text-cfont-dark max-w-[90%] mx-3"
                              onChange={(e) =>
                                setPasswordDetails({
                                  ...passwordDeetails,
                                  current_password: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="mb-4">
                            <Label
                              htmlFor="newPassword"
                              className="dark:text-cfont-dark"
                            >
                              New Password
                            </Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={passwordDeetails?.new_password}
                              className="dark:text-cfont-dark max-w-[90%] mx-3"
                              onChange={(e) =>
                                setPasswordDetails({
                                  ...passwordDeetails,
                                  new_password: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="mb-4">
                            <Label
                              htmlFor="confirmPassword"
                              className="dark:text-cfont-dark max-w-[90%] mx-3"
                            >
                              Confirm Password
                            </Label>
                            <Input
                              type="password"
                              id="confirmPassword"
                              value={passwordDeetails?.confirm_password}
                              className="dark:text-cfont-dark max-w-[90%] mx-3"
                              onChange={(e) =>
                                setPasswordDetails({
                                  ...passwordDeetails,
                                  confirm_password: e.target.value,
                                })
                              }
                            />
                          </div>
                          <Button
                            onClick={handleUpdatePassword}
                            disabled={passwordStatus === "pending"}
                          >
                            Update Password
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </PageWrapper>

        <PageWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span>&#8358;</span>
                1,234.56
              </div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">
                +0.2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Acceptance Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <Progress value={95} className="mt-2" />
            </CardContent>
          </Card>
        </PageWrapper>

        <Tabs defaultValue="current" className="space-y-4">
          <PageWrapper>
            <TabsList>
              <TabsTrigger value="current">Current Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed Orders</TabsTrigger>
            </TabsList>
          </PageWrapper>

          <TabsContent value="current">
            {pendingStatus === "pending" ? (
              <div className="flex flex-col justify-center items-center">
                <l-waveform
                  size="35"
                  stroke="3.5"
                  speed="1"
                  color="white"
                ></l-waveform>
              </div>
            ) : activeOrders?.length <= 0 ? (
              <div className="text-center py-8">
                <p className="text-lg mb-4">No pending orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders?.map((order) => (
                  <PageWrapper key={order.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>{order.restaurant_name}</span>
                          <span className="text-sm italic">
                            {order.user_phoneNumber}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm text-gray-600">
                            {order.location}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-semibold">
                            ₦{Number(order.total).toLocaleString()}
                          </span>
                        </div>

                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handlecategoryStatusChange(order.order_id, value)
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={"Click to Start Order"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delivering">
                              Delivering
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {/* <Dialog>
                          <DialogTrigger asChild>
                            <Button>Complete Order</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md dark:text-cfont-dark">
                            <DialogHeader>
                              <DialogTitle>Enter Order Code</DialogTitle>
                              <DialogDescription>
                                Input the code from the customer to complete
                                this order
                              </DialogDescription>
                            </DialogHeader>
                            <div className="">
                              <div className="grid flex-1 gap-2">
                                <Input
                                  id="ordercode"
                                  onChange={(e) => setCode(e.target.value)}
                                />
                              </div>
                              <Button
                                onClick={() =>
                                  handlecategoryStatusChange(
                                    order.order_id,
                                    "completed",
                                    orderCode
                                  )
                                }
                                disabled={mutateStatus === "pending"}
                                size="sm"
                                className="px-3 mt-4"
                              >
                                Submit
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog> */}
                      </CardContent>
                    </Card>
                  </PageWrapper>
                ))}
                {deliverOrders.length != 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivering</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {deliverOrders?.map((order) => (
                        <PageWrapper key={order.id}>
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex justify-between items-center">
                                <span>{order.restaurant_name}</span>
                                <span className="text-sm italic">
                                  {order.user_phoneNumber}
                                </span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center mb-2">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span className="text-sm text-gray-600">
                                  {order.location}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm font-semibold">
                                  ₦{Number(order.total).toLocaleString()}
                                </span>
                              </div>

                              {/* <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handlecategoryStatusChange(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={order.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ready">Completed</SelectItem>
                          </SelectContent>
                        </Select> */}

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button>Complete Order</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md dark:text-cfont-dark">
                                  <DialogHeader>
                                    <DialogTitle>Enter Order Code</DialogTitle>
                                    <DialogDescription>
                                      Input the code from the customer to
                                      complete this order
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="">
                                    <div className="grid flex-1 gap-2">
                                      <Input
                                        id="ordercode"
                                        onChange={(e) =>
                                          setCode(e.target.value)
                                        }
                                      />
                                    </div>
                                    <Button
                                      onClick={() =>
                                        handlecategoryStatusChange(
                                          order.order_id,
                                          "completed",
                                          orderCode
                                        )
                                      }
                                      disabled={
                                        completeOrderStatus === "pending"
                                      }
                                      size="sm"
                                      className="px-3 mt-4"
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </CardContent>
                          </Card>
                        </PageWrapper>
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <></>
                )}
              </div>
            )}
          </TabsContent>
          {/* <TabsContent value="completed">
            {historyStatus === "pending" ? (
              <div className="flex flex-col justify-center items-center">
                <l-waveform
                  size="35"
                  stroke="3.5"
                  speed="1"
                  color="white"
                ></l-waveform>
              </div>
            ) : (
              <div className="space-y-4">
                {orderHistoryState?.map((order) => (
                  <PageWrapper key={order.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>{order.restaurant_name}</span>
                          <span className="text-sm italic">
                            {order.user_phoneNumber}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm text-gray-600">
                            {order.location}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-semibold">
                            ₦{order.total}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </PageWrapper>
                ))}
              </div>
            )}
          </TabsContent> */}
        </Tabs>
      </main>
    </div>
  );
}
