import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiUser,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiLogOut,
  FiPlus,
  FiChevronRight,
  FiStar,
  FiClock,
} from "react-icons/fi";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 },
  }),
};

// Sample user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  addresses: [
    {
      id: 1,
      name: "Home",
      address: "123 University Ave, Campus Area, Hostel A",
      isDefault: true,
    },
    {
      id: 2,
      name: "Academic Block",
      address: "Central Campus, Knowledge Center, Room 302",
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: 1,
      type: "Credit Card",
      last4: "4242",
      expiryDate: "04/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "Debit Card",
      last4: "8765",
      expiryDate: "09/26",
      isDefault: false,
    },
  ],
};

// Sample order data
const orders = [
  {
    id: "ORD-1234",
    date: "2023-05-15",
    restaurant: "Munchbox",
    status: "Delivered",
    total: 24.99,
    items: [
      { name: "Double Bacon Burger", quantity: 1, price: 8.99 },
      { name: "French Fries", quantity: 1, price: 2.99 },
      { name: "Milkshake", quantity: 1, price: 4.49 },
    ],
    deliveryAddress: "123 University Ave, Campus Area, Hostel A",
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1368&q=80",
  },
  {
    id: "ORD-1235",
    date: "2023-05-10",
    restaurant: "Nabiss",
    status: "Delivered",
    total: 18.96,
    items: [
      { name: "Butter Chicken", quantity: 1, price: 12.99 },
      { name: "Naan", quantity: 2, price: 1.99 },
    ],
    deliveryAddress: "123 University Ave, Campus Area, Hostel A",
    image:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1741&q=80",
  },
  {
    id: "ORD-1236",
    date: "2023-05-05",
    restaurant: "Pizza Palace",
    status: "Delivered",
    total: 22.48,
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: 14.99 },
      { name: "Garlic Breadsticks", quantity: 1, price: 3.99 },
      { name: "Soda", quantity: 1, price: 1.99 },
    ],
    deliveryAddress: "Central Campus, Knowledge Center, Room 302",
    image:
      "https://images.unsplash.com/photo-1593504049359-74330189a345?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1665&q=80",
  },
];

// Sample favorite restaurants
const favoriteRestaurants = [
  {
    id: 13,
    name: "Munchbox",
    cuisine: "Fast Food",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80",
  },
  {
    id: 14,
    name: "Nabiss",
    cuisine: "Indian",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1741&q=80",
  },
  {
    id: 15,
    name: "Pizza Palace",
    cuisine: "Italian",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1593504049359-74330189a345?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1665&q=80",
  },
];

const UserDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="bg-secondary-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={1}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-soft-md p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-200">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                  {user.name}
                </h1>
                <p className="text-secondary-600">{user.email}</p>
              </div>
            </div>
            <Link
              to="/profile/edit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full text-primary-600 border border-primary-200 hover:bg-primary-50 transition-colors"
            >
              <FiUser className="mr-2" /> Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={2}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-soft-md overflow-hidden">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-secondary-50 ${
                    activeTab === "orders"
                      ? "bg-primary-50 text-primary-600 border-l-4 border-primary-600"
                      : "text-secondary-700"
                  }`}
                >
                  <FiShoppingBag size={20} />
                  <span className="font-medium">My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-secondary-50 ${
                    activeTab === "favorites"
                      ? "bg-primary-50 text-primary-600 border-l-4 border-primary-600"
                      : "text-secondary-700"
                  }`}
                >
                  <FiHeart size={20} />
                  <span className="font-medium">Favorites</span>
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-secondary-50 ${
                    activeTab === "addresses"
                      ? "bg-primary-50 text-primary-600 border-l-4 border-primary-600"
                      : "text-secondary-700"
                  }`}
                >
                  <FiMapPin size={20} />
                  <span className="font-medium">Addresses</span>
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-secondary-50 ${
                    activeTab === "payment"
                      ? "bg-primary-50 text-primary-600 border-l-4 border-primary-600"
                      : "text-secondary-700"
                  }`}
                >
                  <FiCreditCard size={20} />
                  <span className="font-medium">Payment Methods</span>
                </button>
                <Link
                  to="/logout"
                  className="flex items-center gap-3 px-6 py-4 text-left text-red-500 transition-colors hover:bg-red-50"
                >
                  <FiLogOut size={20} />
                  <span className="font-medium">Logout</span>
                </Link>
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-2xl shadow-soft-md p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/restaurants"
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors"
                >
                  <div className="flex items-center">
                    <FiHome className="text-primary-600 mr-3" />
                    <span className="font-medium">Browse Restaurants</span>
                  </div>
                  <FiChevronRight className="text-secondary-400" />
                </Link>
                <Link
                  to="/track-order"
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors"
                >
                  <div className="flex items-center">
                    <FiClock className="text-primary-600 mr-3" />
                    <span className="font-medium">Track Current Order</span>
                  </div>
                  <FiChevronRight className="text-secondary-400" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={3}
            className="lg:col-span-3"
          >
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-soft-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-secondary-900">
                    My Orders
                  </h2>
                </div>

                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-secondary-200 rounded-xl overflow-hidden"
                    >
                      <div className="flex items-center justify-between bg-secondary-50 px-4 py-3 border-b border-secondary-200">
                        <div>
                          <span className="text-sm text-secondary-500">
                            Order ID: {order.id}
                          </span>
                          <p className="font-medium">
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            {order.status}
                          </span>
                          <span className="text-primary-600 font-semibold mt-1">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/4 h-24 rounded-lg overflow-hidden">
                          <img
                            src={order.image}
                            alt={order.restaurant}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-3/4 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-secondary-900">
                              {order.restaurant}
                            </h3>
                            <div className="mt-2 text-sm text-secondary-600">
                              {order.items.map((item, index) => (
                                <p
                                  key={`${order.id}-item-${index}-${item.name}`}
                                >
                                  {item.quantity}x {item.name} - $
                                  {item.price.toFixed(2)}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-sm text-secondary-500">
                              <FiMapPin className="inline mr-1" />
                              {order.deliveryAddress}
                            </div>
                            <Link
                              to={`/order-details/${order.id}`}
                              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="bg-white rounded-2xl shadow-soft-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-secondary-900">
                    Favorite Restaurants
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRestaurants.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      to={`/menu/${restaurant.id}`}
                      className="bg-white border border-secondary-200 rounded-xl overflow-hidden hover:shadow-soft-lg transition-shadow"
                    >
                      <div className="h-40 overflow-hidden">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {restaurant.name}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-secondary-600">
                            {restaurant.cuisine}
                          </span>
                          <div className="flex items-center">
                            <FiStar className="text-yellow-400 mr-1" />
                            <span className="text-secondary-700">
                              {restaurant.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="bg-secondary-50 border border-dashed border-secondary-300 rounded-xl flex flex-col items-center justify-center p-6 h-full">
                    <Link
                      to="/restaurants"
                      className="flex flex-col items-center text-center text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mb-3">
                        <FiPlus className="text-secondary-500" size={24} />
                      </div>
                      <span className="font-medium">
                        Discover More Restaurants
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-2xl shadow-soft-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-secondary-900">
                    My Addresses
                  </h2>
                  <button className="inline-flex items-center px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">
                    <FiPlus className="mr-1" size={16} /> Add New
                  </button>
                </div>

                <div className="space-y-4">
                  {user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border ${
                        address.isDefault
                          ? "border-primary-200 bg-primary-50"
                          : "border-secondary-200"
                      } rounded-xl p-4`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-secondary-900">
                              {address.name}
                            </h3>
                            {address.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-secondary-600 mt-1">
                            {address.address}
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <button className="text-secondary-500 hover:text-secondary-700 p-1">
                            <FiUser size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <div className="bg-white rounded-2xl shadow-soft-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-secondary-900">
                    Payment Methods
                  </h2>
                  <button className="inline-flex items-center px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">
                    <FiPlus className="mr-1" size={16} /> Add New
                  </button>
                </div>

                <div className="space-y-4">
                  {user.paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border ${
                        method.isDefault
                          ? "border-primary-200 bg-primary-50"
                          : "border-secondary-200"
                      } rounded-xl p-4`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-secondary-900">
                              {method.type}
                            </h3>
                            {method.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-secondary-600 mt-1">
                            **** **** **** {method.last4}
                          </p>
                          <p className="text-secondary-500 text-sm">
                            Expires: {method.expiryDate}
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <button className="text-secondary-500 hover:text-secondary-700 p-1">
                            <FiCreditCard size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
