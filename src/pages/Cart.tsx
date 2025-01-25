import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWrapper } from "@/components/pagewrapper";
import { viewCart, getRestaurants } from "@/api/restaurant";
import { useQuery } from "@tanstack/react-query";
import { cartItem, singularCartItem } from "@/interfaces/restaurantType";
import { useState, useEffect } from "react";
// This would typically come from an API or database
const items = [
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
interface restaurant {
  id: number;
  name: string;
  cover: string;
}

interface displayedOrder {
  items: singularCartItem[];
  restaurant_id: number;
  total: number;
  restaurantName: string;
}

export default function CartPage() {
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const { data: cartItems, status } = useQuery({
    queryFn: viewCart,
    queryKey: ["cartItems"],
  });

  const { data: restaurants, status: restaurantStatus } = useQuery({
    queryFn: getRestaurants,
    queryKey: ["restaurants"],
  });

  useEffect(() => {
    const cartItemsWithNames = cartItems?.items?.map((item: cartItem) => {
      const restname = restaurants.find(
        (rest: restaurant) => rest.id === Number(item.restaurant_id)
      );
      return {
        ...item,
        restaurantName: restname?.name || "Uncategorized",
      };
    });
    setDisplayedOrders(cartItemsWithNames);
    console.log("le orders: ", displayedOrders);
  }, [cartItems]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-cfont-dark">
          My Orders
        </h1>
        <div className="space-y-4">
          {status === "pending" ? (
            <h3>Loading...</h3>
          ) : (
            <div>
              {displayedOrders?.map((order: displayedOrder) => (
                <PageWrapper key={order.restaurant_id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>{order.restaurantName}</span>
                        {/* <Badge
                      variant={
                        item.status === "Delivered" ? "secondary" : "default"
                      }
                    >
                      {item.status}
                    </Badge> */}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-2">
                        item ID: {order.restaurant_id}
                      </p>
                      {/* <p className="text-sm text-gray-500 mb-2">
                    Date: {item.date}
                  </p> */}
                      <ul className="list-disc list-inside mb-2">
                        {order.items.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-700 dark:text-cfont-dark"
                          >
                            {/* {item} */}
                          </li>
                        ))}
                      </ul>
                      <p className="font-semibold text-right">
                        Total: {order.total}
                      </p>
                    </CardContent>
                  </Card>
                </PageWrapper>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
