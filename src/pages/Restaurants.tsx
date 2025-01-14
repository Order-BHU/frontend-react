import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RestaurantCard } from "@/components/restaurant-card";
import { PageWrapper } from "@/components/pagewrapper";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "@/api/restaurant";

// This would typically come from an API or database
interface restaurant {
  id: number;
  name: string;
  cover_picture: string;
}
export default function RestaurantsPage() {
  const { status, data: restaurants } = useQuery({
    //change this to restaurants later
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });
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
              <h3 className="text-xl font-bold mb-8 text-center text-gray-800 dark:text-cfont-dark italic m-8">
                Loading Restaurants...
              </h3>
            </PageWrapper>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant: restaurant) => (
                <PageWrapper>
                  <RestaurantCard key={restaurant.id} {...restaurant} />
                </PageWrapper>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
