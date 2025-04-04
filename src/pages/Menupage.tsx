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
const restaurants = [
  {
    id: "13",
    name: "Munchbox",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
    description:
      "Serving delicious meals right on campus. From quick bites to fulfilling meals, we've got you covered.",
    rating: 4.8,
    deliveryTime: "20-30 min",
    priceRange: "$$",
    cuisine: "Fast Food",
    location: "Campus Center",
    categories: [
      {
        id: "1",
        name: "Burgers",
        items: [
          {
            id: "101",
            name: "Classic Cheeseburger",
            description:
              "Juicy beef patty with melted cheddar, lettuce, tomato, onions, and special sauce",
            price: 6.99,
            image:
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1899&q=80",
          },
          {
            id: "102",
            name: "Double Bacon Burger",
            description:
              "Two beef patties, crispy bacon, American cheese, and BBQ sauce",
            price: 8.99,
            image:
              "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1368&q=80",
          },
          {
            id: "103",
            name: "Veggie Burger",
            description:
              "Plant-based patty with avocado, lettuce, tomato, and vegan mayo",
            price: 7.49,
            image:
              "https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
          },
        ],
      },
      {
        id: "2",
        name: "Sandwiches",
        items: [
          {
            id: "201",
            name: "Club Sandwich",
            description:
              "Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo",
            price: 6.49,
            image:
              "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
          },
          {
            id: "202",
            name: "Grilled Cheese",
            description: "Melted cheese blend between buttery crispy bread",
            price: 4.99,
            image:
              "https://images.unsplash.com/photo-1528736235302-52922df5c122?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2344&q=80",
          },
        ],
      },
      {
        id: "3",
        name: "Sides",
        items: [
          {
            id: "301",
            name: "French Fries",
            description: "Crispy golden fries seasoned with sea salt",
            price: 2.99,
            image:
              "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2315&q=80",
          },
          {
            id: "302",
            name: "Onion Rings",
            description: "Crispy battered onion rings with dipping sauce",
            price: 3.49,
            image:
              "https://images.unsplash.com/photo-1639024471283-03bce8738cc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
          },
          {
            id: "303",
            name: "Mozzarella Sticks",
            description: "Breaded mozzarella sticks with marinara sauce",
            price: 4.99,
            image:
              "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
          },
        ],
      },
      {
        id: "4",
        name: "Beverages",
        items: [
          {
            id: "401",
            name: "Soda",
            description: "Choice of Coke, Diet Coke, Sprite, or Fanta",
            price: 1.99,
            image:
              "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2338&q=80",
          },
          {
            id: "402",
            name: "Milkshake",
            description:
              "Hand-spun milkshake in chocolate, vanilla, or strawberry",
            price: 4.49,
            image:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
          },
          {
            id: "403",
            name: "Iced Tea",
            description: "Freshly brewed iced tea, sweetened or unsweetened",
            price: 2.49,
            image:
              "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2264&q=80",
          },
        ],
      },
    ],
  },
];

// Cart item type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: File | null | string;
}

const RestaurantMenuPage = () => {
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

  // Find restaurant by ID
  useEffect(() => {
    if (id) {
      const foundRestaurant = restaurants.find((r) => r.id === id);
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        // Set first category as active by default
        if (
          foundRestaurant.categories &&
          foundRestaurant.categories.length > 0
        ) {
          setActiveCategory(foundRestaurant.categories[0].id);
        }
      }
    }
  }, [id]);

  // Handle adding item to cart
  const handleAddToCart = async (item: menuItem) => {
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
                              src={item.image}
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

                      <button className="w-full mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all font-medium text-base">
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
