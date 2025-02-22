import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { editProfile, dashboard } from "@/api/misc";
import { useToast } from "@/hooks/use-toast";

//Everything regarding edit profile is a copy and paste of restaurant dashboard
export default function UserDashboardPage() {
  const { toast } = useToast();

  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [userOrder, setUserOrder] = useState<orderType>(); //this state stores all the pending orders for the user
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
      localStorage.setItem("pfp", userDetails?.message.profile_picture_url); //i no longer set this on login
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

  const { data: pendingOrder, status: pendingStatus } = useQuery({
    queryFn: () => myOrders("pending"),
    queryKey: ["orders"],
    refetchOnWindowFocus: false,
  });

  const { data: trackedOrder, status: trackedStatus } = useQuery({
    queryFn: () => trackOrder(Number(localStorage.getItem("orderId"))), //we'll track it using the pending order route since that's how we get the ID
    queryKey: ["trackedorders"],
    enabled: !!pendingOrder,
  });

  const { data: orderHistory, status: historyStatus } = useQuery({
    queryFn: () => myOrders("history"),
    queryKey: ["history"],
  });

  useEffect(() => {
    //sets pending orders to a state
    if (pendingOrder) {
      setUserOrder(pendingOrder.order);
    }
    console.log("user orders: ", userOrder);
    if (trackedOrder) {
      setTracked(trackedOrder);
      localStorage.removeItem("orderId");
      console.log(trackedStatus, tracked); //here to fill up space, completely useless
    }
  }, [pendingOrder]);

  useEffect(() => {
    //sets order history to a state
    if (orderHistory) {
      setAllOrders(orderHistory.orders);
    }
    console.log("All user orders: ", orderHistory);
  }, [pendingOrder]);

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <Header />
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
                    localStorage.getItem("pfp")! ||
                    userDetails?.message.profile_picture_url
                  }
                  alt={username}
                />
                <AvatarFallback className="text-gray-900 dark:text-gray-300">
                  {username}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {userDetails?.message.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {userDetails?.message.email}
                </p>
                <p className="text-sm text-gray-500">
                  {userDetails?.message.phone_number}
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
                <DialogContent className="dark:text-cfont-dark">
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
                        value={userDetails?.message.restaurant_name}
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
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog
                open={isOrderHistoryOpen}
                onOpenChange={setIsOrderHistoryOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    View Order History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl dark:text-cfont-dark">
                  <DialogHeader>
                    <DialogTitle>Order History</DialogTitle>
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
                  {pendingStatus === "pending" ? (
                    <div className="flex flex-col justify-center items-center">
                      <l-waveform
                        size="35"
                        stroke="3.5"
                        speed="1"
                        color="#6C757D"
                      ></l-waveform>
                    </div>
                  ) : pendingStatus === "error" ? (
                    <div className="text-center py-8">
                      <p>Error loading orders. Please try again later.</p>
                    </div>
                  ) : userOrder ? (
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
                        <TableRow>
                          <TableCell>{userOrder.id}</TableCell>
                          <TableCell>
                            {userOrder.items
                              ?.map(
                                (item) => item.menu_name + `(x${item.quantity})`
                              )
                              .join(", ")}
                          </TableCell>
                          <TableCell>
                            ₦{Number(userOrder.total).toLocaleString()}
                          </TableCell>
                          <TableCell className="flex flex-col">
                            <Badge
                              className="max-w-16"
                              variant={
                                userOrder.status === "Delivered"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {userOrder.status}
                            </Badge>
                            <p className="italic ">
                              Order Code: "{localStorage.getItem("orderCode")}"
                            </p>
                          </TableCell>
                        </TableRow>
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
                  ) : pendingStatus === "error" ? (
                    <div className="text-center py-8">
                      <p>Error loading orders. Please try again later.</p>
                    </div>
                  ) : userOrder ? (
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
                        <TableRow>
                          <TableCell>{userOrder.id}</TableCell>
                          <TableCell>
                            {userOrder.items.map((item) => item.menu_name)}
                          </TableCell>
                          <TableCell>
                            ₦{Number(userOrder.total).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                userOrder.status === "Delivered"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {userOrder.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
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
