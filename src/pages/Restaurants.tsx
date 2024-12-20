import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RestaurantCard } from "@/components/restaurant-card";
import { PageWrapper } from "@/components/pagewrapper";

// This would typically come from an API or database
const restaurants = [
  {
    id: "1",
    name: "Burger Palace",
    cuisine: "American",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "Pasta Paradise",
    cuisine: "Italian",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "Sushi Sensation",
    cuisine: "Japanese",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    name: "Taco Town",
    cuisine: "Mexican",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    name: "Curry House",
    cuisine: "Indian",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    name: "Pizza Place",
    cuisine: "Italian",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
];

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <PageWrapper>
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Popular Restaurants
            </h1>
          </PageWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <PageWrapper>
                <RestaurantCard key={restaurant.id} {...restaurant} />
              </PageWrapper>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
