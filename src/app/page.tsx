import { Link } from "react-router-dom";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { ArrowRight, Utensils, Clock, Truck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-orange-100 to-orange-200 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-800">
              Welcome to FoodDelivery
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              Delicious food delivered to your doorstep
            </p>
            <div className="space-x-4">
              <Button
                asChild
                size="lg"
                className="bg-stone-900 hover:bg-stone-900/90 dark:bg-stone-50 dark:hover:bg-stone-50/90"
              >
                <Link to="/restaurants">
                  Browse Restaurants <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-12 text-center">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Utensils,
                  title: "Choose a restaurant",
                  description: "Browse our wide selection of restaurants",
                },
                {
                  icon: Clock,
                  title: "Select your meal",
                  description: "Pick your favorite dishes from the menu",
                },
                {
                  icon: Truck,
                  title: "Enjoy your delivery",
                  description: "We'll bring the food right to your door",
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-orange-100 rounded-full p-6 inline-block mb-4">
                    <step.icon className="h-8 w-8 text-stone-900 dark:text-stone-50" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-6 text-center">
              About Us
            </h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-600 mb-4">
                FoodDelivery is your go-to platform for convenient, delicious
                meals delivered straight to your door. Founded in 2023, we've
                quickly become a favorite among food lovers and busy
                professionals alike.
              </p>
              <p className="text-gray-600">
                Our mission is to connect you with the best local restaurants,
                ensuring that you have access to a wide variety of cuisines
                without ever leaving your home or office. We partner with
                top-rated establishments to bring you quality food, on time,
                every time.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-12 text-center">
              Our Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Customer Satisfaction",
                  description:
                    "Ensure every order meets or exceeds expectations",
                },
                {
                  title: "Support Local Businesses",
                  description: "Partner with and promote local restaurants",
                },
                {
                  title: "Eco-Friendly Practices",
                  description:
                    "Implement sustainable packaging and delivery methods",
                },
                {
                  title: "Community Engagement",
                  description:
                    "Actively participate in and give back to our communities",
                },
              ].map((goal, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 border-gray-100 dark:border-stone-800"
                >
                  <h3 className="text-xl font-semibold mb-2 text-stone-900 dark:text-stone-50">
                    {goal.title}
                  </h3>
                  <p className="text-gray-600">{goal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-stone-900 text-white py-20 dark:bg-stone-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold mb-6">Become a Driver</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our team of delivery drivers and enjoy flexible hours,
              competitive pay, and the opportunity to be part of our growing
              community.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/driver-signup">Sign Up as a Driver</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
