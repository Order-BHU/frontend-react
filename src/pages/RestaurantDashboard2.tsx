import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageWrapper } from "@/components/pagewrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Package } from "lucide-react";
//import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getMenuItems,
  addMenu,
  editMenu,
  myOrders,
  updateOrderStatus,
  deleteMenuItem,
  updateItemAvailability,
} from "@/api/restaurant";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  category,
  menuItem,
  tempapiMenu,
  orderType,
} from "@/interfaces/restaurantType";
import { editProfile, dashboard, changePassword } from "@/api/misc";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function RestaurantDashboardPage() {
  const [displayedMenuItems, setDisplayedMenuItems] = useState<menuItem[]>([]);
  const [pendingOrderState, setPendingOrders] = useState<orderType[]>([]);
  const [acceptedOrderState, setAccepted] = useState<orderType[]>([]);
  const username = localStorage.getItem("name")?.slice(0, 2).toUpperCase();
  const restaurant_id = localStorage.getItem("restaurant_id");
  const { toast } = useToast();
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: 0,
    description: "",
    image: null as File | null,
    category_id: 0,
    menuId: "",
  });

  //APIs
  const {
    status: orderStatus,
    data: pendingOrders,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["pendingOrders"],
    queryFn: () => myOrders("pending"),
    staleTime: 30000,
  });

  const { data: userDetails, refetch: refetchDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => dashboard(),
    refetchOnWindowFocus: false,
  });

  const {
    status: acceptedStatus,
    data: acceptedOrders,
    refetch: refetchaccepted,
  } = useQuery({
    queryKey: ["acceptedOrders"],
    queryFn: () => myOrders("accepted"),
    staleTime: 30000,
  });
  const { status: categoryStatus, data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 30000,
  });
  const {
    status: menuStatus,
    data: menuItems,
    refetch: refetchMenuItems,
  } = useQuery({
    queryKey: ["menuItems", restaurant_id],
    queryFn: () => getMenuItems(restaurant_id!),
    staleTime: 30000,
  });

  useEffect(() => {
    //this'll take user data and store the pfp in localeStorage and also store the default values in restaurant object
    if (userDetails) {
      localStorage.setItem("pfp", userDetails?.message?.profile_picture_url);
      setRestaurant((prev) => ({
        ...prev,
        name: userDetails?.message?.name || prev.name, // Ensure fallback to previous name if undefined
      }));
    }
    console.log("userdeets: ", userDetails);
  }, [userDetails]);

  useEffect(() => {
    console.log(localStorage.getItem("token"));
    if (pendingOrders) {
      setPendingOrders(pendingOrders.orders);
    }
  }, [pendingOrders]);

  useEffect(() => {
    if (acceptedOrders) {
      setAccepted(acceptedOrders.orders);
      console.log("my orders: ", acceptedOrders);
    }
  }, [acceptedOrders]);

  useEffect(() => {
    if (menuItems && categories) {
      // Flatten all menus from all categories into a single array
      const allMenus = menuItems.reduce((acc: any[], category: tempapiMenu) => {
        return [...acc, ...category.menus];
      }, []);

      // Process each menu item with its category
      const processedItems = allMenus.map((menu: menuItem) => {
        const menuCategory = menuItems.find(
          (category: category) => category.id === Number(menu.category_id)
        );
        return {
          ...menu,
          category: menuCategory?.name || "Uncategorized",
        };
      });

      setDisplayedMenuItems(processedItems);
    }
  }, [menuItems, categories]);

  const { mutate: orderStatusMutate } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      refetchOrders();
      refetchaccepted();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
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

  const handleUpdatePassword = () => {
    passwordMutate(passwordDeetails);
  };

  //this is what we'll pass to the change password mutate function
  const [passwordDeetails, setPasswordDetails] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const { mutate: deleteMenuItemMutate } = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: (data) => {
      refetchMenuItems();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      refetchMenuItems();
    },
  });

  const handleDeleteMenuItem = (id: number) => {
    deleteMenuItemMutate(id);

    setDisplayedMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const { mutate: editProfileMutate, status: editProfileMutateStatus } =
    useMutation({
      mutationFn: editProfile,
      onSuccess: (data) => {
        refetchDetails();
        localStorage.setItem("name", restaurant.name);
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

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    editProfileMutate(filteredData);
    console.log(restaurant);
  };

  const handlePfpImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRestaurant({ ...restaurant, profile_picture: e.target.files[0] });
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewMenuItem({ ...newMenuItem, image: e.target.files[0] });
    }
  };
  const [restaurant, setRestaurant] = useState({
    name: "",
    profile_picture: null as File | null,
    phone_number_type: "",
  });
  const filteredData = Object.fromEntries(
    //this is here to filter only the truthy values from the edit profile form and we pass it to mutate, since the api can't accept empty strings as they'll override whatever is already there
    Object.entries(restaurant).filter(([_, value]) => value)
  );

  const handlePhoneTypeChange = (type: "whatsapp" | "phone") => {
    setRestaurant((prev) => ({ ...prev, phone_number_type: type }));
  };
  const [editingMenuItem, setEditingMenuItem] = useState<
    (typeof menuItems)[0] | null
  >(null);

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      name: newMenuItem.name,
      description: newMenuItem.description,
      category_id: newMenuItem.category_id,
      price: newMenuItem.price,
      image: newMenuItem.image,
      id: Number(restaurant_id),
      category: "",
      is_available: "1",
    });
  };

  const handleEditMenuItem = (itemId: number, e: React.FormEvent) => {
    e.preventDefault();
    editMutate({
      name: newMenuItem.name,
      description: newMenuItem.description,
      category_id: newMenuItem.category_id,
      price: newMenuItem.price,
      image: newMenuItem.image,
      id: Number(itemId),
      category: "",
      is_available: "1",
    });
  };

  const handlecategoryStatusChange = (
    orderId: number,
    newcategoryStatus: string
  ) => {
    orderStatusMutate({
      orderId: Number(orderId),
      status: newcategoryStatus,
    });
    refetchOrders();
    // Here you would typically update the order categoryStatus in your backend
  };

  const { status: mutateStatus, mutate } = useMutation({
    mutationFn: addMenu,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      setNewMenuItem({
        name: "",
        price: 0,
        description: "",
        image: null as File | null,
        category_id: 0,
        menuId: "",
      });
      refetchMenuItems();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { /*status: editStatus,*/ mutate: editMutate } = useMutation({
    mutationFn: editMenu,
    onSuccess: (data) => {
      refetchMenuItems();
      toast({
        title: "Success",
        description: data.message,
      });
      refetchMenuItems();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number | string) => {
    // Convert to number if it's a string
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    // Check if it's a valid number
    if (isNaN(numericPrice)) {
      return "₦0.00";
    }

    // Format with Nigerian Naira and proper decimal places
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  const { mutate: isAvailableMutate } = useMutation({
    mutationFn: updateItemAvailability,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      refetchMenuItems();
    },
  });

  const handleItemAvailability = (menuId: number, value: "1" | "0") => {
    const foundItem = displayedMenuItems.find(
      (item) => item.category_id === menuId
    );
    if (foundItem) {
      setDisplayedMenuItems((prev) =>
        prev.map((item) =>
          item.id === menuId ? { ...item, is_available: value } : item
        )
      );
    }
    isAvailableMutate({
      menuid: menuId,
      value: value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <main className="flex-grow container mx-auto px-4 py-8">
        <PageWrapper>
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-cfont-dark">
            Restaurant Dashboard
          </h1>
        </PageWrapper>

        <PageWrapper className="col-span-full mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-4 flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userDetails?.message?.profile_picture_url} />
                <AvatarFallback className="text-gray-900 dark:text-gray-300">
                  {username}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="md:text-xl font-semibold sm:text-lg text-sm">
                  {localStorage.getItem("name")}
                </h2>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="sm:mt-8">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="dark:text-cfont-dark overflow-auto max-h-[95vh]">
                  <DialogHeader>
                    <DialogTitle>Edit Restaurant Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditProfile} className="space-y-4">
                    <div>
                      <Label
                        htmlFor="restaurantPhoto"
                        className="dark:text-cfont-dark"
                      >
                        Restaurant Photo
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
                        Restaurant Name
                      </Label>
                      <Input
                        id="restaurantName"
                        value={userDetails?.message?.restaurant_name}
                        className="dark:text-cfont-dark"
                        onChange={(e) =>
                          setRestaurant({
                            ...restaurant,
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
                        Phone Number Type:
                      </Label>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={
                            restaurant.phone_number_type === "whatsapp"
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
                            restaurant.phone_number_type === "phone"
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
                      disabled={editProfileMutateStatus === "pending"}
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
                Wallet Balance
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{userDetails?.wallet_balance}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p> */}
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
              <div className="text-2xl font-bold">
                {userDetails?.statistics?.completed_orders}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                +15% from last month
              </p> */}
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
        </PageWrapper>

        <PageWrapper>
          <Tabs
            defaultValue="orders"
            className="space-y-4 w-full space-x-2 box-content"
          >
            <TabsList className="w-full flex flex-wrap overflow-auto h-auto">
              <TabsTrigger
                value="orders"
                className="flex-1 whitespace-normal min-w-[120px] text-center"
              >
                Order Management
              </TabsTrigger>
              <TabsTrigger
                value="menu"
                className="flex-1 whitespace-normal min-w-[120px] text-center"
              >
                Menu Management
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="flex-1 whitespace-normal min-w-[120px] text-center"
              >
                Financial Management
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <PageWrapper>
                <Card>
                  <CardHeader>
                    <CardTitle>Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orderStatus === "pending" ? (
                      <div className="flex flex-col justify-center items-center">
                        <l-waveform
                          size="35"
                          stroke="3.5"
                          speed="1"
                          color="var(--loader-color)"
                        ></l-waveform>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            {/* <TableHead>Customer</TableHead> */}
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>categoryStatus</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingOrderState?.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>{order.id}</TableCell>
                              {/* <TableCell>{order.customer}</TableCell> */}
                              <TableCell>
                                {order.items
                                  ?.map(
                                    (item) =>
                                      item.menu_name + `(x${item.quantity})`
                                  )
                                  .join(", ")}
                              </TableCell>
                              <TableCell>
                                ₦{Number(order.total).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    order.status === "ready"
                                      ? "secondary"
                                      : "default"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) =>
                                    handlecategoryStatusChange(order.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Update categoryStatus" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="accepted">
                                      Accept
                                    </SelectItem>
                                    <SelectItem value="ready">Ready</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Accepted Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {acceptedStatus === "pending" ? (
                      <div className="flex flex-col justify-center items-center">
                        <l-waveform
                          size="35"
                          stroke="3.5"
                          speed="1"
                          color="var(--loader-color)"
                        ></l-waveform>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            {/* <TableHead>Customer</TableHead> */}
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>categoryStatus</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {acceptedOrderState?.map((order) => (
                            <TableRow key={order?.order_id}>
                              <TableCell>{order.order_id}</TableCell>
                              {/* <TableCell>{order.customer}</TableCell> */}
                              <TableCell>
                                {order.items
                                  ?.map(
                                    (item) =>
                                      item.menu_name + `(x${item.quantity})`
                                  )
                                  .join(", ")}
                              </TableCell>
                              <TableCell>
                                ₦{Number(order.total).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge variant={"secondary"}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={order.status}
                                  onValueChange={(value) =>
                                    handlecategoryStatusChange(
                                      order.order_id,
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Update categoryStatus" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="accepted">
                                      Accepted
                                    </SelectItem>
                                    <SelectItem value="ready">Ready</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </PageWrapper>
            </TabsContent>
            <TabsContent value="menu">
              <PageWrapper>
                {menuStatus === "pending" ? (
                  <div className="flex flex-col justify-center items-center">
                    <l-waveform
                      size="35"
                      stroke="3.5"
                      speed="1"
                      color="white"
                    ></l-waveform>
                  </div>
                ) : (
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
                            <TableHead>Availability</TableHead>
                            <TableHead className="text-center">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedMenuItems?.map((item: menuItem) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{formatPrice(item.price)}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>
                                <Select
                                  onValueChange={(value: "1" | "0") => {
                                    handleItemAvailability(item.id, value);
                                  }}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                      placeholder={
                                        item.is_available === "1"
                                          ? "Available"
                                          : item.is_available === "0"
                                          ? "Unavailable"
                                          : "Select availability"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Available</SelectItem>

                                    <SelectItem value="0">
                                      Unavailable
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col items-center md:flex-row md:justify-center">
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
                                    <DialogContent className="dark: text-cfont-dark">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Edit Menu Item
                                        </DialogTitle>
                                      </DialogHeader>
                                      {editingMenuItem && (
                                        <form
                                          onSubmit={(e) =>
                                            handleEditMenuItem(item.id, e)
                                          }
                                          className="mt-4 space-y-4"
                                        >
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                              <Label htmlFor="name">Name</Label>
                                              <Input
                                                id="name"
                                                value={item.name}
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
                                              <Label htmlFor="price">
                                                Price (₦)
                                              </Label>
                                              <Input
                                                id="price"
                                                value={item.price}
                                                onChange={(e) => {
                                                  const { value } = e.target;

                                                  setNewMenuItem({
                                                    ...newMenuItem,
                                                    price: Number(
                                                      value.replace(
                                                        /[^0-9]/g,
                                                        ""
                                                      )
                                                    ),
                                                  });
                                                }}
                                                required
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor="description">
                                                Description
                                              </Label>
                                              <Textarea
                                                id="description"
                                                value={item.description}
                                                onChange={(e) =>
                                                  setNewMenuItem({
                                                    ...newMenuItem,
                                                    description: e.target.value,
                                                  })
                                                }
                                                required
                                              />
                                            </div>

                                            <div>
                                              <Label htmlFor="image">
                                                Image
                                              </Label>
                                              <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                required
                                              />
                                            </div>

                                            <div>
                                              <Label htmlFor="category">
                                                Category
                                              </Label>
                                              <Select
                                                onValueChange={(value) => {
                                                  setNewMenuItem({
                                                    ...newMenuItem,
                                                    category_id: Number(value),
                                                  });
                                                }}
                                              >
                                                <SelectTrigger className="w-[180px]">
                                                  <SelectValue placeholder="Choose Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {categoryStatus ===
                                                  "pending" ? (
                                                    <SelectItem
                                                      value=""
                                                      disabled
                                                    >
                                                      Loading categories...
                                                    </SelectItem>
                                                  ) : categoryStatus ===
                                                    "error" ? (
                                                    <SelectItem
                                                      value=""
                                                      disabled
                                                    >
                                                      Error loading categories
                                                    </SelectItem>
                                                  ) : (
                                                    categories?.map(
                                                      (category: category) => (
                                                        <SelectItem
                                                          key={category.id}
                                                          value={String(
                                                            category.id
                                                          )}
                                                        >
                                                          {category.name}
                                                        </SelectItem>
                                                      )
                                                    )
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </div>
                                          <Button
                                            type="submit"
                                            disabled={
                                              mutateStatus === "pending"
                                            }
                                          >
                                            Update Menu Item
                                          </Button>
                                        </form>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        className="ml-3"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingMenuItem(item)}
                                      >
                                        Delete
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="dark: text-cfont-dark">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Delete Item '{item.name}'
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="flex justify-around">
                                        <Button
                                          variant="destructive"
                                          onClick={() =>
                                            handleDeleteMenuItem(item.id)
                                          }
                                        >
                                          Yes
                                        </Button>
                                        <DialogClose asChild>
                                          <Button>No</Button>
                                        </DialogClose>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <form
                        onSubmit={handleAddMenuItem}
                        className="mt-4 space-y-4"
                      >
                        <h3 className="text-lg font-semibold">
                          Add New Menu Item
                        </h3>
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
                              onChange={(e) => {
                                const { value } = e.target;

                                setNewMenuItem({
                                  ...newMenuItem,
                                  price: Number(value.replace(/[^0-9]/g, "")),
                                });
                              }}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={newMenuItem.description}
                              onChange={(e) =>
                                setNewMenuItem({
                                  ...newMenuItem,
                                  description: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="image">Image</Label>
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                              onValueChange={(value) => {
                                setNewMenuItem({
                                  ...newMenuItem,
                                  category_id: Number(value),
                                });
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Choose Category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categoryStatus === "pending" ? (
                                  <SelectItem value="" disabled>
                                    Loading categories...
                                  </SelectItem>
                                ) : categoryStatus === "error" ? (
                                  <SelectItem value="" disabled>
                                    Error loading categories
                                  </SelectItem>
                                ) : (
                                  categories?.map((category: category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={String(category.id)}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          disabled={mutateStatus === "pending"}
                        >
                          Add Menu Item
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </PageWrapper>
            </TabsContent>
            <TabsContent value="financial">
              <div className="grid grid-cols-1 gap-6">
                <PageWrapper>
                  <Card>
                    <CardHeader>
                      <CardTitle>Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* {userDetails?.statistics?.transactions?.map(
                        <Card>
                          <CardHeader>
                            <CardTitle>Transaction name</CardTitle>
                          </CardHeader>
                          <CardContent>content would go here</CardContent>
                        </Card>
                      )} */}
                      {/* <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Food Sales
                          </span>
                          <span className="text-sm font-semibold">
                            ₦180,000
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Beverage Sales
                          </span>
                          <span className="text-sm font-semibold">₦45,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Delivery Fees
                          </span>
                          <span className="text-sm font-semibold">₦9,567</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold">
                            Total Revenue
                          </span>
                          <span className="text-sm font-bold">₦234,567</span>
                        </div>
                      </div> */}
                    </CardContent>
                  </Card>
                </PageWrapper>
              </div>
            </TabsContent>
          </Tabs>
        </PageWrapper>
      </main>
    </div>
  );
}
