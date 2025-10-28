import { motion } from "framer-motion";
import { FiStar, FiSearch } from "react-icons/fi";
import { useState, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getRestaurants } from "@/api/restaurant";
import { useToast } from "@/hooks/use-toast";
import { Img } from "react-image";
import DownTime from "./ClosedPage/downtime";

// Fade-in animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: custom * 0.1 },
  }),
};

interface restaurant {
  id: number;
  name: string;
  logo: string;
}

const RestaurantsPage = () => {
  const { toast } = useToast();
  const {
    status,
    data: restaurants,
    error,
  } = useQuery({
    //change this to restaurants later
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });
  if (status === "error") {
    toast({
      title: "Error",
      description: error.message,
    });
  }
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCuisine, setSelectedCuisine] = useState("All");

  // Filter restaurants based on search term and cuisine
  const filteredRestaurants = restaurants?.filter((restaurant: restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });
  const closed: number = 1;
  if (closed === 1) {
    return <DownTime />;
  }

  return (
    <div className="bg-secondary-50 min-h-screen pt-24 pb-20">
      {/* Page Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={1}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            Discover Restaurants
          </h1>
          <p className="text-lg text-secondary-600">
            Explore our curated selection of restaurants offering delicious
            meals delivered right to your door
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={2}
          className="mt-8 grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6"
        >
          {/* Search Input */}
          <div className="relative md:col-span-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-secondary-400 " />
              {/*If you decide to add the cuisine filter, you'll have to add md:mb-7 to this so the search icon isn't wonky */}
            </div>
            <input
              type="text"
              placeholder="Search restaurants..."
              className="block w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Cuisine Filter */}
          {/* <div className="md:col-span-3 flex flex-wrap gap-2">
            {cuisineOptions.map((cuisine) => (
              <button
                key={cuisine}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCuisine === cuisine
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-white border border-secondary-200 text-secondary-700 hover:bg-secondary-50"
                } transition-colors`}
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div> */}
        </motion.div>
      </div>

      {/* Restaurant Cards */}
      {status === "pending" && (
        <div className="flex flex-col justify-center items-center">
          <l-waveform
            size="35"
            stroke="3.5"
            speed="1"
            color="hsl(24.6 95% 53.1%)"
          ></l-waveform>
          <h3 className="text-l font-bold mb-8 text-center text-gray-800 dark:text-cfont-dark m-8">
            Getting Restaurants
          </h3>
        </div>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredRestaurants?.length > 0 ? (
            filteredRestaurants?.map((restaurant: restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                index={restaurant.id}
              />
            ))
          ) : (
            <div
              className={`col-span-full text-center py-16 ${
                status === "pending" ? " hidden" : ""
              }`}
            >
              <h3 className="text-xl font-medium text-secondary-600">
                No restaurants found matching your search
              </h3>
              <p className="mt-2 text-secondary-500">
                Try adjusting your search filters
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Restaurant Card Component
interface RestaurantCardProps {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  index: number;
}

const RestaurantCard = memo(function RestaurantCard({
  restaurant,
  index,
}: RestaurantCardProps) {
  const navigate = useNavigate();
  return (
    <motion.div
      variants={fadeIn}
      custom={index + 3}
      className="bg-white rounded-2xl overflow-hidden shadow-soft-md hover:shadow-soft-xl transition-shadow duration-300"
    >
      {/* Restaurant Image */}
      <div className="relative h-48 overflow-hidden">
        <Img
          src={restaurant.logo}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          unloader={
            <div className="flex justify-center p-5 h-[200px] items-center">
              <l-orbit
                size="35"
                speed="1.5"
                color="hsl(24.6 95% 53.1%)"
              ></l-orbit>
            </div>
          }
        />

        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full shadow-soft-md flex items-center">
          <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
          {/* <span className="text-sm font-semibold">{restaurant.rating}</span> */}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-secondary-900 mb-2">
          {restaurant.name}
        </h3>

        {/* <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800">
            {restaurant.cuisine}
          </span>
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary-100 text-secondary-800">
            {restaurant.priceRange}
          </span>
        </div> */}

        {/* <div className="flex flex-col space-y-2 text-secondary-600 text-sm">
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-2 text-primary-500" />
            <span>{restaurant.deliveryTime} delivery</span>
          </div>
          <div className="flex items-center">
            <FiMapPin className="w-4 h-4 mr-2 text-primary-500" />
            <span>{restaurant.location}</span>
          </div>
        </div> */}
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5 pt-0">
        <button
          className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all font-medium text-base"
          onClick={() => navigate(`/menu/${restaurant.id}`)}
        >
          View Menu
        </button>
      </div>
    </motion.div>
  );
});

export default RestaurantsPage;
