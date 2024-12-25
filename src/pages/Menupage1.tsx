import { useState, useEffect } from "react";
import { Img } from "react-image";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { orbit } from "ldrs";
import { PageWrapper } from "@/components/pagewrapper";

// Mock database of restaurant menus
const restaurantMenus = {
  "1": {
    name: "Burger Palace",
    items: [
      {
        id: "1",
        name: "Classic Burger",
        description: "Beef patty with lettuce, tomato, and cheese",
        price: "₦2,500",
        category: "Main",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "2",
        name: "Chicken Wings",
        description: "Spicy chicken wings with blue cheese dip",
        price: "₦1,800",
        category: "Appetizer",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "3",
        name: "Caesar Salad",
        description: "Romaine lettuce with Caesar dressing and croutons",
        price: "₦1,500",
        category: "Salad",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "4",
        name: "Fries",
        description: "Crispy golden fries",
        price: "₦800",
        category: "Side",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "5",
        name: "Chocolate Milkshake",
        description: "Rich and creamy chocolate milkshake",
        price: "₦1,200",
        category: "Drink",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
  },
  "2": {
    name: "Pizza Heaven",
    items: [
      {
        id: "1",
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
        price: "₦3,500",
        category: "Pizza",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "2",
        name: "Pepperoni Pizza",
        description: "Pizza topped with pepperoni and cheese",
        price: "₦4,000",
        category: "Pizza",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "3",
        name: "Garlic Bread",
        description: "Toasted bread with garlic butter",
        price: "₦1,000",
        category: "Side",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "4",
        name: "Greek Salad",
        description: "Fresh salad with feta cheese and olives",
        price: "₦1,800",
        category: "Salad",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "5",
        name: "Tiramisu",
        description: "Classic Italian coffee-flavored dessert",
        price: "₦1,500",
        category: "Dessert",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
  },
  // Add more restaurant menus as needed
};

export default function RestaurantMenuPage() {
  orbit.register();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const menu = restaurantMenus[id as keyof typeof restaurantMenus];
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const total = Object.entries(quantities).reduce(
      (sum, [itemId, quantity]) => {
        const item = menu.items.find((i) => i.id === itemId);
        return (
          sum + (item ? parseInt(item.price.replace("₦", "")) * quantity : 0)
        );
      },
      0
    );
    setCartTotal(total);
  }, [quantities, menu.items]);

  if (!menu) {
    navigate("/404", { replace: true });
    return null;
  }

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change),
    }));
  };

  /* const handleAddToCart = (item: any) => {
    //to be used with button that i commented out for now. Might be removed totally
    const quantity = quantities[item.id] || 0;
    if (quantity > 0) {
      // In a real app, this would add the item to the cart in your state management solution
      console.log(`Added to cart: ${quantity} x ${item.name}`);
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${item.name} added to your cart.`,
      });
      // Reset quantity after adding to cart
      setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };*/
  const handleCheckout = () => {
    // In a real app, this would initiate the checkout process
    console.log("Proceeding to checkout");
    toast({
      title: "Checkout Initiated",
      description: `Total amount: ₦${cartTotal.toLocaleString()}`,
    });
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <PageWrapper>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            {menu.name} Menu
          </h1>
        </PageWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menu.items.map((item) => (
            <PageWrapper key={item.id}>
              <Card className="overflow-hidden max-h-[30rem] h-[30rem]">
                <div className="relative max-h-48 h-48 w-full">
                  <Img
                    className="object-cover"
                    src={item.image}
                    alt={item.name}
                    unloader={
                      <div className="flex justify-center p-5 h-[200px] items-center">
                        <l-orbit size="35" speed="1.5" color="black"></l-orbit>
                      </div>
                    }
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <Badge>{item.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.description}
                  </p>
                  <p className="font-semibold">{item.price}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={!quantities[item.id]}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantities[item.id] || 0}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [item.id]: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-16 text-center"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {/*<Button
                  onClick={() => handleAddToCart(item)}
                  disabled={!quantities[item.id]}
                >
                  Add to Cart
                </Button>*/}
                </CardFooter>
              </Card>
            </PageWrapper>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center">
          <p className="text-xl font-semibold">
            Total: ₦{cartTotal.toLocaleString()}
          </p>
          <Button size="lg" onClick={handleCheckout} disabled={cartTotal === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Checkout
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
