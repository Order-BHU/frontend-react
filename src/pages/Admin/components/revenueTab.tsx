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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageWrapper } from "@/components/pagewrapper";
import { useState } from "react";

const revenueData = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 5000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 1890 },
  { name: "Sat", value: 2390 },
  { name: "Sun", value: 3490 },
];
interface revenueProp {
  userDetails: any;
}
interface transactionType {
  id: number;
  amount: string; // If you plan to do calculations, change this to `number`
  created_at: string; // Consider using `Date` if you plan to manipulate dates
  customer_id: string; // If IDs are numbers, change this to `number`
  reference: string;
  restaurant_id: string; // If IDs are numbers, change this to `number`
  status: string; // Add more possible statuses if needed
  type: string; // Assuming only these two types exist
}
const RevenueTab = ({ userDetails }: revenueProp) => {
  type TimeRange = "day" | "week" | "month" | "year";
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  return (
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
              <div className="overflow-x-auto max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">ID</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Customer ID
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Restaurant ID
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Type</TableHead>
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
  );
};

export default RevenueTab;
