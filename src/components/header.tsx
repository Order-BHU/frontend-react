import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-stone-900 dark:text-stone-50"
        >
          FoodDelivery
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50"
          >
            Home
          </Link>
          <Link
            to="/restaurants"
            className="text-sm font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50"
          >
            Restaurants
          </Link>
          <Link
            to="/my-orders"
            className="text-sm font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50"
          >
            My Orders
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50"
          >
            Contact Us
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
