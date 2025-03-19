import { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Phone,
  Receipt,
  ThumbsUp,
  Utensils,
} from "lucide-react";
import { Footer } from "../components/footer";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageWrapper } from "@/components/pagewrapper";
import { useQuery, useMutation } from "@tanstack/react-query";
import { myOrders, trackOrder } from "@/api/restaurant";
import { orderType } from "@/interfaces/restaurantType";
import { editProfile, dashboard, changePassword } from "@/api/misc";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

//Everything regarding edit profile is a copy and paste of restaurant dashboard
export default function UserDashboardPage() {
  const { toast } = useToast();

  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [allOrders, setAllOrders] = useState<orderType[]>([]); //stores all order history
  const [tracked, setTracked] = useState<orderType>(); //deals with tracked order(what we'll be displaying to the user)
  const username = localStorage.getItem("name")?.slice(0, 2).toUpperCase();

  const { status: editProfileStatus, mutate: editProfileMutate } = useMutation({
    mutationFn: editProfile,
    onSuccess: (data) => {
      localStorage.setItem("pfp", data.message.profile_picture_url);
      localStorage.setItem("name", data.message.name);
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
  const { data: userDetails, refetch: refetchDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: dashboard,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (userDetails) {
      localStorage.setItem("pfp", userDetails?.user?.profile_picture_url); //i no longer set this on login
    }
  }, [userDetails]);

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

  // const { data: pendingOrder, status: pendingStatus } = useQuery({
  //   queryFn: () => myOrders("pending"),
  //   queryKey: ["orders"],
  //   refetchOnWindowFocus: false,
  // });

  const { data: trackedOrder, status: trackedStatus } = useQuery({
    queryFn: () => trackOrder(),
    queryKey: ["trackedorders"], // Ensure key changes when userOrder changes
    staleTime: 30000,
  });

  const { data: orderHistory, status: historyStatus } = useQuery({
    queryFn: () => myOrders("history"),
    queryKey: ["history"],
  });

  useEffect(() => {
    //here to set the tracked order a state
    if (trackedOrder) {
      console.log("setting tracked");
      setTracked(trackedOrder);
      localStorage.removeItem("orderId");
    }
  }, [trackedOrder]);

  useEffect(() => {
    //just here for logging
    console.log("tracked online orders: ", trackedOrder);
  }, [trackedOrder]);
  useEffect(() => {
    console.log("trackedOrders: ", tracked); // This runs after tracked has been updated
  }, [tracked]);

  useEffect(() => {
    //sets order history to a state
    if (orderHistory) {
      setAllOrders(orderHistory.orders);
    }
    console.log("All user orders: ", orderHistory);
  }, [tracked]);

  const handlePfpImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //for updating
    if (e.target.files && e.target.files[0]) {
      setprofileDetails({
        ...profileDetails,
        profile_picture: e.target.files[0],
      });
    }
  };
  const handlePhoneTypeChange = (type: "whatsapp" | "phone") => {
    setprofileDetails((prev) => ({ ...prev, phone_number_type: type }));
  };

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

  //this is what we'll pass to the change password mutate function
  const [passwordDeetails, setPasswordDetails] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const handleUpdatePassword = () => {
    passwordMutate(passwordDeetails);
  };

  function getOrderProgress(status: string) {
    //this function just creates a progress value for the progress bar
    switch (status) {
      case "pending":
        return 0;
      case "accepted":
        return 25;
      case "ready":
        return 50;
      case "delivering":
        return 80;
      case "completed":
        return 100;
    }
  }

  function setStep(status: string) {
    console.log("setting step: ", status);
    //this function sets tge currentStep variable
    switch (status) {
      case "pending":
        return 0;
      case "accepted":
        return 1;
      case "ready":
        return 2;
      case "delivering":
        return 3;
      case "completed":
        return 4;
    }
  }
  useEffect(() => {
    setCurrentStep(setStep(tracked?.status!)!);
  }, [tracked]);

  //the thing below was rendered by v0, i'm too scared to fully comprehend what this does, i am very sleepy and i have a headache, i pray god sees you through these trying times, my friedn
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  const steps = [
    {
      id: 1,
      name: "Order Confirmed",
      description: "Your order has been received",
      icon: Receipt,
      time: "12:05 PM",
      completed: currentStep >= 1 ? true : false,
    },
    {
      id: 2,
      name: "Preparing",
      description: "Chef is preparing your meal",
      icon: Utensils,
      time: "12:10 PM",
      completed: currentStep >= 2 ? true : false,
    },
    {
      id: 3,
      name: "On the way",
      description: "Driver has picked up your order",
      icon: MapPin,
      time: "12:25 PM",
      completed: currentStep >= 3 ? true : false,
    },
    {
      id: 4,
      name: "Delivered",
      description: "Enjoy your meal!",
      icon: ThumbsUp,
      time: "12:40 PM",
      completed: currentStep >= 4 ? true : false,
    },
  ];
  useEffect(() => {
    console.log("the steps: ", steps);
  }, [steps]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <main className="flex-grow container mx-auto px-4 py-8">
        <PageWrapper>
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-cfont-dark">
            User Dashboard
          </h1>
        </PageWrapper>

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
                        htmlFor="restaurantPhoto"
                        className="dark:text-cfont-dark"
                      >
                        Profile Photo
                      </Label>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePfpImageChange}
                      />
                    </div>
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
              <Dialog
                open={isOrderHistoryOpen}
                onOpenChange={setIsOrderHistoryOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    View Transactions
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl dark:text-cfont-dark">
                  <DialogHeader>
                    <DialogTitle>Transactions</DialogTitle>
                  </DialogHeader>
                  {historyStatus === "pending" ? (
                    <div className="flex flex-col justify-center items-center">
                      <l-waveform
                        size="35"
                        stroke="3.5"
                        speed="1"
                        color="#6C757D"
                      ></l-waveform>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          {/* <TableHead>Restaurant</TableHead> */}
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allOrders?.map((order) => (
                          <TableRow
                            key={order.id}
                            className="dark:text-cfont-dark"
                          >
                            <TableCell>{order.id}</TableCell>
                            {/* <TableCell>{order.restaurant}</TableCell> */}
                            <TableCell>
                              {order.items
                                ?.map((item) => item.menu_name)
                                .join(",")}
                            </TableCell>
                            <TableCell>{order.total}</TableCell>
                            <TableCell>
                              <Badge variant="default">{order.status}</Badge>
                            </TableCell>
                            {/* <TableCell>{order.date}</TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </PageWrapper>

        <Tabs defaultValue="orders" className="space-y-4">
          <PageWrapper>
            <TabsList>
              <TabsTrigger value="orders">Active Order</TabsTrigger>
              <TabsTrigger value="activity">Order history</TabsTrigger>
            </TabsList>
          </PageWrapper>

          <TabsContent value="orders">
            <PageWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {trackedStatus === "pending" ? (
                    <div className="flex flex-col justify-center items-center">
                      <l-waveform
                        size="35"
                        stroke="3.5"
                        speed="1"
                        color="#6C757D"
                      ></l-waveform>
                    </div>
                  ) : trackedStatus === "error" ? (
                    <div className="text-center py-8">
                      <p>Error loading orders. Please try again later.</p>
                    </div>
                  ) : tracked ? ( //tracked order doesn't have the total price, so I'm just using userOrder here. You're welcome to fix this if you want, but I'll just stick to using this and only use tracked for the tracking dialogue box.
                    <div className="grid gap-6 md:grid-cols-4">
                      {/* Combined Order Status and Details Card */}
                      <Card className="md:col-span-3">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">
                                Order #{tracked?.order_id}
                              </CardTitle>
                            </div>
                            <Badge
                              variant={
                                tracked?.status === "completed"
                                  ? "secondary"
                                  : "default"
                              }
                              className="px-3 py-1 text-sm font-medium"
                            >
                              {tracked?.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-muted-foreground">
                                Order Progress
                              </span>
                              <span className="text-sm font-medium">
                                {getOrderProgress(tracked?.status!)}%
                              </span>
                            </div>
                            <Progress
                              value={getOrderProgress(tracked?.status!)}
                              className="h-2"
                            />
                          </div>

                          {/* Horizontal Steps */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                            {steps.map((step) => (
                              <div
                                key={step.id}
                                className={`relative p-3 rounded-lg border ${
                                  step.completed
                                    ? "border-black dark:border-black bg-gray-300 dark:bg-gray-900"
                                    : "border-input"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                      step.completed
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-input bg-background text-muted-foreground"
                                    }`}
                                  >
                                    <step.icon className="h-4 w-4" />
                                  </div>
                                  <p className="text-sm font-medium leading-none">
                                    {step.name}
                                    {step.completed}
                                  </p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {step.description}
                                </p>

                                {/* Connector line between steps (except last) */}
                                {step.id < totalSteps && (
                                  <div
                                    className={`hidden md:block absolute top-1/2 -right-1 w-2 h-0.5 ${
                                      step.completed ? "bg-primary" : "bg-input"
                                    }`}
                                    style={{
                                      transform: "translateY(-50%)",
                                    }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          <Separator className="my-6" />

                          {/* Order Items */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium">Order Items</h4>
                            <div className="space-y-3">
                              {tracked?.items?.map((item) => (
                                <div className="flex justify-between">
                                  <span className="text-sm">
                                    {item.menu_name}
                                  </span>
                                  <span className="text-sm font-medium">
                                    ₦{item.menu_price.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                              <Separator className="my-6" />
                              <div className="flex justify-between">
                                <span className="text-sm font-bold">
                                  Delivery Fee
                                </span>
                                <span className="text-sm font-medium">
                                  ₦250
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-bold">Total</span>
                                <span className="text-sm font-medium">
                                  ₦{Number(tracked.total).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-6">
                          <Link to={`mailto:`}>
                            <Button variant="outline" size="sm">
                              <Phone className="mr-2 h-4 w-4" />
                              Contact Restaurant
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>

                      {/* Driver Information Card */}
                      {tracked.driver_name && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Your Driver
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-3 mb-4">
                              <Avatar>
                                <AvatarImage
                                  src={tracked.driver_profile_photo}
                                  alt="Driver"
                                />
                                <AvatarFallback>
                                  {tracked.driver_name
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {tracked.driver_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  5 ★ Rating
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <Clock className="inline mr-2 h-4 w-4" />
                                Arriving in ~15 mins
                              </p>
                              <p className="text-sm">
                                <MapPin className="inline mr-2 h-4 w-4" />
                                2.5 km away
                              </p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Link to={`tel:${tracked.driver_number}`}>
                              <Button variant="outline" className="w-full">
                                <Phone className="mr-2 h-4 w-4" />
                                Contact Driver
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-lg mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Button asChild>
                        <Link to="/restaurants">Place Order</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </PageWrapper>
          </TabsContent>
          <TabsContent value="activity">
            <PageWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {historyStatus === "pending" ? (
                    <div className="flex flex-col justify-center items-center">
                      <l-waveform
                        size="35"
                        stroke="3.5"
                        speed="1"
                        color="#6C757D"
                      ></l-waveform>
                    </div>
                  ) : historyStatus === "error" ? (
                    <div className="text-center py-8">
                      <p>Error loading orders. Please try again later.</p>
                    </div>
                  ) : allOrders ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allOrders.map((item) => (
                          <TableRow>
                            <TableCell>{item.order_id}</TableCell>
                            <TableCell>
                              {item.items.map((item) => item.menu_name)}
                            </TableCell>
                            <TableCell>
                              ₦{Number(item.total).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.status === "Delivered"
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-lg mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Button asChild>
                        <Link to="/restaurants">Place Order</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </PageWrapper>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
