"use client";

import { useState } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
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
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  DollarSign,
  Package,
  TrendingUp,
  Utensils,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// This would typically come from an API or database
const orders = [
  {
    id: "1",
    customer: "John Doe",
    items: ["Jollof Rice", "Chicken"],
    total: "₦3,500",
    status: "Preparing",
  },
  {
    id: "2",
    customer: "Jane Smith",
    items: ["Egusi Soup", "Pounded Yam"],
    total: "₦4,200",
    status: "Delivered",
  },
  {
    id: "3",
    customer: "Mike Johnson",
    items: ["Suya", "Fries"],
    total: "₦2,800",
    status: "In Transit",
  },
];

const menuItems = [
  { id: "1", name: "Jollof Rice", price: "₦1,500", category: "Main Course" },
  { id: "2", name: "Egusi Soup", price: "₦2,000", category: "Soup" },
  { id: "3", name: "Suya", price: "₦1,800", category: "Appetizer" },
];

export default function RestaurantDashboardPage() {
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [restaurant, setRestaurant] = useState({
    name: "Tasty Bites Restaurant",
    photo: "/placeholder.svg?height=100&width=100",
  });
  const [editingMenuItem, setEditingMenuItem] = useState<
    (typeof menuItems)[0] | null
  >(null);

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the new menu item to your backend
    console.log("New menu item:", newMenuItem);
    setNewMenuItem({ name: "", price: "", category: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Restaurant Dashboard
        </h1>

        <Card className="col-span-full mb-6">
          <CardHeader>
            <CardTitle>Restaurant Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={restaurant.photo} alt={restaurant.name} />
              <AvatarFallback>{restaurant.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{restaurant.name}</h2>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Restaurant Profile</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Restaurant profile updated:", restaurant);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="restaurantPhoto">Restaurant Photo</Label>
                    <Input
                      id="restaurantPhoto"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setRestaurant({
                              ...restaurant,
                              photo: reader.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="restaurantName">Restaurant Name</Label>
                    <Input
                      id="restaurantName"
                      value={restaurant.name}
                      onChange={(e) =>
                        setRestaurant({ ...restaurant, name: e.target.value })
                      }
                    />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦234,567</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Order Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦3,450</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
          {/* Removed Customer Satisfaction Card */}
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="financial">Financial Management</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
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
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Update Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <CardTitle>Menu Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menuItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingMenuItem(item)}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Menu Item</DialogTitle>
                              </DialogHeader>
                              {editingMenuItem && (
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    console.log(
                                      "Menu item updated:",
                                      editingMenuItem
                                    );
                                    setEditingMenuItem(null);
                                  }}
                                  className="space-y-4"
                                >
                                  <div>
                                    <Label htmlFor="itemName">Name</Label>
                                    <Input
                                      id="itemName"
                                      value={editingMenuItem.name}
                                      onChange={(e) =>
                                        setEditingMenuItem({
                                          ...editingMenuItem,
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="itemPrice">Price (₦)</Label>
                                    <Input
                                      id="itemPrice"
                                      value={editingMenuItem.price}
                                      onChange={(e) =>
                                        setEditingMenuItem({
                                          ...editingMenuItem,
                                          price: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="itemCategory">
                                      Category
                                    </Label>
                                    <Input
                                      id="itemCategory"
                                      value={editingMenuItem.category}
                                      onChange={(e) =>
                                        setEditingMenuItem({
                                          ...editingMenuItem,
                                          category: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <Button type="submit">
                                    Update Menu Item
                                  </Button>
                                </form>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <form onSubmit={handleAddMenuItem} className="mt-4 space-y-4">
                  <h3 className="text-lg font-semibold">Add New Menu Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newMenuItem.name}
                        onChange={(e) =>
                          setNewMenuItem({
                            ...newMenuItem,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (₦)</Label>
                      <Input
                        id="price"
                        value={newMenuItem.price}
                        onChange={(e) =>
                          setNewMenuItem({
                            ...newMenuItem,
                            price: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newMenuItem.category}
                        onChange={(e) =>
                          setNewMenuItem({
                            ...newMenuItem,
                            category: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit">Add Menu Item</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="financial">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Food Sales</span>
                      <span className="text-sm font-semibold">₦180,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Beverage Sales
                      </span>
                      <span className="text-sm font-semibold">₦45,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Delivery Fees</span>
                      <span className="text-sm font-semibold">₦9,567</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Total Revenue</span>
                      <span className="text-sm font-bold">₦234,567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}