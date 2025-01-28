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
  removeCartItem,
  checkout,
} from "@/api/restaurant";
import { useMutation, useQuery } from "@tanstack/react-query";
import { category, tempapiMenu, menuItem } from "@/interfaces/restaurantType";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/stores/useAuthStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { viewCart } from "@/api/restaurant";
import { singularCartItem } from "@/interfaces/restaurantType";

interface CartItem extends singularCartItem {
  menuID: string;
  restaurantID: string;
}

export default function RestaurantMenuPage() {
  orbit.register();
  const { data: cartItems, refetch } = useQuery({
    queryFn: viewCart,
    queryKey: ["cartItems"],
  });
  const location = useLocation();
  const { id } = useParams<{ id: string }>(); //restaurant id container
  var previousId = location.state?.itemId; //container for the id of item user tried to access before logging in
  //const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [displayedMenuItems, setDisplayedMenuItems] = useState<menuItem[]>([]);
  const [cartItemArray, setCartItems] = useState<CartItem[]>([]); // this state is for the cartItems so we don't manipulate them directly. We'll use it to update quantity and whatnot
  const [totalPrice, setTotalPrice] = useState(0); //this is here so we can pass the price during checkout
  const [checkoutItems, setCheckoutItems] = useState<
    { menu_id: number; quantity: number }[]
  >([]); //every time a menu item gets added or removed(hitting the plus button) we'll set the state here so we can pass it to checkout route
  const { status: menuStatus, data: menuItems } = useQuery({
    queryKey: ["menuItems", id],
    queryFn: () => getMenuItems(id!),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const navigate = useNavigate();
  useEffect(() => {
    console.log(totalPrice);
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
    //This function will set the total items for the cart. It's just for viewing purposes so the cart icon also has the total number of items next to it
    const items = cartItems?.cart_items.reduce(
      (acc: number, quantity: singularCartItem) =>
        acc + Number(quantity.quantity),
      0
    );
    setTotalItems(items);
    //function below makes it so we don't have to touch cart Items and gives them menu and restaurant IDs so we can pass those to checkout
    const modifiedItems = cartItems?.cart_items.map(
      (item: singularCartItem) => ({
        ...item,
        menuID: 0,
        restaurantID: 0,
      })
    );
    const transformedItems: { menu_id: number; quantity: number }[] =
      cartItems?.cart_items.map((item: singularCartItem) => ({
        menu_id: item.menu_id,
        quantity: Number(item.quantity),
      }));

    setCartItems(modifiedItems);
    setCheckoutItems(transformedItems); //so that we can get the user's checkout items so they can continue from when they left off in selecting in cart if they refresh the page or something.
  }, [cartItems]);

  useEffect(() => {
    // This function handles a situation where the user tried to add to cart before logging in. It gets the Id of what they tried to add(which was passed all the way to whatever page they're coming from) and adds it to the cart
    if (previousId) {
      handleAddToCart(
        previousId,
        menuItems?.find((item: menuItem) => item.id === previousId)
      );
      previousId = undefined; //adding this so the code doesn't add previous id every time we refresh the page
    }
  }, []);

  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();
  const { mutate: removeCartMutate } = useMutation({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const { mutate } = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: checkoutMutate, status: checkoutStatus } = useMutation({
    mutationFn: checkout,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      navigate("/user-dashboard/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (itemId: string, price: number) => {
    console.log("prices: ", totalPrice);
    if (!isLoggedIn) {
      navigate("/login/", { state: { itemId, id } });
      return;
    }
    //all this below sets the quantity for chekout items so we can... have the quantity

    setCheckoutItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.menu_id === Number(itemId)
      );

      const newItems =
        existingItemIndex !== -1
          ? prevItems.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevItems, { menu_id: Number(itemId), quantity: 1 }];

      return newItems;
    });
    setTotalPrice((prevPrice) => {
      const currentPrice = Number(prevPrice); // Force convert to number. Somewhere along the line, it adds them as strings and i can't find where so i just fell back to this
      const addPrice = Number(price); // Force convert to number
      return currentPrice + addPrice;
    });
    console.log("checkout items", checkoutItems);

    // Move these after the state update
    Promise.resolve().then(() => {
      mutate(Number(itemId));
      refetch();
    });
  };
  const handleremoveCartItem = (itemId: string, price: number) => {
    if (!isLoggedIn) {
      return;
    }

    setCheckoutItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.menu_id === Number(itemId)
      );

      if (
        existingItemIndex !== -1 &&
        prevItems[existingItemIndex].quantity > 0
      ) {
        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevItems;
    });
    setTotalPrice((prevPrice) => prevPrice - price);

    removeCartMutate(Number(itemId));
    refetch();
  };
  const handleCheckout = (id: number) => {
    checkoutMutate({
      items: checkoutItems,
      restaurant_id: id,
      total: totalPrice,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-cbg-dark">
      <Header />

      <PageWrapper className="sticky top-[4rem] z-10 bg-white shadow-md p-4 dark:bg-cbg-darkaccent">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-cfont-dark">
            {/*allMenus.name*/} Menu
          </h1>
          <Dialog>
            <DialogTrigger>
              <Button className="w-32 sm:w-48 text-xs md:text-md overflow">
                <ShoppingCart className="mr-2 h-4 w-4 text-md hidden sm:inline " />{" "}
                <span className="hidden sm:inline">View Cart</span>({totalItems}
                ){/*items - ₦{totalPrice.toLocaleString()})*/}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:text-cfont-dark">
              <DialogHeader>
                <DialogTitle>My Cart</DialogTitle>
              </DialogHeader>
              <div>
                <PageWrapper>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Cart Items</span>
                        {/* {Number(item.quantity) > 1 ? (
                          <Badge variant="default">{item.quantity}</Badge>
                        ) : (
                          <></>
                        )} */}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul>
                        {cartItemArray?.map((item: CartItem) => (
                          <li
                            className="text-sm text-gray-500 mb-2"
                            key={item.item_picture}
                          >
                            {item.item_name} ({`x${item.quantity}`})
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </PageWrapper>
              </div>
              <DialogFooter>
                <Button
                  disabled={checkoutStatus === "pending"}
                  onClick={() => handleCheckout(Number(id))}
                >
                  CheckOut
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                            onClick={() =>
                              handleremoveCartItem(String(item.id), item.price)
                            }
                            disabled={
                              //I know I'm not using the state here, but crunch mode. Can't be bothered to fix the error I'm getting when i try to change it right now
                              Number(
                                checkoutItems?.find(
                                  (cItem: {
                                    menu_id: number;
                                    quantity: number;
                                  }) => cItem.menu_id === item.id
                                )?.quantity
                              ) < 1
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={
                              cartItemArray?.find(
                                (cartitem: CartItem) =>
                                  cartitem.item_name === item.name
                              )?.quantity || 0
                            }
                            onChange={(e) => e.preventDefault()}
                            className="w-16 text-center"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              handleAddToCart(String(item.id), item.price)
                            }
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
