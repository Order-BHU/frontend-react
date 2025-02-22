import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RestaurantCard } from "@/components/restaurant-card";
import { PageWrapper } from "@/components/pagewrapper";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "@/api/restaurant";
import { useToast } from "@/hooks/use-toast";

// Default values shown

interface restaurant {
  id: number;
  name: string;
  logo: string;
}
export default function RestaurantsPage() {
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
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-grow bg-gray-50 py-12 dark:bg-cbg-dark">
        <div className="container mx-auto px-4 ">
          <PageWrapper>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-cfont-dark">
              Popular Restaurants
            </h1>
          </PageWrapper>

          {status === "pending" ? (
            <PageWrapper>
              <div className="flex flex-col justify-center items-center">
                <l-waveform
                  size="35"
                  stroke="3.5"
                  speed="1"
                  color="#6C757D"
                ></l-waveform>
                <h3 className="text-l font-bold mb-8 text-center text-gray-800 dark:text-cfont-dark m-8">
                  Getting Restaurants
                </h3>
              </div>
            </PageWrapper>
          ) : status === "success" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants?.map((restaurant: restaurant) => (
                <PageWrapper key={restaurant.id}>
                  <RestaurantCard {...restaurant} />
                </PageWrapper>
              ))}
            </div>
          ) : (
            <div>
              <h1>something went wrong</h1>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
