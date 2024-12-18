import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// This would typically come from an API or database
const orders = [
  {
    id: "1",
    restaurant: "Burger Palace",
    items: ["Cheeseburger", "Fries", "Coke"],
    total: "$15.99",
    status: "Delivered",
    date: "2023-05-15",
  },
  {
    id: "2",
    restaurant: "Pizza Heaven",
    items: ["Pepperoni Pizza", "Garlic Bread"],
    total: "$22.50",
    status: "In Transit",
    date: "2023-05-14",
  },
  {
    id: "3",
    restaurant: "Sushi Sensation",
    items: ["California Roll", "Miso Soup", "Green Tea"],
    total: "$28.75",
    status: "Preparing",
    date: "2023-05-13",
  },
];

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{order.restaurant}</span>
                  <Badge
                    variant={
                      order.status === "Delivered" ? "secondary" : "default"
                    }
                  >
                    {order.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  Order ID: {order.id}
                </p>
                <p className="text-sm text-gray-500 mb-2">Date: {order.date}</p>
                <ul className="list-disc list-inside mb-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-semibold text-right">Total: {order.total}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
