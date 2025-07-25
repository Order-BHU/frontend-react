import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronRight } from "lucide-react";
import ButtonLoader from "@/components/buttonLoader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FiEdit2,
  FiShoppingBag,
  FiDollarSign,
  FiCreditCard,
  FiTruck,
  FiList,
  FiPieChart,
  FiPlus,
  // FiX,
  FiMapPin,
  FiUser,
  //FiClock,
  FiTrash,
  FiCheck,
  FiPhone,
} from "react-icons/fi";
import { dashboard, transactions } from "@/api/misc";
import { logOut } from "@/api/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getCategories,
  getMenuItems,
  addMenu,
  editMenu,
  myOrders,
  updateOrderStatus,
  deleteMenuItem,
  updateItemAvailability,
} from "@/api/restaurant";
import {
  menu,
  orderType,
  menuItem,
  category,
} from "@/interfaces/restaurantType";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import EditProfileModal from "@/components/editProfileModal";
import { useNavigate } from "react-router-dom";
import UseAuthStore from "@/stores/useAuthStore";
import Loader from "@/components/loaderAnimation";
import TransactionCard, {
  Transaction,
} from "@/components/restaurantTransactionCard";
// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 },
  }),
};

// Dashboard tabs
type TabType = "orders" | "menu" | "financial";

// Sample data for demonstration
const restaurantProfile = {
  id: "rest-1",
  name: "Munchbox",
  logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",
  description: "Fast food restaurant on campus",
  owner: "John Smith",
  contact: "john@munchbox.com",
  phone: "+91 9876543210",
  address: "Campus Center, Block A",
};

const RestaurantDashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = UseAuthStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [acceptedOrderState, setAccepted] = useState<orderType[]>([]);
  const [menuItemArrayState, setmenuItemArray] = useState<menuItem[]>([]); //to store the menu Items for fast UI response when marking as unavailable
  const [pendingOrderState, setPendingOrders] = useState<orderType[]>([]); //this is for the pending orders. Storing in state for a smooth ui experience
  const [newMenuItem, setNewMenuItem] = useState({
    //what we pass when editing a menu Item
    name: "",
    price: 0,
    description: "",
    image: null as File | null,
    category_id: 0,
    menuId: "",
  });
  const { data: userDetails, refetch: refetchDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => dashboard(),
    refetchOnWindowFocus: false,
  });

  const { data: transactionList } = useQuery({
    queryKey: ["trans"],
    queryFn: () => transactions(),
    refetchOnWindowFocus: false,
  });

  const {
    status: orderStatus,
    data: pendingOrders,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["pendingOrdersArray"],
    queryFn: () => myOrders("pending"),
    staleTime: 30000,
  });
  const { data: acceptedOrders, refetch: refetchAccepted } = useQuery({
    queryKey: ["acceptedOrders"],
    queryFn: () => myOrders("accepted"),
    staleTime: 30000,
  });

  const [loadingOrderMutate, setLoadingOrder] = useState<number | null>();
  const { mutate: orderStatusMutate, status: orderStatusStatus } = useMutation({
    onMutate: ({ orderId }) => {
      setLoadingOrder(orderId);
    },
    mutationFn: updateOrderStatus,
    onError: (error) => {
      setLoadingOrder(null);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      setLoadingOrder(null);
      if (data.message.includes("available driver")) {
        toast({
          title: data.message,
          description:
            "Please wait a few minutes, all delivery persons are busy",
          variant: "destructive",
        });
      }
    },
  });

  useEffect(() => {}, [pendingOrderState]);
  const {
    status: menuStatus,
    data: menuItems,
    refetch: refetchMenuItems,
  } = useQuery({
    queryKey: ["menuItems", userDetails?.restaurant_details?.id],
    queryFn: () => getMenuItems(userDetails?.restaurant_details?.id),
    staleTime: 30000,
    enabled: !!userDetails,
  });

  const { status: editStatus, mutate: editMutate } = useMutation({
    mutationFn: editMenu,
    onSuccess: (data) => {
      refetchMenuItems();
      toast({
        title: "Success",
        description: data.message,
      });
      refetchMenuItems();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { status: mutateStatus, mutate: addMenuMutate } = useMutation({
    mutationFn: addMenu,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      setNewMenuItem({
        name: "",
        price: 0,
        description: "",
        image: null as File | null,
        category_id: 0,
        menuId: "",
      });
      refetchMenuItems();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditMenuItem = (
    itemId: number,
    restId: string,
    e: React.FormEvent
  ) => {
    const found = menuItemArrayState.find((item) => item.id === itemId);
    e.preventDefault();
    found &&
      editMutate({
        name: found.name,
        description: found.description,
        //selectedCategory is of type 'null or number' so I'm checking to make sure it's not null before converting to number here
        category_id:
          selectedCategory != null
            ? Number(selectedCategory)
            : found.category_id,
        price: found.price,
        image: found.image,
        id: Number(itemId),
        category: found.category,
        is_available: "1",
        restaurant_id: restId,
      });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setmenuItemArray((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, image: file } : item))
    );
  };

  const handleAddMenuImageChange = (
    //i know it's redundant, please bear with me here
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setNewMenuItem({ ...newMenuItem, image: e.target.files[0] });
    }
  };
  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    addMenuMutate({
      name: newMenuItem.name,
      description: newMenuItem.description,
      category_id: newMenuItem.category_id,
      price: newMenuItem.price,
      image: newMenuItem.image,
      id: userDetails?.restaurant_details?.id,
      restaurant_id: "",
      category: "",
      is_available: "1",
    });
  };

  useEffect(() => {
    //this sets the pending orders state to the pending orders response

    if (pendingOrders) {
      setPendingOrders(pendingOrders.orders);
    }
  }, [pendingOrders]);
  useEffect(() => {
    if (acceptedOrders) {
      setAccepted(acceptedOrders.orders);
    }
  }, [acceptedOrders]);

  useEffect(() => {
    //this sets the menu Items we get from the server to a state.
    if (menuItems) {
      const allMenus = menuItems.menu.flatMap(
        (category: { id: number; menus: menuItem[] }) => category.menus
      );
      setmenuItemArray(allMenus);
    }
  }, [menuItems]);
  useEffect(() => {
    if (userDetails) {
      localStorage.setItem("pfp", userDetails.user.profile_picture_url);
    }
  }, [userDetails]);

  const handleOrderAccept = (orderId: number, newcategoryStatus: string) => {
    orderStatusMutate({
      orderId: Number(orderId),
      status: newcategoryStatus,
    });
    refetchOrders();
    refetchAccepted();
    // Here you would typically update the order categoryStatus in your backend
  };

  const { status: categoryStatus, data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 30000,
  });

  const { mutate: isAvailableMutate } = useMutation({
    mutationFn: updateItemAvailability,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      refetchMenuItems();
    },
  });

  const handleItemAvailability = (menuId: number, value: "1" | "0") => {
    const foundItem = menuItemArrayState.find(
      (item: menuItem) => item.id === menuId
    );
    if (foundItem) {
      setmenuItemArray((prev) =>
        prev.map((item) =>
          item.id === menuId ? { ...item, is_available: value } : item
        )
      );
    }
    isAvailableMutate({
      menuid: menuId,
      value: value,
    });
    refetchMenuItems();
  };
  const { mutate: deleteMenuItemMutate } = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      refetchMenuItems();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      refetchMenuItems();
    },
  });
  const handleDeleteMenuItem = (id: number) => {
    deleteMenuItemMutate(id);

    setmenuItemArray((prev) => prev.filter((item) => item.id !== id));
  };
  const { status: logoutStatus, mutate: logoutMutate } = useMutation({
    mutationFn: logOut,
    onSuccess: (data) => {
      logout();
      navigate("/login/");
      toast({
        title: "success!",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    },
  });
  const handleLogout = () => {
    const usertoken = localStorage.getItem("BHUO-token");
    if (!usertoken) {
      toast({
        title: "Error",
        description: "Not authenticated",
        variant: "destructive",
      });
      return;
    }
    logoutMutate(usertoken);
  };

  const [selectedCategory, setSelectedCategory] = useState<Number | null>(null); //this state is here so that we can send the category id when editing menu item. Read Docs
  if (logoutStatus === "pending") {
    return (
      <div>
        <Loader />
        <p>Logging you Out</p>
      </div>
    );
  }
  return (
    <div className="bg-secondary-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={1}
        >
          {userDetails && (
            <h1 className="text-3xl font-bold text-gray-900">
              {`Hello, ${userDetails?.user?.name.split(" ")[0] || ""}`}
            </h1>
          )}
        </motion.div>

        {/* Restaurant Profile */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={2}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-soft-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-secondary-900">
                Restaurant Profile
              </h2>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary-100">
                  <img
                    src={userDetails?.restaurant_details?.logo}
                    alt={userDetails?.restaurant_details?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {userDetails?.restaurant_details?.name}
                </h3>
                <p className="text-secondary-600 mb-2">
                  {restaurantProfile.description}
                </p>
                <div className="text-sm text-secondary-500">
                  <p>Contact: {userDetails?.user?.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                {userDetails && ( //here because the modal loads and doesn't show the user's details sometimes
                  <EditProfileModal
                    successFn={refetchDetails}
                    userDetails={{
                      restaurant_name: userDetails?.restaurant_details?.name,
                      restaurant_logo: userDetails?.restaurant_details?.logo,
                      cover_picture: userDetails?.user?.profile_picture_url,
                      phone_number: userDetails?.user?.phone_number,
                    }}
                  />
                )}
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-xl border-gray-200 bg-white shadow-sm"
                  onClick={handleLogout}
                >
                  <span className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={3}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Wallet Balance */}
          <div className="bg-white rounded-2xl shadow-soft-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-secondary-500">
                Wallet Balance
              </h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <FiCreditCard />
              </div>
            </div>
            <div className="text-2xl font-bold text-secondary-900">
              ₦{Number(userDetails?.wallet_balance).toLocaleString()}
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-2xl shadow-soft-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-secondary-500">
                Completed Orders
              </h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <FiShoppingBag />
              </div>
            </div>
            <div className="text-2xl font-bold text-secondary-900">
              {userDetails?.statistics?.completed_orders}
            </div>
            <p className="text-xs mt-1 text-secondary-900">
              {userDetails?.statistics?.pending_orders} Pending
            </p>
            <p className="text-xs mt-1 text-secondary-900">
              {userDetails?.statistics?.accepted_orders} Accepted
            </p>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-2xl shadow-soft-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-secondary-500">
                Average Order Value
              </h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <FiDollarSign />
              </div>
            </div>
            <div className="text-2xl font-bold text-secondary-900">₦{0}</div>
            <p className="text-xs text-green-600 mt-1">{""}</p>
          </div>
        </motion.div>

        {/* Dashboard Tabs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={4}
          className="mb-8"
        >
          <div className="bg-secondary-100 rounded-xl p-1">
            <div className="flex flex-wrap">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "orders"
                    ? "bg-white text-secondary-900 shadow-sm"
                    : "text-secondary-600 hover:text-secondary-900"
                }`}
              >
                <span className="flex items-center justify-center">
                  <FiShoppingBag className="mr-2" /> Order Management
                </span>
              </button>
              <button
                onClick={() => setActiveTab("menu")}
                className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "menu"
                    ? "bg-white text-secondary-900 shadow-sm"
                    : "text-secondary-600 hover:text-secondary-900"
                }`}
              >
                <span className="flex items-center justify-center">
                  <FiList className="mr-2" /> Menu Management
                </span>
              </button>
              <button
                onClick={() => setActiveTab("financial")}
                className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "financial"
                    ? "bg-white text-secondary-900 shadow-sm"
                    : "text-secondary-600 hover:text-secondary-900"
                }`}
              >
                <span className="flex items-center justify-center">
                  <FiPieChart className="mr-2" /> Transactions
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={5}
        >
          {/* Order Management Tab */}
          {activeTab === "orders" &&
            (orderStatus === "pending" ? (
              <div className="flex justify-center items-center min-h-screen bg-secondary-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Pending Orders */}
                <div className="bg-white rounded-2xl shadow-soft-md overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-secondary-900">
                      Pending Orders
                    </h2>
                  </div>
                  <div className="p-6">
                    {pendingOrderState?.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                          <FiShoppingBag className="w-8 h-8 text-secondary-400" />
                        </div>
                        <p className="text-secondary-600 mb-2">
                          No pending orders
                        </p>
                        <p className="text-secondary-500 text-sm">
                          New orders will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pendingOrderState &&
                          pendingOrderState.map((order) => (
                            <div
                              key={order.id}
                              className="bg-secondary-50 rounded-xl p-4 shadow-sm"
                            >
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                  <div className="flex items-center">
                                    <span className="text-lg font-semibold text-secondary-900 mr-3">
                                      Order {order.id}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      {order.status}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-2 md:mt-0">
                                  <span className="text-primary-600 font-semibold">
                                    ₦{Number(order.total).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <div className="border-t border-secondary-200 pt-3 pb-2">
                                <h4 className="text-sm font-medium text-secondary-600 mb-2">
                                  Items:
                                </h4>
                                <ul className="pl-5 list-disc text-sm text-secondary-600 mb-3">
                                  {order.items.map((item, index) => (
                                    <li
                                      key={index}
                                    >{`${item.menu_name} X${item.quantity}`}</li>
                                  ))}
                                </ul>
                                <div className="flex items-center text-sm text-secondary-600">
                                  <FiMapPin className="mr-1" />
                                  <span>
                                    Delivery to: {order.customer_location}
                                  </span>
                                </div>
                              </div>
                              {order.user && (
                                <div className="border-t border-secondary-200 pt-3 pb-2">
                                  <h4 className="text-sm font-medium text-secondary-600 mb-2">
                                    Customer Details
                                  </h4>

                                  <div className="flex items-center text-sm text-secondary-600">
                                    <FiUser className="mr-1" />
                                    <span>{order.user?.name}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-secondary-600">
                                    <FiPhone className="mr-1" />
                                    <span>{order.user?.phone_number}</span>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-end mt-4 space-x-3">
                                {/* <button
                                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors text-sm"
                                  
                                >
                                  <FiX className="mr-1" /> Reject
                                </button> */}
                                <button
                                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors text-sm"
                                  disabled={orderStatusStatus === "pending"}
                                  onClick={() =>
                                    handleOrderAccept(order.id, "accepted")
                                  }
                                >
                                  <FiCheck className="mr-1" /> Accept
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Accepted Orders */}
                <div className="bg-white rounded-2xl shadow-soft-md overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-secondary-900">
                      Accepted Orders
                    </h2>
                  </div>
                  <div className="p-6">
                    {acceptedOrderState?.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                          <FiTruck className="w-8 h-8 text-secondary-400" />
                        </div>
                        <p className="text-secondary-600 mb-2">
                          No accepted orders
                        </p>
                        <p className="text-secondary-500 text-sm">
                          Accepted orders will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {acceptedOrderState &&
                          acceptedOrderState.map((order) => (
                            <div
                              key={order.id}
                              className="bg-secondary-50 rounded-xl p-4 shadow-sm"
                            >
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                  <div className="flex items-center">
                                    <span className="text-lg font-semibold text-secondary-900 mr-3">
                                      {order.id}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Accepted
                                    </span>
                                  </div>
                                  <p className="text-secondary-600 text-sm mt-1">
                                    {order.user_phoneNumber}
                                  </p>
                                </div>
                                <div className="mt-2 md:mt-0">
                                  <span className="text-primary-600 font-semibold">
                                    ₦{Number(order.total).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <div className="border-t border-secondary-200 pt-3 pb-2">
                                <h4 className="text-sm font-medium text-secondary-600 mb-2">
                                  Items:
                                </h4>
                                <ul className="pl-5 list-disc text-sm text-secondary-600 mb-3">
                                  {order.items.map((item, index) => (
                                    <li
                                      key={index}
                                    >{`${item.menu_name} X${item.quantity}`}</li>
                                  ))}
                                </ul>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center text-secondary-600">
                                    <FiMapPin className="mr-1" />
                                    <span>Delivery to: {order.location}</span>
                                  </div>
                                  {/* <div className="flex items-center text-secondary-600">
                                    <FiClock className="mr-1" />
                                     <span>
                                      Estimated delivery: soon enough {":)"}
                                    </span> 
                                  </div> */}
                                </div>
                              </div>
                              {order.user && (
                                <div className="border-t border-secondary-200 pt-3 pb-2">
                                  <h4 className="text-sm font-medium text-secondary-600 mb-2">
                                    Customer Details
                                  </h4>

                                  <div className="flex items-center text-sm text-secondary-600">
                                    <FiUser className="mr-1" />
                                    <span>{order.user?.name}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-secondary-600">
                                    <FiPhone className="mr-1" />
                                    <span>{order.user?.phone_number}</span>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-end mt-4">
                                <button
                                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors text-sm"
                                  disabled={
                                    loadingOrderMutate === order.order_id
                                  }
                                  onClick={() =>
                                    handleOrderAccept(order.order_id, "ready")
                                  }
                                >
                                  {loadingOrderMutate === order.order_id ? (
                                    <ButtonLoader size="h-5 w-5" />
                                  ) : (
                                    <>
                                      <FiTruck className="mr-1" /> Mark as Ready
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {/* Menu Management Tab */}
          {activeTab === "menu" && (
            <div className="bg-white rounded-2xl shadow-soft-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-secondary-900">
                  Menu Items
                </h2>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors text-sm">
                      <FiPlus className="mr-1" /> Add Item
                    </button>
                  </DialogTrigger>
                  <DialogContent className="dark:text-cfont-dark overflow-auto max-h-[95vh]">
                    <DialogHeader>
                      <DialogTitle>Add Menu Item</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleAddMenuItem}
                      className="mt-4 space-y-4"
                    >
                      <h3 className="text-lg font-semibold">
                        Add New Menu Item
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={newMenuItem.name}
                            onChange={(e) =>
                              setNewMenuItem({
                                ...newMenuItem,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price (₦)</Label>
                          <Input
                            id="price"
                            value={newMenuItem.price}
                            onChange={(e) => {
                              const { value } = e.target;

                              setNewMenuItem({
                                ...newMenuItem,
                                price: Number(value.replace(/[^0-9]/g, "")),
                              });
                            }}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newMenuItem.description}
                            onChange={(e) =>
                              setNewMenuItem({
                                ...newMenuItem,
                                description: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="image">Image</Label>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleAddMenuImageChange}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            onValueChange={(value) => {
                              setNewMenuItem({
                                ...newMenuItem,
                                category_id: Number(value),
                              });
                            }}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Choose Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryStatus === "pending" ? (
                                <SelectItem value="" disabled>
                                  Loading categories...
                                </SelectItem>
                              ) : categoryStatus === "error" ? (
                                <SelectItem value="" disabled>
                                  Error loading categories
                                </SelectItem>
                              ) : (
                                categories?.map((category: category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={String(category.id)}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={mutateStatus === "pending"}
                      >
                        {mutateStatus === "pending" ? (
                          <ButtonLoader size="h-5 w-5" />
                        ) : (
                          "Add Menu Item"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="p-6">
                {menuStatus === "pending" ? (
                  <div className="flex justify-center items-center min-h-screen bg-secondary-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  menuItems &&
                  menuItems.menu.map((category: menu) => {
                    return (
                      <div key={category.id} className="mb-8 last:mb-0">
                        <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                          {category.name}
                        </h3>
                        <div className="border-t border-gray-100 pt-4 space-y-4">
                          {menuItemArrayState.map(
                            (item) =>
                              String(item.category_id) ===
                                String(category.id) && (
                                <div
                                  key={item.id}
                                  className="flex flex-col md:flex-row md:items-center p-4 bg-secondary-50 rounded-xl"
                                >
                                  <div className="flex-grow mb-4 md:mb-0">
                                    <div className="flex items-center">
                                      <h4 className="font-medium text-secondary-900">
                                        {item.name}
                                      </h4>
                                      {item.is_available === "0" && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          Unavailable
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-secondary-600 mt-1 pr-4">
                                      {item.description}
                                    </p>
                                    <p className="text-primary-600 font-medium mt-2">
                                      ₦
                                      {Number(item.price)
                                        .toFixed(2)
                                        .toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      className="h-9 inline-flex items-center justify-center p-2 rounded-lg border border-secondary-200 text-secondary-700 hover:bg-red-500 transition-colors duration-200"
                                      onClick={() =>
                                        handleDeleteMenuItem(item.id)
                                      }
                                    >
                                      <FiTrash size={16} />
                                    </button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <button className="h-9 inline-flex items-center justify-center p-2 rounded-lg border border-secondary-200 text-secondary-700 hover:bg-secondary-50 transition-colors">
                                          <FiEdit2 size={16} />
                                        </button>
                                      </DialogTrigger>
                                      <DialogContent className="dark:text-cfont-dark overflow-auto max-h-[95vh]">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Edit Menu Item
                                          </DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={(e) =>
                                            handleEditMenuItem(
                                              item.id,
                                              item.restaurant_id,
                                              e
                                            )
                                          }
                                          className="mt-4 space-y-4"
                                        >
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                              <Label htmlFor="name">Name</Label>
                                              <Input
                                                id="name"
                                                value={item.name}
                                                onChange={(e) =>
                                                  setmenuItemArray((prev) =>
                                                    prev.map((p) =>
                                                      p.id === item.id
                                                        ? {
                                                            ...p,
                                                            name: e.target
                                                              .value,
                                                          }
                                                        : p
                                                    )
                                                  )
                                                }
                                                required
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor="price">
                                                Price (₦)
                                              </Label>
                                              <Input
                                                id="price"
                                                value={item.price}
                                                onChange={(e) => {
                                                  setmenuItemArray((prev) =>
                                                    prev.map((p) =>
                                                      p.id === item.id
                                                        ? {
                                                            ...p,
                                                            price: Number(
                                                              e.target.value
                                                            ),
                                                          }
                                                        : p
                                                    )
                                                  );
                                                }}
                                                required
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor="description">
                                                Description
                                              </Label>
                                              <Textarea
                                                id="description"
                                                value={item.description}
                                                onChange={(e) =>
                                                  setmenuItemArray((prev) =>
                                                    prev.map((p) =>
                                                      p.id === item.id
                                                        ? {
                                                            ...p,
                                                            description:
                                                              e.target.value,
                                                          }
                                                        : p
                                                    )
                                                  )
                                                }
                                                required
                                              />
                                            </div>

                                            <div>
                                              <Label htmlFor="image">
                                                Image
                                              </Label>
                                              <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) =>
                                                  handleImageChange(
                                                    event,
                                                    item.id
                                                  )
                                                }
                                                required
                                              />
                                            </div>

                                            <div>
                                              <Label htmlFor="category">
                                                Category
                                              </Label>
                                              <Select
                                                value={
                                                  selectedCategory != null
                                                    ? String(selectedCategory)
                                                    : String(item.category_id)
                                                }
                                                onValueChange={(value) => {
                                                  setSelectedCategory(
                                                    Number(value)
                                                  );
                                                }}
                                              >
                                                <SelectTrigger className="w-[180px]">
                                                  <SelectValue placeholder="Choose Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {categoryStatus ===
                                                  "pending" ? (
                                                    <SelectItem
                                                      value=""
                                                      disabled
                                                    >
                                                      Loading categories...
                                                    </SelectItem>
                                                  ) : categoryStatus ===
                                                    "error" ? (
                                                    <SelectItem
                                                      value=""
                                                      disabled
                                                    >
                                                      Error loading categories
                                                    </SelectItem>
                                                  ) : (
                                                    categories?.map(
                                                      (category: category) => (
                                                        <SelectItem
                                                          key={category.id}
                                                          value={String(
                                                            category.id
                                                          )}
                                                        >
                                                          {category.name}
                                                        </SelectItem>
                                                      )
                                                    )
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </div>
                                          <Button
                                            type="submit"
                                            disabled={editStatus === "pending"}
                                          >
                                            Update Menu Item
                                          </Button>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                    <button
                                      className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium ${
                                        item.is_available === "1"
                                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                                          : "bg-green-100 text-green-800 hover:bg-green-200"
                                      } transition-colors`}
                                      onClick={() => {
                                        if (item.is_available === "1") {
                                          handleItemAvailability(item.id, "0");
                                        } else {
                                          handleItemAvailability(item.id, "1");
                                        }
                                      }}
                                    >
                                      {item.is_available === "1"
                                        ? "Mark Unavailable"
                                        : "Mark Available"}
                                    </button>
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Financial Management Tab */}
          {activeTab === "financial" && (
            <div className="bg-white rounded-2xl shadow-soft-md overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-secondary-900">
                  Transaction List
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-8">
                  {transactionList?.map((item: Transaction) => (
                    <TransactionCard
                      transaction={{
                        amount: item.amount,
                        created_at: item.created_at,
                        reference: item.reference,
                        status: item.status,
                        type: item.type,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RestaurantDashboardPage;
