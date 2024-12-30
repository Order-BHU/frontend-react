import { Link } from "react-router-dom";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import {
  Utensils,
  Clock,
  Truck,
  Package,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { PageWrapper } from "@/components/pagewrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlFood } from "@fortawesome/free-solid-svg-icons";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
export default function LandingPage() {
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

        <PageWrapper className="py-20 bg-gray-50 dark:bg-cbg-darkaccent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-12 text-center">
              Our Services
            </h2>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 mb-8 lg:ml-32">
                <h3 className="text-2xl font-semibold mb-6 text-left dark:text-welcome-dark">
                  Food Delivery
                </h3>
                <div className="flex flex-col space-y-8">
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
                    <div key={index} className="flex items-center space-x-4">
                      <div className="bg-orange-100 rounded-full p-4 flex-shrink-0">
                        <step.icon className="h-6 w-6 text-primary text-stone-900 dark:text-gray-900" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 dark:text-cfont-dark ">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 lg:ml-60">
                <h3 className="text-2xl font-semibold mb-6 text-left dark:text-welcome-dark">
                  Parcel Delivery
                </h3>
                <div className="flex flex-col space-y-8 ">
                  {[
                    {
                      icon: Package,
                      title: "Prepare your parcel",
                      description: "Pack your item securely for safe transit",
                    },
                    {
                      icon: MapPin,
                      title: "Set pickup & delivery",
                      description: "Enter the pickup and delivery addresses",
                    },
                    {
                      icon: CheckCircle,
                      title: "Track and receive",
                      description:
                        "Track your parcel and receive it at the destination",
                    },
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="bg-blue-100 rounded-full p-4 flex-shrink-0">
                        <step.icon className="h-6 w-6 text-blue-600 dark:text-gray-900" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 dark:text-cfont-dark">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
            <h2 className="text-3xl font-semibold mb-6">Partner With Us</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our team and become part of our growing network! Whether
              you’re a driver ready to deliver, a restaurant owner looking to
              reach more customers, or a sponsor eager to support our mission,
              we’d love to have you onboard.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  );
}
