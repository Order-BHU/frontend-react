import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="bg-white shadow-sm flex justify-center">
      <div className="container py-4 flex justify-between items-center w-full px-0">
        <Link
          to="/"
          className="text-2xl font-bold text-stone-900 dark:text-stone-50"
        >
          Order
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="block md:hidden ml-auto mr-[1rem]"
          >
            <button>
              <FontAwesomeIcon
                icon={faBurger}
                className="w-7 h-7 text-opacity-70"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Home</DropdownMenuItem>
            <DropdownMenuItem>Restaurants</DropdownMenuItem>
            <DropdownMenuItem>My Orders</DropdownMenuItem>
            <DropdownMenuItem>Contact Us</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
