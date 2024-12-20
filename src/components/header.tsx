import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger } from "@fortawesome/free-solid-svg-icons";
import UseAuthStore from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { isLoggedIn, role, logIn, logOut, setRole } = UseAuthStore();

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
            <DropdownMenuItem asChild>
              <Link to="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/restaurants">Restaurants</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cart">Cart</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/contact">Contact Us</Link>
            </DropdownMenuItem>
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
            to="/cart"
            className="text-sm font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50"
          >
            Cart
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50"
          >
            Contact Us
          </Link>
        </nav>
        <div
          className={`flex items-center space-x-2${
            isLoggedIn ? " hidden" : ""
          }`}
        >
          <Button variant="ghost" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
        {isLoggedIn && (
          <Link
            to={
              role === "owner"
                ? "/restaurant-dashboard"
                : role === "rider"
                ? "/rider-dashboard"
                : role === "user"
                ? "/user-dashboard"
                : role === "admin"
                ? "/admin-dashboard"
                : "/"
            }
          >
            <Avatar className="h-16 w-16 mr-[2rem]">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                CN{/*make this the username first letters */}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
      </div>
    </header>
  );
}
