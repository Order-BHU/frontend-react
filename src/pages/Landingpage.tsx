import { Link } from "react-router-dom";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Utensils, Clock, Truck, Package, MapPin } from "lucide-react";
import { PageWrapper } from "@/components/pagewrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlFood } from "@fortawesome/free-solid-svg-icons";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

export default function LandingPage() {
  const foodplugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const parcelplugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  return (
    <div className="min-h-screen flex flex-col dark:bg-cbg-dark dark:text-cfont-dark">
      <Header />
      <main className="flex-grow">
        <PageWrapper className="bg-gradient-to-r from-orange-light to-orange-dark  dark:from-gradient-darkstart dark:to-gradient-darkend py-20 dark:rounded dark:mx-8 dark:mb-8 dark:box-content">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-800 dark:text-welcome-dark">
              Welcome to Order
            </h1>
            <p className="text-xl mb-8 text-gray-600 dark:text-welcome-dark">
              Delicious food delivered to your doorstep
            </p>
            <div className="">
              <Button
                asChild
                className="bg-stone-900 hover:bg-stone-900/90 dark:bg-stone-50 dark:hover:bg-stone-50/90 mx-5 w-44 my-3"
              >
                <Link to="/restaurants">
                  Order Food{" "}
                  <FontAwesomeIcon icon={faBowlFood} className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="mx-5 my-3 w-44">
                <Link to="/signup">
                  Deliver Parcel{" "}
                  <FontAwesomeIcon icon={faTruck} className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </PageWrapper>

        <PageWrapper className="py-20 justify-center bg-gray-50 dark:bg-cbg-darkaccent">
          <h2 className="text-3xl font-semibold mb-12 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-11">
            <div className="container mx-0 text-center px-0">
              <h2 className="text-2xl font-semibold mb-12 text-center">
                Food delivery
              </h2>
              <Carousel
                plugins={[foodplugin.current]}
                className=""
                //onMouseEnter={plugin.current.stop}
                //onMouseLeave={foodplugin.current.reset}
              >
                <CarouselContent>
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
                    <CarouselItem key={index}>
                      <div key={index} className="text-center">
                        <div className="bg-orange-100 rounded-full p-6 inline-block mb-4 dark:bg-gradient-darkstart">
                          <step.icon className="h-8 w-8 text-stone-900 dark:text-gray-900" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 dark:text-cfont-dark">
                          {step.description}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-semibold mb-12 text-center">
                Parcel Delivery
              </h2>
              <Carousel
                plugins={[parcelplugin.current]}
                className=""
                //onMouseEnter={plugin.current.stop}
                //onMouseLeave={parcelplugin.current.reset}
              >
                <CarouselContent>
                  {[
                    {
                      icon: Package,
                      title: "Request a Pickup",
                      description:
                        "Schedule a pickup for your parcel through our app",
                    },
                    {
                      icon: Truck,
                      title: "Dispatch Rider Collects",
                      description:
                        "Our dispatch rider will collect the parcel from your location",
                    },
                    {
                      icon: MapPin,
                      title: "Track and Deliver",
                      description:
                        "Track your parcel in real-time until it reaches its destination",
                    },
                  ].map((step, index) => (
                    <CarouselItem key={index}>
                      <div key={index} className="text-center">
                        <div className="bg-orange-100 rounded-full p-6 inline-block mb-4 dark:bg-gradient-darkstart">
                          <step.icon className="h-8 w-8 text-stone-900 dark:text-gray-900" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 dark:text-cfont-dark">
                          {step.description}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </PageWrapper>

        <PageWrapper className="py-20 dark:text-cfont-dark">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-6 text-center">
              About Us
            </h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-600 mb-4 dark:text-cfont-dark">
                Order is your go-to platform for convenient, delicious meals
                delivered straight to your door. Founded in 2023, we've quickly
                become a favorite among food lovers and busy professionals
                alike.
              </p>
              <p className="text-gray-600 dark:text-cfont-dark">
                Our mission is to connect you with the best local restaurants,
                ensuring that you have access to a wide variety of cuisines
                without ever leaving your home or office. We partner with
                top-rated establishments to bring you quality food, on time,
                every time.
              </p>
            </div>
          </div>
        </PageWrapper>

        <PageWrapper className="bg-gray-50 py-20 dark:bg-cbg-dark">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-12 text-center">
              Our Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Create Opportunities",
                  description:
                    "To provide on-campus employment for students and staff, fostering skill development and financial independence",
                },
                {
                  title: "Drive Local Growth",
                  description:
                    "To support the campus economy by driving innovative, growth-focused business activities",
                },
                {
                  title: "Enhance Financial Well-being",
                  description:
                    "To improve the economic stability of students and the campus community with fair wages and affordable services",
                },
                {
                  title: "Support Public Resources",
                  description:
                    "To contribute responsibly to local and regional infrastructure, supporting services that benefit the campus and community",
                },
              ].map((goal, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 dark:border-stone-800"
                >
                  <h3 className="text-xl font-semibold mb-2 text-stone-900 ">
                    {goal.title}
                  </h3>
                  <p className="text-gray-600">{goal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </PageWrapper>

        <PageWrapper className="bg-stone-900 text-white py-20 dark:bg-cbg-darkaccent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold mb-6">Become a Driver</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our team of delivery drivers and enjoy flexible hours,
              competitive pay, and the opportunity to be part of our growing
              community.
            </p>
            <Button asChild size="lg" variant="secondary">
              <a href="mailto:orderbhu@gmail.com">Send An Email</a>
            </Button>
          </div>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
}
