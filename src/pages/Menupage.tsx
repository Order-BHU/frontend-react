import { useState, useEffect } from "react";
import { Img } from "react-image";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { orbit } from "ldrs";
import { PageWrapper } from "@/components/pagewrapper";
import {
  getMenuItems,
  getCategories,
  addToCart,
  //removeCartItem,
} from "@/api/restaurant";
import { useMutation, useQuery } from "@tanstack/react-query";
import { category, tempapiMenu, menuItem } from "@/interfaces/restaurantType";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/stores/useAuthStore";

// Mock database of restaurant menus
/*const restaurantMenus = {
  "1": {
    name: "Burger Palace",
    items: [
      {
        id: "1",
        name: "Classic Burger",
        description: "Beef patty with lettuce, tomato, and cheese",
        price: 2500,
        category: "Main Dish",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "2",
        name: "Chicken Wings",
        description: "Spicy chicken wings with blue cheese dip",
        price: 1800,
        category: "Snacks",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "3",
        name: "Caesar Salad",
        description: "Romaine lettuce with Caesar dressing and croutons",
        price: 1500,
        category: "Main Dish",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "4",
        name: "Fries",
        description: "Crispy golden fries",
        price: 800,
        category: "Snacks",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "5",
        name: "Chocolate Milkshake",
        description: "Rich and creamy chocolate milkshake",
        price: 1200,
        category: "Drinks",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "6",
        name: "Grilled Chicken Breast",
        description: "Seasoned and grilled chicken breast",
        price: 2200,
        category: "Protein",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "7",
        name: "Veggie Burger",
        description: "Plant-based patty with fresh vegetables",
        price: 2300,
        category: "Main Dish",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "8",
        name: "Onion Rings",
        description: "Crispy battered onion rings",
        price: 1000,
        category: "Snacks",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "9",
        name: "Lemonade",
        description: "Freshly squeezed lemonade",
        price: 800,
        category: "Drinks",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "10",
        name: "Grilled Salmon",
        description: "Seasoned grilled salmon fillet",
        price: 3500,
        category: "Protein",
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
        price: 3500,
        category: "Main Dish",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "2",
        name: "Pepperoni Pizza",
        description: "Pizza topped with pepperoni and cheese",
        price: 4000,
        category: "Main Dish",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "3",
        name: "Garlic Bread",
        description: "Toasted bread with garlic butter",
        price: 1000,
        category: "Snacks",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "4",
        name: "Greek Salad",
        description: "Fresh salad with feta cheese and olives",
        price: 1800,
        category: "Main Dish",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "5",
        name: "Tiramisu",
        description: "Classic Italian coffee-flavored dessert",
        price: 1500,
        category: "Snacks",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "6",
        name: "Chicken Wings",
        description: "Spicy chicken wings with blue cheese dip",
        price: 2200,
        category: "Protein",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "7",
        name: "Soda",
        description: "Assorted soft drinks",
        price: 600,
        category: "Drinks",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "8",
        name: "Iced Tea",
        description: "Freshly brewed iced tea",
        price: 700,
        category: "Drinks",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "9",
        name: "Meatballs",
        description: "Italian-style meatballs in tomato sauce",
        price: 2500,
        category: "Protein",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "10",
        name: "Caprese Salad",
        description: "Fresh mozzarella, tomatoes, and basil",
        price: 2000,
        category: "Main Dish",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
  },
};*/

export default function RestaurantMenuPage() {
  orbit.register();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const previousId = location.state?.itemId;
  //const navigate = useNavigate();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [totalItems, setTotalItems] = useState(0);
  //const [totalPrice, setTotalPrice] = useState(0);

  const [displayedMenuItems, setDisplayedMenuItems] = useState<menuItem[]>([]);
  const { status: menuStatus, data: menuItems } = useQuery({
    queryKey: ["menuItems", id],
    queryFn: () => getMenuItems(id!),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  /*const allMenus = menuItems?.reduce((acc: menuItem[], category: tempapiMenu) => {
    return [...acc, ...category.menus];
  }, []);*/
  const navigate = useNavigate();
  useEffect(() => {
    if (menuItems && categories) {
      // Flatten all menus from all categories into a single array
      const allMenus = menuItems.reduce(
        (acc: menuItem[], category: tempapiMenu) => {
          return [...acc, ...category.menus];
        },
        []
      );

      allMenus.map((menu: menuItem) => {
        const visible: any = {};
        visible[menu.category] = true;
      });

      // Process each menu item with its category
      const processedItems = allMenus.map((menu: menuItem) => {
        const menuCategory = menuItems.find(
          (category: category) => category.id === Number(menu.category_id)
        );
        return {
          ...menu,
          category: menuCategory?.name || "Uncategorized",
        } as menuItem;
      });

      setDisplayedMenuItems(processedItems);
    }
  }, [menuItems, categories]);

  useEffect(() => {
    const items = Object.values(quantities).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
    setTotalItems(items);
  }, [quantities]);

  useEffect(() => {
    if (previousId) {
      handleAddToCart(previousId, 1);
    }
  }, []);

  /*useEffect(() => {
    const items = Object.values(quantities).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
    setTotalItems(items);

    const price = allMenus.reduce((sum: number, item: menuItem) => {
      return sum + (quantities[item.id] || 0) * item.price;
    }, 0);
    setTotalPrice(price);
  }, [quantities, allMenus]);*/

  /*if (!menu) {
    navigate("/404", { replace: true });
    return null;
  }*/

  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();
  // const { status: removeCartStatus, mutate: removeCartMutate } = useMutation({
  //   mutationFn: removeCartItem,
  //   onError: (error) => {
  //     toast({
  //       title: "Error",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   },
  // });
  const { status: cartStatus, mutate } = useMutation({
    mutationFn: addToCart,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const handleAddToCart = (itemId: string, change: number) => {
    if (!isLoggedIn) {
      navigate("/login/", { state: { itemId, id } });
    }
    if (cartStatus === "success") {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: Math.max(0, (prev[itemId] || 0) + change),
      }));
    }
    mutate(Number(itemId));
  };

  /*const groupedItems = menu.items?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [key: string]: typeof menu.items });*/

  //const categoryOrder = ["Main Dish", "Protein", "Snacks", "Drinks"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <Header />

      <PageWrapper className="sticky top-[4rem] z-10 bg-white shadow-md p-4 dark:bg-cbg-darkaccent">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-cfont-dark">
            {/*allMenus.name*/} Menu
          </h1>
          <Button
            onClick={() => navigate("/cart/")}
            className="w-32 sm:w-48 text-xs md:text-md overflow"
          >
            <ShoppingCart className="mr-2 h-4 w-4 text-md hidden sm:inline " />{" "}
            <span className="hidden sm:inline">View Cart</span>({totalItems} )
            {/*items - ₦{totalPrice.toLocaleString()})*/}
          </Button>
        </div>
      </PageWrapper>

      <main className="flex-grow container mx-auto px-4 py-8">
        {menuStatus === "pending" ? (
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-cfont-dark">
            Getting Meals...
          </h2>
        ) : (
          categories?.map((category: category) => (
            /*groupedItems[category] && */ <PageWrapper
              key={category.id}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-cfont-dark">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedMenuItems.map((item: menuItem) =>
                  Number(item.category_id) === Number(category.id) ? (
                    <Card key={item.id} className="flex flex-col">
                      <div className="relative h-48 w-full">
                        {
                          <Img
                            className="object-cover"
                            src={`http://bhuorder.com.ng/api/${String(
                              item.image!
                            )}`}
                            alt={item.name}
                            unloader={
                              <div className="flex justify-center p-5 h-[200px] items-center">
                                <l-orbit
                                  size="35"
                                  speed="1.5"
                                  color="#6C757D"
                                ></l-orbit>
                              </div>
                            }
                          />
                        }
                      </div>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span className="text-lg">{item.name}</span>
                          <Badge>{item.category}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        <p className="font-semibold">
                          ₦{Number(item.price).toLocaleString()}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleAddToCart(String(item.id), -1)}
                            disabled={
                              !quantities[item.id] || cartStatus === "pending"
                            }
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
                            disabled={cartStatus === "pending"}
                            onClick={() => handleAddToCart(String(item.id), 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ) : (
                    <></>
                  )
                )}
              </div>
            </PageWrapper>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
}
