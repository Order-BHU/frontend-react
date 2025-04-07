import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  ShoppingBag,
  Bell,
  User,
  Clock,
  LogOut,
  ChevronRight,
  MapPin,
  CreditCard,
  Star,
  Calendar,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function UserDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Customer Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back! Manage your orders and account settings
              </p>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Profile Card */}
            <Card className="card-hover-effect md:col-span-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent h-40" />
              <CardHeader className="flex flex-row items-center justify-between relative z-10">
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                    <AvatarFallback className="bg-orange-100 text-orange-600">
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      John Smith
                    </h2>
                    <p className="text-sm text-gray-500">
                      john.smith@example.com
                    </p>
                    <p className="text-sm text-gray-500">(123) 456-7890</p>
                    <div className="flex items-center mt-2"></div>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span>123 Main Street, Apt 4B, New York, NY 10001</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Frequently used actions and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-between rounded-xl bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200">
                  <span className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl border-gray-200 bg-white shadow-sm"
                >
                  <span className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Transactions
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl border-gray-200 bg-white shadow-sm"
                >
                  <span className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Orders Section */}
          <div className="mt-8">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full max-w-sm grid-cols-2 rounded-xl bg-slate-100">
                <TabsTrigger
                  value="active"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Active Orders
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Order History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <Card className="gradient-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">
                      Active Orders
                    </CardTitle>
                    <CardDescription>
                      Track your current orders in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-orange-50 p-4 border border-orange-100">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-500">
                              Order #BHU-12345
                            </span>
                            <span className="ml-3 rounded-full bg-orange-200 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                              In Progress
                            </span>
                          </div>
                          <h3 className="mt-1 text-lg font-medium text-gray-900">
                            Deluxe Burger Combo
                          </h3>
                          <p className="text-sm text-gray-600">
                            Burger King - Est. delivery in 25-30 mins
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <Button
                            variant="default"
                            className="rounded-xl bg-orange-500 hover:bg-orange-600"
                          >
                            Track Order
                          </Button>
                          <span className="mt-2 font-medium text-gray-900">
                            $23.50
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            Order Progress
                          </span>
                          <span className="text-sm font-medium text-orange-600">
                            40%
                          </span>
                        </div>
                        <Progress value={40} className="h-2" />

                        <div className="flex w-full justify-between text-xs text-gray-600 mt-2">
                          <span className="flex flex-col items-center">
                            <span className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px]">
                              ✓
                            </span>
                            <span className="mt-1">Placed</span>
                          </span>
                          <span className="flex flex-col items-center">
                            <span className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center text-white relative text-[10px]">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                              ✓
                            </span>
                            <span className="mt-1">Preparing</span>
                          </span>
                          <span className="flex flex-col items-center">
                            <span className="h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-[10px]">
                              3
                            </span>
                            <span className="mt-1">On the way</span>
                          </span>
                          <span className="flex flex-col items-center">
                            <span className="h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-[10px]">
                              4
                            </span>
                            <span className="mt-1">Delivered</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">
                      Order History
                    </CardTitle>
                    <CardDescription>
                      View your past orders and reorder your favorites
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Past order item */}
                      <div className="rounded-lg border border-gray-200 p-4 transition-all hover:bg-gray-50 hover:border-orange-200">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-500">
                                Order #BHU-12344
                              </span>
                              <span className="ml-3 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                Delivered
                              </span>
                            </div>
                            <h3 className="mt-1 text-lg font-medium text-gray-900">
                              Pasta Primavera
                            </h3>
                            <p className="text-sm text-gray-600">
                              Olive Garden - Delivered May 10, 2023
                            </p>
                          </div>
                          <div className="flex flex-col sm:items-end mt-3 sm:mt-0">
                            <span className="font-medium text-gray-900">
                              $18.99
                            </span>
                            <div className="flex items-center mt-2">
                              <StarRating rating={5} size="small" />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 rounded-xl text-orange-600 border-orange-200"
                            >
                              Reorder
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Past order item */}
                      <div className="rounded-lg border border-gray-200 p-4 transition-all hover:bg-gray-50 hover:border-orange-200">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-500">
                                Order #BHU-12343
                              </span>
                              <span className="ml-3 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                Delivered
                              </span>
                            </div>
                            <h3 className="mt-1 text-lg font-medium text-gray-900">
                              Veggie Pizza Combo
                            </h3>
                            <p className="text-sm text-gray-600">
                              Pizza Hut - Delivered May 3, 2023
                            </p>
                          </div>
                          <div className="flex flex-col sm:items-end mt-3 sm:mt-0">
                            <span className="font-medium text-gray-900">
                              $24.50
                            </span>
                            <div className="flex items-center mt-2">
                              <StarRating rating={4} size="small" />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 rounded-xl text-orange-600 border-orange-200"
                            >
                              Reorder
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

// StarRating component for displaying ratings
function StarRating({ rating = 0, size = "default" }) {
  const filledStars = Math.floor(rating);
  const partialStar = rating % 1 !== 0;
  const emptyStars = 5 - filledStars - (partialStar ? 1 : 0);

  const starSize = size === "small" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div className="flex items-center">
      {Array.from({ length: filledStars }).map((_, i) => (
        <Star
          key={`star-filled-${i}-${rating}`}
          className={`${starSize} text-yellow-400 fill-yellow-400`}
        />
      ))}

      {partialStar && (
        <div className="relative">
          <Star className={`${starSize} text-yellow-400 fill-yellow-400`} />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${(rating % 1) * 100}%` }}
          >
            <Star className={`${starSize} text-yellow-400 fill-yellow-400`} />
          </div>
        </div>
      )}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`star-empty-${i}-${rating}`}
          className={`${starSize} text-yellow-400`}
        />
      ))}

      {size !== "small" && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
