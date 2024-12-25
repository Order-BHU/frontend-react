import { useState } from "react";
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

// Mock data - in a real app, this would come from an API
const allUserOrders = [
  {
    id: "1",
    restaurant: "Burger Palace",
    items: ["Cheeseburger", "Fries"],
    total: "₦3,500",
    status: "Delivered",
    date: "2023-06-15",
  },
  {
    id: "2",
    restaurant: "Pizza Heaven",
    items: ["Pepperoni Pizza"],
    total: "₦4,200",
    status: "In Transit",
    date: "2023-06-14",
  },
  {
    id: "3",
    restaurant: "Sushi Sensation",
    items: ["California Roll", "Miso Soup"],
    total: "₦5,500",
    status: "Preparing",
    date: "2023-06-13",
  },
  {
    id: "4",
    restaurant: "Taco Town",
    items: ["Beef Tacos", "Guacamole"],
    total: "₦3,800",
    status: "Delivered",
    date: "2023-06-12",
  },
  {
    id: "5",
    restaurant: "Pasta Paradise",
    items: ["Spaghetti Carbonara"],
    total: "₦4,500",
    status: "Delivered",
    date: "2023-06-11",
  },
  {
    id: "6",
    restaurant: "Salad Spot",
    items: ["Caesar Salad", "Iced Tea"],
    total: "₦2,800",
    status: "Delivered",
    date: "2023-06-10",
  },
];

const userActivity = [
  { id: "1", action: "Placed an order", date: "2023-06-15 14:30" },
  { id: "2", action: "Wrote a review", date: "2023-06-14 09:15" },
  { id: "3", action: "Added items to cart", date: "2023-06-13 18:45" },
];

export default function UserDashboardPage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 123 456 7890",
    profilePicture: "/placeholder.svg?height=80&width=80",
  });

  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the updated profile to your backend
    console.log("Profile updated:", user);
    // Close the dialog (you might want to use a state to control this)
  };

  const recentOrders = allUserOrders.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <PageWrapper>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
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
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
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
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <Label htmlFor="profilePicture">Profile Picture</Label>
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setUser({
                                ...user,
                                profilePicture: reader.result as string,
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
                    <Button type="submit">Update Profile</Button>
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Restaurant</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUserOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="dark:text-cfont-dark"
                        >
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.restaurant}</TableCell>
                          <TableCell>{order.items.join(", ")}</TableCell>
                          <TableCell>{order.total}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "Delivered"
                                  ? "secondary"
                                  : "default"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </PageWrapper>

        <Tabs defaultValue="orders" className="space-y-4">
          <PageWrapper>
            <TabsList>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </PageWrapper>

          <TabsContent value="orders">
            <PageWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentOrders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Restaurant</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.restaurant}</TableCell>
                            <TableCell>{order.items.join(", ")}</TableCell>
                            <TableCell>{order.total}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === "Delivered"
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{order.date}</TableCell>
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
          <TabsContent value="activity">
            <PageWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userActivity.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>{activity.action}</TableCell>
                          <TableCell>{activity.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
