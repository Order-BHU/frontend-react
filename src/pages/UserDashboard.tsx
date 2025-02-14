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
import { waveform } from "ldrs";
import { updatePfp } from "@/api/misc";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app, this would come from an API
// const allUserOrder = [
//   {
//     id: "1",
//     restaurant: "Burger Palace",
//     items: ["Cheeseburger", "Fries"],
//     total: "₦3,500",
//     status: "Delivered",
//     date: "2023-06-15",
//   },
//   {
//     id: "2",
//     restaurant: "Pizza Heaven",
//     items: ["Pepperoni Pizza"],
//     total: "₦4,200",
//     status: "In Transit",
//     date: "2023-06-14",
//   },
//   {
//     id: "3",
//     restaurant: "Sushi Sensation",
//     items: ["California Roll", "Miso Soup"],
//     total: "₦5,500",
//     status: "Preparing",
//     date: "2023-06-13",
//   },
//   {
//     id: "4",
//     restaurant: "Taco Town",
//     items: ["Beef Tacos", "Guacamole"],
//     total: "₦3,800",
//     status: "Delivered",
//     date: "2023-06-12",
//   },
//   {
//     id: "5",
//     restaurant: "Pasta Paradise",
//     items: ["Spaghetti Carbonara"],
//     total: "₦4,500",
//     status: "Delivered",
//     date: "2023-06-11",
//   },
//   {
//     id: "6",
//     restaurant: "Salad Spot",
//     items: ["Caesar Salad", "Iced Tea"],
//     total: "₦2,800",
//     status: "Delivered",
//     date: "2023-06-10",
//   },
// ];

// const userActivity = [
//   { id: "1", action: "Placed an order", date: "2023-06-15 14:30" },
//   { id: "2", action: "Wrote a review", date: "2023-06-14 09:15" },
//   { id: "3", action: "Added items to cart", date: "2023-06-13 18:45" },
// ];

export default function UserDashboardPage() {
  waveform.register();
  const { toast } = useToast();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    profile_picture: "/placeholder.svg?height=80&width=80",
  });

  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Profile updated:", user);
  // };

  // const recentOrders = allUserOrder.slice(0, 4);
  const [userOrder, setUserOrder] = useState<orderType>(); //this state stores all the pending orders for the user
  const [allOrders, setAllOrders] = useState<orderType[]>([]); //stores all order history
  const [tracked, setTracked] = useState<orderType>(); //deals with tracked order(what we'll be displaying to the user)
  const username = localStorage.getItem("name")?.slice(0, 2).toUpperCase();
  const { status: pfpStatus, mutate: pfpMutate } = useMutation({
    mutationFn: updatePfp,
    onSuccess: (data) => {
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
  const { data: pendingOrder, status: pendingStatus } = useQuery({
    queryFn: () => myOrders("pending"),
    queryKey: ["orders"],
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

  const [file, setFile] = useState<File | null>(null); //here for updating pfp
  const handleUpdatePfp = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the file and other data here
    const formData = new FormData();
    if (file) {
      formData.append("profile_picture", file); // Add the file to the form data
    }
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", user.phone);

    pfpMutate({
      profile_picture: file,
    });
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
                <AvatarImage src={user.profile_picture} alt={username} />
                <AvatarFallback className="text-white">
                  {username}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">{user.phone}</p>
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
                <DialogContent className="dark: text-cfont-dark">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdatePfp} className="space-y-4">
                    <div>
                      <Label htmlFor="profile_picture">Profile Picture</Label>
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file); // Save the selected file to state
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setUser({
                                ...user,
                                profile_picture: reader.result as string, // Optional: store base64 for preview
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) =>
                          setUser({ ...user, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={user.phone}
                        onChange={(e) =>
                          setUser({ ...user, phone: e.target.value })
                        }
                      />
                    </div>
                    <Button type="submit" disabled={pfpStatus === "pending"}>
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
                        color="white"
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
                        color="white"
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
                        color="white"
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
