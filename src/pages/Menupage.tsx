import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  FiClock,
  FiMapPin,
  FiStar,
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiChevronRight,
} from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getMenuItems,
  getCategories,
  addToCart,
  checkout,
  removeCartItem,
  viewCart,
  getLocation,
  myOrders,
  initializeCheckout,
} from "@/api/restaurant";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  category,
  tempapiMenu,
  menuItem,
  menu,
  singularCartItem,
} from "@/interfaces/restaurantType";
import useAuthStore from "@/stores/useAuthStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Item } from "@radix-ui/react-select";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 },
  }),
};

// Fake restaurant data (in a real app, this would come from an API)

// Cart item type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: File | null | string;
}

const RestaurantMenuPage = () => {
  const [selectedLocation, setLocation] = useState(""); //the location a user selects

  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const deliveryFee = 250; //this is the delivery fee variable
  const { data: cartItems, refetch } = useQuery({
    queryFn: viewCart,
    queryKey: ["cartItems"],
    refetchOnWindowFocus: false, //because removing items from cart gets annoying since it's stored in the frontend now till i checkout
  });
  const { data: locations, status: locationStatus } = useQuery({
    queryFn: getLocation,
    queryKey: ["locations"],
  });
  const { status: menuStatus, data: menuItems } = useQuery({
    queryKey: ["menuItems", id],
    queryFn: () => getMenuItems(id!),
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const { mutateAsync: mutate } = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      console.log(data.message);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
  const { mutateAsync: removeItemMutate } = useMutation({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
      console.log(data.message);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  useEffect(() => {
    cartItems &&
      setCart(
        cartItems.map((item: singularCartItem) => ({
          id: item.menu_id.toString(), // Convert `menu_id` (number) to `id` (string)
          name: item.item_name, // Map `item_name` to `name`
          price: item.item_price, // Map `item_price` to `price`
          quantity: 1, // Default quantity to 1
          image: item.item_picture, // Directly assign `item_picture`
        }))
      );
  }, [cartItems]);

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [restaurant, setRestaurant] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Handle adding item to cart
  const handleAddToCart = async (item: any) => {
    //i know it's set to any type, please bear with, I'm so confused
    const existingItem = cart.find(
      (cartItem) => cartItem.id === String(item.id)
    );

    setCart((prevCart) => {
      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map((cartItem) =>
          cartItem.id === String(item.id)
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item to cart

        return [
          ...prevCart,
          {
            id: String(item.id),
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image,
          },
        ];
      }
    });
    if (!existingItem) {
      try {
        await mutate(Number(item.id));
        await refetch(); // Refetch cart data to ensure sync with server
      } catch (error) {
        // Handle error case
        console.error("Failed to update cart:", error);
        refetch(); // Refetch to ensure UI shows correct state
      }
    }
  };

  // Handle removing item from cart
  const removeFromCart = async (itemId: string) => {
    const existingItem = cart.find((item) => item.id === itemId);

    setCart((prevCart) => {
      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        return prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // Remove item completely if quantity is 1
        return prevCart.filter((item) => item.id !== itemId);
      }
    });
    if (existingItem && existingItem.quantity === 1) {
      try {
        await removeItemMutate(Number(itemId));
        await refetch(); // Refetch cart data to ensure sync with server
      } catch (error) {
        // Handle error case
        console.error("Failed to update cart:", error);
        refetch(); // Refetch to ensure UI shows correct state
      }
    }
  };

  const handlePayment = () => {
    //this function will store the location in localStorage, so after payment and redirect, we can checkout with said info
    if (!selectedLocation) {
      setTimeout(
        () =>
          toast({
            title: "One more step to go",
            description: "you haven't picked a location yet",
            variant: "destructive",
          }),
        500
      );
    } else if (cart.length < 1) {
      toast({
        title: "Oh no",
        description: "you haven't picked anything D:",
        variant: "destructive",
      });
    } else {
      localStorage.setItem("orderLocation", selectedLocation);
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("totalPrice", String(calculateTotal()));
      initializeCheckoutMutate({
        restaurantId: id!,
        total: calculateTotal(),
        callback_id: id!,
      });
    }
  };
  const {
    mutateAsync: initializeCheckoutMutate,
    status: initializeCheckoutStatus,
  } = useMutation({
    mutationFn: initializeCheckout,
    onSuccess: (data) => {
      toast({
        title: "redirecting to payment gateway...",
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

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Scroll to category section
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  //   if (!restaurant) {
  //     return (
  //       <div className="flex justify-center items-center min-h-screen bg-secondary-50">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  //       </div>
  //     );
  //   }

  return (
    <div className="bg-secondary-50 min-h-screen pt-16 pb-20">
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 w-full">
        <div className="absolute inset-0">
          <img
            src={restaurant?.coverImage}
            alt={/*restaurant.name*/ "nothing"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {/*restaurant.name*/ "rest name"}
              </h1>
              <p className="text-white/90 mb-4">
                {/*restaurant.description*/ "it's description"}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <FiStar className="mr-1 text-yellow-400" />
                  <span>{/*restaurant.rating*/ "rating"}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{/*restaurant.deliveryTime*/ "delivery time"}</span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="mr-1" />
                  <span>{/*restaurant.location*/ "location"}</span>
                </div>
                <span className="px-2 py-1 bg-white/20 rounded-full">
                  {/*restaurant.cuisine*/ "cuisine"}
                </span>
                <span className="px-2 py-1 bg-white/20 rounded-full">
                  {/*restaurant.priceRange*/ "price range"}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Menu categories and items */}
          <div className="w-full lg:w-2/3">
            {/* Category Tabs */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
              className="mb-8 overflow-x-auto"
            >
              <div className="flex space-x-2 pb-2">
                {categories?.map((category: category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(String(category.id))}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === String(category.id)
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-white border border-secondary-200 text-secondary-700 hover:bg-secondary-50"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Menu Items by Category */}
            <div className="space-y-10">
              {categories?.map((category: category, index: number) => (
                <motion.div
                  key={category.id}
                  id={`category-${category.id}`}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  custom={index + 2}
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-secondary-900 mb-5 flex items-center">
                    {category.name}
                    <div className="ml-4 h-px bg-secondary-200 flex-grow"></div>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems?.map((item: menu) => (
                      <>
                        {item.id === category.id &&
                          item.menus.map((menuitem: menuItem) => (
                            <div
                              key={menuitem.id}
                              className="bg-white rounded-xl shadow-soft-md overflow-hidden flex flex-col md:flex-row transition-transform hover:shadow-soft-lg hover:-translate-y-1"
                            >
                              <div className="h-40 md:h-auto md:w-1/3">
                                <img
                                  src={String(menuitem.image!)}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-4 flex flex-col flex-grow justify-between md:w-2/3">
                                <div>
                                  <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                                    {menuitem.name}
                                  </h3>
                                  <p className="text-secondary-600 text-sm mb-2 line-clamp-2">
                                    {menuitem.description}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-primary-600 font-semibold">
                                    ₦{Number(menuitem?.price)?.toLocaleString()}
                                  </span>
                                  <button
                                    onClick={() => handleAddToCart(menuitem)}
                                    className="inline-flex items-center justify-center p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                                  >
                                    <FiPlus size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side - Cart */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={5}
            className="w-full lg:w-1/3"
          >
            <div className="bg-white rounded-2xl shadow-soft-md p-6 lg:sticky lg:top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-secondary-900">
                  Your Order
                </h2>
                <button
                  onClick={() => setCartOpen(!cartOpen)}
                  className="lg:hidden text-secondary-500 hover:text-primary-600"
                >
                  <FiChevronRight
                    className={`transform transition-transform ${
                      cartOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </div>

              <div
                className={`${
                  cartOpen ? "block" : "hidden lg:block"
                } transition-all`}
              >
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                      <FiShoppingCart
                        size={24}
                        className="text-secondary-500"
                      />
                    </div>
                    <p className="text-secondary-600 mb-2">
                      Your cart is empty
                    </p>
                    <p className="text-secondary-500 text-sm">
                      Add items from the menu to get started
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-secondary-100 mb-6 max-h-[calc(100vh-350px)] overflow-y-auto">
                      {cart?.map((item) => (
                        <div key={item.id} className="py-3 flex items-center">
                          <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 mr-3">
                            <img
                              src={String(item.image)!}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-secondary-900 font-medium">
                              {item.name}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-primary-600 font-medium">
                                ${Number(item?.price)?.toLocaleString()}
                              </span>
                              <div className="flex items-center border border-secondary-200 rounded-lg">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="px-2 py-1 text-secondary-500 hover:text-primary-600"
                                >
                                  <FiMinus size={14} />
                                </button>
                                <span className="px-2 text-secondary-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="px-2 py-1 text-secondary-500 hover:text-primary-600"
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-secondary-200 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-secondary-600">Subtotal</span>
                        <span className="text-secondary-900 font-medium">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-secondary-600">Delivery Fee</span>
                        <span className="text-secondary-900 font-medium">
                          {deliveryFee}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-4">
                        <span className="text-secondary-900">Total</span>
                        <span className="text-primary-600">
                          ₦{(calculateTotal() + deliveryFee).toLocaleString()}
                        </span>
                      </div>
                      <Select onValueChange={(value) => setLocation(value)}>
                        <SelectTrigger className="w-[180px] mt-3 sm:mt-0">
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {locationStatus === "pending" ? (
                              <SelectLabel>getting locations...</SelectLabel>
                            ) : (
                              locations?.locations.map(
                                (location: { id: number; name: string }) => (
                                  <SelectItem
                                    key={location.id}
                                    value={location.name}
                                  >
                                    {location.name}
                                  </SelectItem>
                                )
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <button
                        className="w-full mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all font-medium text-base"
                        onClick={handlePayment}
                        disabled={initializeCheckoutStatus === "pending"}
                      >
                        <FiShoppingCart className="mr-2" /> Place Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenuPage;
