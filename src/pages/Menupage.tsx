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
import { ScrollArea } from "@/components/ui/scroll-area";
//import { Input } from "@/components/ui/input";
import { Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { orbit } from "ldrs";
import { PageWrapper } from "@/components/pagewrapper";
import {
  getMenuItems,
  getCategories,
  addToCart,
  checkout,
  removeCartItem,
  viewCart,
  getLocation,
  myOrders,
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
import { singularCartItem } from "@/interfaces/restaurantType";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { waveform } from "ldrs";
import { makePayment, verifyPayment } from "@/api/payments";
//import PaystackPop from "@paystack/inline-js";

// interface CartItem extends singularCartItem {
//   total: number
// }

export default function RestaurantMenuPage() {
  waveform.register();
  orbit.register();
  const { data: cartItems, refetch } = useQuery({
    queryFn: viewCart,
    queryKey: ["cartItems"],
    refetchOnWindowFocus: false, //because removing items from cart gets annoying since it's stored in the frontend now till i checkout
  });
  const { data: locations, status: locationStatus } = useQuery({
    queryFn: getLocation,
    queryKey: ["locations"],
  });

  const location = useLocation();
  const { id } = useParams<{ id: string }>(); //restaurant id container
  var previousId = location.state?.itemId; //container for the id of item user tried to access before logging in
  //const navigate = useNavigate();
  const [selectedLocation, setLocation] = useState(""); //the location a user selects
  const [displayedMenuItems, setDisplayedMenuItems] = useState<menuItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0); //this is here so we can pass the price during checkout
  const [checkoutItems, setCheckoutItems] = useState<
    {
      menu_id: number;
      quantity: number;
      menu_name: string;
      menu_price: number;
      menu_picture: File | null | string;
    }[]
  >([]); //every time a menu item gets added or removed(hitting the plus button) we'll set the state here so we can pass it to checkout route
  const { status: menuStatus, data: menuItems } = useQuery({
    queryKey: ["menuItems", id],
    queryFn: () => getMenuItems(id!),
  });
  const { data: userOrders, status: userOrderStatus } = useQuery({
    //this'll help check if the user has a pending order before checkout
    queryFn: () => myOrders("pending"),
    queryKey: ["userOrders"],
    enabled: !!selectedLocation,
    refetchOnWindowFocus: false,
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
    //this calculates the total price of cart Items
    const total_price = cartItems?.cart_items?.reduce(
      (sum: number, item: singularCartItem) => sum + Number(item.price),
      0
    );
    setTotalPrice(total_price);

    const transformedItems: {
      menu_id: number;
      quantity: number;
      menu_name: string;
      menu_picture: File | null | string;
      menu_price: number;
    }[] = cartItems?.cart_items.map((item: singularCartItem) => ({
      menu_id: item.menu_id,
      quantity: 1, //we don't store quantity in the backend anymore, so I just default them to 1
      menu_name: item.item_name,
      menu_picture: item.item_picture,
      menu_price: item.price,
    }));
    //so the values only update or show for logged in users
    isLoggedIn && setCheckoutItems(transformedItems); //so that we can get the user's checkout items so they can continue from when they left off in selecting in cart if they refresh the page or something.
  }, [cartItems]);

  useEffect(() => {
    // This function handles a situation where the user tried to add to cart before logging in. It gets the Id of what they tried to add(which was passed all the way to whatever page they're coming from) and adds it to the cart
    if (localStorage.getItem("previousId")) {
      handleAddToCart(
        localStorage.getItem("previousId")!,
        menuItems?.find((item: menuItem) => item.id === previousId)?.price
      );
      localStorage.removeItem("previousId");
      localStorage.removeItem("restaurantId");
    }
  }, []);

  useEffect(() => {
    if (checkoutItems?.some((item) => item.quantity <= 0)) {
      setCheckoutItems((prevItems) =>
        prevItems.filter((item) => item.quantity > 0)
      );
    }
  }, [checkoutItems]);
  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();

  const { mutateAsync: mutate } = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
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

  const { mutate: checkoutMutate /*status: checkoutStatus*/ } = useMutation({
    mutationFn: checkout,
    onSuccess: (data) => {
      localStorage.setItem("orderCode", data.code);
      localStorage.setItem("orderId", data.order?.id); //I didn't really finish this, feel free to change stuff.
      toast({
        title: "Success",
        description: data.message,
      });
      navigate(`/${localStorage.getItem("accountType")}-dashboard/`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: removeItemMutate, status: removeItemStatus } = useMutation({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
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

  const handleAddToCart = async (itemId: string, price: number) => {
    //this function updates the state for cartItems and that updates in the input field. the onError makes it refetch the data since cartItemarray get reset whenever cartitem from the api changes. If the data gets refetched, what failed won't display anymore
    if (!isLoggedIn) {
      //save the id to local storage.
      localStorage.setItem("previousId", itemId);
      localStorage.setItem("restaurantId", String(id)); //gotta pass rest id so we can navigate back to said restaurant
      navigate("/login/");
      return;
    }
    //all this below sets the quantity for chekout items so we can... have the quantity
    setCheckoutItems((prevItems) => {
      const newItems = [
        ...prevItems,
        {
          menu_id: Number(itemId),
          quantity: 1,
          menu_name: menuItems?.find(
            (item: menuItem) => item.id === Number(itemId)
          )?.name,
          menu_picture: menuItems?.find(
            (item: menuItem) => item.id === Number(itemId)
          )?.item_picture,
          menu_price: menuItems?.find(
            (item: menuItem) => item.id === Number(itemId)
          )?.price,
        },
      ];

      return newItems;
    });
    setTotalPrice((prevPrice) => {
      const currentPrice = Number(prevPrice); // Force convert to number. Somewhere along the line, it adds them as strings and i can't find where so i just fell back to this
      const addPrice = Number(price); // Force convert to number
      return currentPrice + addPrice;
    });
    console.log("checkout items", checkoutItems);

    // Move these after the state update
    try {
      await mutate(Number(itemId));
      await refetch(); // Refetch cart data to ensure sync with server
    } catch (error) {
      // Handle error case
      console.error("Failed to update cart:", error);
      refetch(); // Refetch to ensure UI shows correct state
    }
  };

  const { mutate: paymentMutate, status: paymentStatus } = useMutation({
    mutationFn: makePayment,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "redirecting you to payment gateway...",
      });
      window.location.href = data.data.authorization_url;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  //the two variables below will get the transaction id when we get redirected from the paystack page to here
  const [transactionReference, setTransactionReference] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  useEffect(() => {
    //this useEffect sets the reference code for verifying a transaction
    if (queryParams.get("reference")) {
      setTransactionReference(queryParams.get("reference") || "");
    }
  }, []);
  const { data: verifyPaymentData } = useQuery({
    queryFn: () => verifyPayment(transactionReference),
    queryKey: ["paymentDetails"],
    enabled: !!transactionReference,
  });
  const handlePayment = () => {
    //this function will store the location in localStorage, so after payment and redirect, we can checkout with said info
    if (!selectedLocation) {
      toast({
        title: "One more step to go",
        description: "you haven't picked a location yet",
        variant: "destructive",
      });
    } else if (userOrders?.order) {
      toast({
        title: "Oops",
        description:
          "Looks like you already have a pending order right now. Finish that one to place a new order",
        variant: "destructive",
      });
    } else if (checkoutItems.length < 1) {
      toast({
        title: "Oh no",
        description: "you haven't picked anything D:",
        variant: "destructive",
      });
    } else {
      localStorage.setItem("orderLocation", selectedLocation);
      localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
      localStorage.setItem("totalPrice", String(totalPrice));
      paymentMutate({
        email: "victrbl01@gmail.com",
        amount: "100",
        callback_url: `https://bhuorder.netlify.app/menu/${id}`,
      });
    }
  };
  const handleCheckout = () => {
    console.log("rest id: ", id);
    console.log(checkoutItems);
    checkoutMutate({
      items: JSON.parse(localStorage.getItem("checkoutItems")!),
      restaurant_id: Number(id),
      total: Number(localStorage.getItem("totalPrice")),
      location: localStorage.getItem("orderLocation"),
    });
    localStorage.removeItem("orderLocation");
    localStorage.removeItem("totalPrice");
    localStorage.removeItem("checkoutItems");
  };
  useEffect(() => {
    //this function handles checkout after payments have been made
    if (verifyPaymentData) {
      if (verifyPaymentData?.data?.status === "success") {
        navigate(`/menu/${id}`, { replace: true });
        handleCheckout();
        setTransactionReference(""); //so that another reload doesn't trigger verifyPayments to run
      } else if (verifyPaymentData?.data?.status === "failed") {
        toast({
          title: "Error",
          description: verifyPaymentData?.message,
          variant: "destructive",
        });
        setTransactionReference(""); //so that another reload doesn't trigger verifyPayments to run
      }
    }
  }, [verifyPaymentData]);
  const handleSelectLocationChange = (value: string) => {
    setLocation(value);
  };

  const setCartItemQuantity = (
    menu_id: number,
    operator: number,
    price: number
  ) => {
    //this function increases the quantity for cart items
    if (operator === 1) {
      setCheckoutItems((prevItems) =>
        prevItems.map((item) =>
          item.menu_id === menu_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      setTotalPrice((prevItems) => prevItems + Number(price));
    }

    if (operator === -1) {
      setCheckoutItems((prevItems) =>
        prevItems.map((item) =>
          item.menu_id === menu_id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
      setTotalPrice((prevItems) => prevItems - Number(price));
    }

    if (operator === 0) {
      setCheckoutItems((prevItems) =>
        prevItems.map((item) =>
          item.menu_id === menu_id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
      setTotalPrice((prevItems) => prevItems - Number(price));
      //Do all that but also remove from the backend

      removeItemMutate(menu_id);
    }
  };

  const isCheckoutDisabled = //this'll disable the checkout button depending on the situation
    paymentStatus !== "pending"
      ? "Checkout"
      : removeItemStatus !== "pending"
      ? "Checkout"
      : userOrderStatus !== "pending"
      ? "Checkout"
      : "Checking...";

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
                <span className="hidden sm:inline">View Cart</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:text-cfont-dark">
              <DialogHeader>
                <DialogTitle>My Cart</DialogTitle>
              </DialogHeader>
              <div>
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
                  <ScrollArea className="h-[300px] pr-4">
                    {checkoutItems?.map((item) => (
                      <div
                        key={item.menu_id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center">
                          <Img
                            className="rounded-md mr-2 max-w-[35%] h-auto"
                            src={String(item.menu_picture!)}
                            alt={item.menu_name}
                            unloader={
                              <div className="flex justify-center p-5 max-h-[40%] items-center">
                                <l-orbit
                                  size="35"
                                  speed="1.5"
                                  color="#6C757D"
                                ></l-orbit>
                              </div>
                            }
                          />
                          <div>
                            <p className="font-medium">{item.menu_name}</p>
                            <p className="text-sm text-gray-500">
                              {item.menu_price}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              checkoutItems.find(
                                (citem) => item.menu_id === citem.menu_id
                              )?.quantity === 1
                                ? setCartItemQuantity(
                                    item.menu_id,
                                    0,
                                    item.menu_price
                                  )
                                : setCartItemQuantity(
                                    item.menu_id,
                                    -1,
                                    item.menu_price
                                  );
                            }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setCartItemQuantity(
                                item.menu_id,
                                1,
                                item.menu_price
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  <div className="mb-4 ml-4 flex flex-col justify-between items-left">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">
                      ₦{totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </Card>
              </div>
              <DialogFooter>
                <Select onValueChange={handleSelectLocationChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {locationStatus === "pending" ? (
                        <SelectLabel>getting locations...</SelectLabel>
                      ) : (
                        locations?.locations.map(
                          (location: { id: number; name: string }) => (
                            <SelectItem key={location.id} value={location.name}>
                              {location.name}
                            </SelectItem>
                          )
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handlePayment}
                  disabled={isCheckoutDisabled === "Checking..."}
                >
                  {isCheckoutDisabled}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageWrapper>

      <main className="flex-grow container mx-auto px-4 py-8">
        {menuStatus === "pending" ? (
          <div className="flex flex-col justify-center items-center">
            <l-waveform
              size="35"
              stroke="3.5"
              speed="1"
              color="white"
            ></l-waveform>
            <h3 className="text-l font-bold mb-8 text-center text-gray-800 dark:text-cfont-dark m-8">
              Getting Meals
            </h3>
          </div>
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
                      <div className="relative h-48 w-full mb-2">
                        {
                          <Img
                            className="w-full h-full object-cover"
                            src={String(item.image!)}
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
                            className="disabled:opacity-100 cursor-pointer disabled:pointer-events-none flex items-center gap-2"
                            disabled={checkoutItems?.some(
                              (cItem) => cItem.menu_id === item.id
                            )}
                            onClick={() =>
                              handleAddToCart(String(item.id), item.price)
                            }
                          >
                            {checkoutItems?.some(
                              (cItem) => cItem.menu_id === item.id
                            ) ? (
                              <>
                                Added{" "}
                                <Check
                                  className={`w-4 h-4 text-cfont-dark dark:text-gray-800`}
                                />
                              </>
                            ) : (
                              "Add to cart"
                            )}
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
