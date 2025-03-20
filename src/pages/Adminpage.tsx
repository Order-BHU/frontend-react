import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "../components/footer";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Utensils, Bike, DollarSign, Eye, EyeOff } from "lucide-react";
import { PageWrapper } from "@/components/pagewrapper";
import { createRestaurant } from "@/api/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBanks, resolveBank } from "@/api/auth";
import { dashboard } from "@/api/misc";
import { banksType } from "@/interfaces/paymentType";
import debounce from "lodash/debounce";
import { restaurantMetric, transactionType } from "@/interfaces/restaurantType";

// Mock data - in a real app, this would come from an API
const revenueData = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 5000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 1890 },
  { name: "Sat", value: 2390 },
  { name: "Sun", value: 3490 },
];

const drivers = [
  {
    id: "1",
    name: "John Doe",
    totalOrders: 50,
    completedOrders: 48,
    totalEarnings: "₦75,000",
  },
  {
    id: "2",
    name: "Jane Smith",
    totalOrders: 45,
    completedOrders: 44,
    totalEarnings: "₦68,000",
  },
  {
    id: "3",
    name: "Mike Johnson",
    totalOrders: 40,
    completedOrders: 39,
    totalEarnings: "₦62,000",
  },
];

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

type TimeRange = "day" | "week" | "month" | "year";
export default function AdminDashboardPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  //creating restaurant details

  const { status, mutate } = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      toast({
        title: "Sign-up successful!",
        description: "Verify your account",
      });
      navigate("/verify-otp/", { state: { formData } });
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
  const [restaurantTimeRange, setRestaurantTimeRange] =
    useState<TimeRange>("month");
  const [formData, setformData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    phoneType: "whatsapp",
    owners_name: "",
    restaurant_name: "",
    account_no: "",
    bank_code: "",
    bank_name: "",
  });

  const debouncedResolveBankMutate = useCallback(
    debounce((data) => {
      handleResolveBankMutate(data);
    }, 300),
    []
  );

  const [resolveBankData, setResolveBankData] = useState<{
    //this state will store the data I will send to the resolve bank route
    bank_code: string;
    account_number: string;
  }>({
    bank_code: "",
    account_number: "",
  });
  const [resolvedBankName, setResolvedBankName] = useState(""); //handles storing the name of the account from resolved. May be redundant, but I'm in a hurry rn
  const [allBanks, setAllBanks] = useState<banksType[]>([]);
  useEffect(() => {
    //this will handle the mutations. I'm not doing it directly because something something asynchronous programming
    if (
      resolveBankData.account_number.length >= 10 ||
      resolveBankData.bank_code
    ) {
      debouncedResolveBankMutate(resolveBankData);
    }
  }, [resolveBankData]);
  const { data: bankList, status: bankListStatus } = useQuery({
    queryKey: ["bankList"],
    queryFn: getBanks,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: userDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => dashboard(),
    refetchOnWindowFocus: false,
  });

  const handleResolveBankMutate = (bank: {
    bank_code: string;
    account_number: string;
  }) => {
    console.log("bank sending:", bank);
    resolveBankMutate(bank);
  };

  useEffect(() => {
    if (bankList?.data && Array.isArray(bankList.data)) {
      const processed = bankList.data.map((bank: banksType) => ({
        ...bank,
      }));
      setAllBanks(processed);
    }
  }, [bankList]); // Depend on `bankList` instead of `bankList?.data`

  //const [foundResolvedBank, setFoundResolvedBank] = useState({});
  const { mutate: resolveBankMutate } = useMutation({
    mutationFn: resolveBank,
    onSuccess: (data) => {
      //setFoundResolvedBank(data);
      setResolvedBankName(data?.data.account_name);
      const matchingbank = allBanks.find(
        (bank) => bank.id === data.data.bank_id
      );
      setformData((prev) => ({
        ...prev,
        bank_name: matchingbank?.name || prev.bank_name,
      }));
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
  const bankOptions = useMemo(() => {
    //idk what this does yet, but it helps with performance
    if (bankListStatus !== "success") return null;
    return allBanks.map((bank) => (
      <SelectItem
        key={`${bank.id}-${bank.code}-${bank.name}`}
        value={String(bank.code)}
      >
        {bank.name}
      </SelectItem>
    ));
  }, [allBanks, bankListStatus]);

  const handleRestaurantPhoneTypeChange = (type: "whatsapp" | "sms") => {
    setformData((prev) => ({ ...prev, phoneType: type }));
  };
  const [showRestaurantPassword, setShowRestaurantPassword] = useState(false);
  const [showRestaurantConfirmPassword, setShowRestaurantConfirmPassword] =
    useState(false);
  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolvedBankName === undefined || resolvedBankName === "") {
      toast({
        title: "Couldn't find bank",
        description: "Couldn't find this bank account",
        variant: "destructive",
      });
    }
    console.log("New restaurant:", formData);
    mutate({
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone,
      phone_number_type: formData.phoneType as "whatsapp" | "sms" | "both",
      account_type: "restaurant",
      owners_name: formData.owners_name,
      restaurant_name: formData.restaurant_name,
      account_no: formData.account_no,
      bank_code: formData.bank_code,
      bank_name: formData.bank_name,
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // First update formData
    if (name === "phone" || name === "account_number") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setformData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setformData((prev) => ({ ...prev, [name]: value }));
    }

    // Only update resolveBankData for account_number
    if (name === "account_no") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setResolveBankData((prev) => ({ ...prev, account_number: numericValue }));
    }
  };
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [newRider, setNewRider] = useState({ name: "", email: "", phone: "" });

  const handleCreateRider = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the new rider data to your backend
    console.log("New rider:", newRider);
    setNewRider({ name: "", email: "", phone: "" });
    // You might want to add some feedback to the user here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <PageWrapper>
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-cfont-dark">
            Admin Dashboard
          </h1>
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
                {Number(
                  userDetails?.transactions?.total_revenue
                ).toLocaleString() || ""}
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

        <PageWrapper>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="flex flex-wrap mb-10 sm:mb-4 galaxy-fold:mb-16">
              <TabsTrigger value="overview" className="flex-grow">
                Revenue Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex-grow">
                Transactions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <PageWrapper>
                <Card className="mb-8">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                    <CardTitle className="text-lg md:text-xl font-semibold">
                      Revenue Overview
                    </CardTitle>
                    <Select
                      value={timeRange}
                      onValueChange={(value: TimeRange) => setTimeRange(value)}
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
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </PageWrapper>
            </TabsContent>
            <TabsContent value="transactions">
              <PageWrapper>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Recent Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap">
                              ID
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Customer ID
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Restaurant ID
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Type
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Reference
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDetails?.transactions?.recent?.map(
                            (data: transactionType) => (
                              <TableRow key={data.id}>
                                <TableCell className="whitespace-nowrap">
                                  {data.id}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {data.customer_id}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {data.restaurant_id}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {data.type}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {data.reference}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  <Badge
                                    variant={
                                      data.status === "completed"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {data.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </PageWrapper>
            </TabsContent>
          </Tabs>
        </PageWrapper>

        <PageWrapper>
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
                <Card>
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
                              Pending Orders
                            </TableHead>

                            <TableHead className="whitespace-nowrap">
                              Total Revenue
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Average Value
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Wallet Balance
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userDetails?.restaurant_metrics.map(
                            (restaurant: restaurantMetric) => (
                              <TableRow key={restaurant.id}>
                                <TableCell className="whitespace-nowrap">
                                  {restaurant.name}
                                </TableCell>
                                <TableCell>{restaurant.total_orders}</TableCell>
                                <TableCell>
                                  {restaurant.pending_orders}
                                </TableCell>
                                <TableCell>
                                  {restaurant.total_revenue}
                                </TableCell>
                                <TableCell>
                                  {restaurant.average_order_value}
                                </TableCell>
                                <TableCell>
                                  {restaurant.wallet_balance}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-4 w-full sm:w-auto">
                          Create New Restaurant Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] dark:text-cfont-dark">
                        <DialogHeader>
                          <DialogTitle>
                            Create New Restaurant Account
                          </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[80vh] px-8">
                          <form
                            onSubmit={handleCreateRestaurant}
                            className="space-y-4 w-[90%] pl-3"
                          >
                            <div>
                              <Label htmlFor="restaurantName">
                                Restaurant Name
                              </Label>
                              <Input
                                id="restaurantName"
                                value={formData.restaurant_name}
                                onChange={(e) =>
                                  setformData({
                                    ...formData,
                                    restaurant_name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="ownerName">Owner's Name</Label>
                              <Input
                                id="ownerName"
                                value={formData.owners_name}
                                onChange={(e) =>
                                  setformData({
                                    ...formData,
                                    owners_name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="restaurantEmail">Email</Label>
                              <Input
                                id="restaurantEmail"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                  setformData({
                                    ...formData,
                                    email: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor="phone"
                                className="dark:text-cfont-dark"
                              >
                                Phone Number
                              </Label>
                              <Input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="dark:text-cfont-dark"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                              />
                              <div className="flex space-x-2 mt-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={
                                    formData.phoneType === "whatsapp"
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() =>
                                    handleRestaurantPhoneTypeChange("whatsapp")
                                  }
                                >
                                  WhatsApp
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={
                                    formData.phoneType === "sms"
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() =>
                                    handleRestaurantPhoneTypeChange("sms")
                                  }
                                >
                                  SMS
                                </Button>
                              </div>
                            </div>

                            <div>
                              <Label
                                htmlFor="accountnum"
                                className="dark:text-cfont-dark"
                              >
                                Bank Account Number
                              </Label>
                              <Input
                                type="tel"
                                id="accountnum"
                                name="account_no"
                                className="dark:text-cfont-dark"
                                value={formData.account_no}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="bank">Bank</Label>
                              <Select
                                onValueChange={(value) => {
                                  const selectedBank = allBanks?.find(
                                    (bank) => String(bank.code) === value
                                  );
                                  if (selectedBank) {
                                    setformData((prev) => ({
                                      ...prev,
                                      bank_code: selectedBank.code,
                                    }));
                                    setResolveBankData((prev) => ({
                                      ...prev,
                                      bank_code: selectedBank.code,
                                    }));
                                  }
                                }}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Choose Bank" />
                                </SelectTrigger>
                                <SelectContent>
                                  {bankListStatus === "pending" ? (
                                    <SelectItem value="" disabled>
                                      Loading Banks...
                                    </SelectItem>
                                  ) : bankListStatus === "error" ? (
                                    <SelectItem value="" disabled>
                                      Error loading Banks
                                    </SelectItem>
                                  ) : (
                                    bankOptions
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <div
                              className={`relative ${
                                resolvedBankName === "" ? "hidden" : ""
                              }`}
                            >
                              <p>Matching account: </p>
                              <h3>{resolvedBankName?.toLocaleUpperCase()}</h3>
                            </div>

                            <div className="relative">
                              <Label
                                htmlFor="password"
                                className="dark:text-cfont-dark"
                              >
                                Password
                              </Label>
                              <Input
                                type={
                                  showRestaurantPassword ? "text" : "password"
                                }
                                id="password"
                                name="password"
                                className="dark:text-cfont-dark"
                                value={formData.password}
                                onChange={handleChange}
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-2 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowRestaurantPassword(
                                    !showRestaurantPassword
                                  )
                                }
                              >
                                {showRestaurantPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="sr-only">
                                  {showRestaurantPassword
                                    ? "Hide password"
                                    : "Show password"}
                                </span>
                              </Button>
                            </div>
                            <div className="relative">
                              <Label
                                htmlFor="confirmPassword"
                                className="dark:text-cfont-dark"
                              >
                                Confirm Password
                              </Label>
                              <Input
                                type={
                                  showRestaurantConfirmPassword
                                    ? "text"
                                    : "password"
                                }
                                id="confirmPassword"
                                name="confirmPassword"
                                className="dark:text-cfont-dark"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-2 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() =>
                                  setShowRestaurantConfirmPassword(
                                    !showRestaurantConfirmPassword
                                  )
                                }
                              >
                                {showRestaurantConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="sr-only">
                                  {showRestaurantConfirmPassword
                                    ? "Hide confirm password"
                                    : "Show confirm password"}
                                </span>
                              </Button>
                            </div>

                            <Button
                              type="submit"
                              className="w-full"
                              disabled={status === "pending"}
                            >
                              {status === "pending"
                                ? "Creating account..."
                                : "Create Restaurant Account"}
                            </Button>
                          </form>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </PageWrapper>
            </TabsContent>
            <TabsContent value="drivers">
              <PageWrapper>
                <Card>
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
                              Completion Rate
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                              Total Earnings
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {drivers.map((driver) => (
                            <TableRow key={driver.id}>
                              <TableCell className="whitespace-nowrap">
                                {driver.name}
                              </TableCell>
                              <TableCell>{driver.totalOrders}</TableCell>
                              <TableCell>{driver.completedOrders}</TableCell>
                              <TableCell>
                                {(
                                  (driver.completedOrders /
                                    driver.totalOrders) *
                                  100
                                ).toFixed(2)}
                                %
                              </TableCell>
                              <TableCell>{driver.totalEarnings}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-4 w-full sm:w-auto">
                          Create New Rider Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] dark:text-cfont-dark">
                        <DialogHeader>
                          <DialogTitle>Create New Rider Account</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleCreateRider}
                          className="space-y-4"
                        >
                          <div>
                            <Label htmlFor="riderName">Rider Name</Label>
                            <Input
                              id="riderName"
                              value={newRider.name}
                              onChange={(e) =>
                                setNewRider({
                                  ...newRider,
                                  name: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="riderEmail">Email</Label>
                            <Input
                              id="riderEmail"
                              type="email"
                              value={newRider.email}
                              onChange={(e) =>
                                setNewRider({
                                  ...newRider,
                                  email: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="riderPhone">Phone</Label>
                            <Input
                              id="riderPhone"
                              value={newRider.phone}
                              onChange={(e) =>
                                setNewRider({
                                  ...newRider,
                                  phone: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Create Rider Account
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
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
                            <TableHead className="whitespace-nowrap">
                              Total
                            </TableHead>
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
        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
}
