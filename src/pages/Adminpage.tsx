"use client";

import { useState } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageWrapper } from "@/components/pagewrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data
const restaurantOrders = [
  {
    id: "1",
    name: "Burger Palace",
    totalOrders: 150,
    completedOrders: 145,
    revenue: 450000,
  },
  {
    id: "2",
    name: "Pizza Heaven",
    totalOrders: 200,
    completedOrders: 198,
    revenue: 600000,
  },
  {
    id: "3",
    name: "Sushi Sensation",
    totalOrders: 100,
    completedOrders: 97,
    revenue: 350000,
  },
];

const driverOrders = [
  { id: "1", name: "John Doe", totalOrders: 50, completedOrders: 48 },
  { id: "2", name: "Jane Smith", totalOrders: 75, completedOrders: 73 },
  { id: "3", name: "Mike Johnson", totalOrders: 60, completedOrders: 59 },
];

const revenueData = [
  { name: "Mon", daily: 5000, weekly: 35000, monthly: 150000, yearly: 1800000 },
  { name: "Tue", daily: 5500, weekly: 38000, monthly: 155000, yearly: 1850000 },
  { name: "Wed", daily: 6000, weekly: 40000, monthly: 160000, yearly: 1900000 },
  { name: "Thu", daily: 5800, weekly: 39000, monthly: 158000, yearly: 1880000 },
  { name: "Fri", daily: 6500, weekly: 42000, monthly: 165000, yearly: 1950000 },
  { name: "Sat", daily: 7000, weekly: 45000, monthly: 170000, yearly: 2000000 },
  { name: "Sun", daily: 6800, weekly: 44000, monthly: 168000, yearly: 1980000 },
];

export default function AdminDashboardPage() {
  const [revenueTimeframe, setRevenueTimeframe] = useState("daily");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <PageWrapper>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Admin Dashboard
          </h1>
        </PageWrapper>

        <Tabs defaultValue="restaurants" className="space-y-4">
          <PageWrapper>
            <TabsList>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
          </PageWrapper>

          <TabsContent value="restaurants">
            <PageWrapper>
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">
                    Restaurant Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Restaurant Name</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Completed Orders</TableHead>
                        <TableHead>Completion Rate</TableHead>
                        <TableHead>Revenue (₦)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {restaurantOrders.map((restaurant) => (
                        <TableRow key={restaurant.id}>
                          <TableCell>{restaurant.name}</TableCell>
                          <TableCell>{restaurant.totalOrders}</TableCell>
                          <TableCell>{restaurant.completedOrders}</TableCell>
                          <TableCell>
                            {(
                              (restaurant.completedOrders /
                                restaurant.totalOrders) *
                              100
                            ).toFixed(2)}
                            %
                          </TableCell>
                          <TableCell>
                            {restaurant.revenue.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </PageWrapper>

            <PageWrapper>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-md">
                    Restaurant Revenue Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={restaurantOrders}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill={
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "hsl(30 90% 60%)"
                            : "hsl(24 9.8% 10%)"
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </PageWrapper>
          </TabsContent>

          <TabsContent value="drivers">
            <PageWrapper>
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Driver Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Driver Name</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Completed Orders</TableHead>
                        <TableHead>Completion Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {driverOrders.map((driver) => (
                        <TableRow key={driver.id}>
                          <TableCell>{driver.name}</TableCell>
                          <TableCell>{driver.totalOrders}</TableCell>
                          <TableCell>{driver.completedOrders}</TableCell>
                          <TableCell>
                            {(
                              (driver.completedOrders / driver.totalOrders) *
                              100
                            ).toFixed(2)}
                            %
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </PageWrapper>

            <PageWrapper>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-md">
                    Driver Order Completion Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={driverOrders}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="totalOrders"
                        fill={
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "hsl(30 90% 60%)"
                            : "hsl(24 9.8% 10%)"
                        }
                      />
                      <Bar
                        dataKey="completedOrders"
                        fill={
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "hsl(10 70% 30%)"
                            : "hsl(24 9.8% 30%)"
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </PageWrapper>
          </TabsContent>

          <TabsContent value="revenue">
            <PageWrapper>
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-md">
                    <span>App Revenue</span>
                    <Select
                      value={revenueTimeframe}
                      onValueChange={setRevenueTimeframe}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={revenueTimeframe}
                        stroke="hsl(30 90% 60%)"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </PageWrapper>

            <PageWrapper>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-md">Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timeframe</TableHead>
                        <TableHead>Revenue (₦)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Today</TableCell>
                        <TableCell>
                          {revenueData[
                            revenueData.length - 1
                          ].daily.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>This Week</TableCell>
                        <TableCell>
                          {revenueData[
                            revenueData.length - 1
                          ].weekly.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>This Month</TableCell>
                        <TableCell>
                          {revenueData[
                            revenueData.length - 1
                          ].monthly.toLocaleString()}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>This Year</TableCell>
                        <TableCell>
                          {revenueData[
                            revenueData.length - 1
                          ].yearly.toLocaleString()}
                        </TableCell>
                      </TableRow>
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
