import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "@/stores/useAuthStore";
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { isLoggedIn /*role*/ } = useAuthStore();

  return (
    <header className="bg-white dark:bg-header-dark shadow-sm flex justify-center sticky z-10 top-0 max-h-16">
      <div className="container py-4 flex justify-between items-center w-full px-0">
        <div className="flex flex-row ml-9 align-middle justify-end">
          <span className="mt-7 font-semibold text-lg italic dark:text-gradient-darkstart text-right md:text-xl galaxy-fold:text-sm">
            Order
          </span>
          <Link
            to="/"
            className="text-2xl font-bold text-stone-900 dark:text-cfont-dark "
          >
            <div className="w-20 h-20 overflow-hidden">
              <img
                src={
                  window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "/DarkerOrderLogo.PNG"
                    : "/orderLogo.JPG"
                }
                className="h-full object-cover"
              ></img>
            </div>
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="block md:hidden ml-auto mr-[1rem]"
          >
            <button>
              <FontAwesomeIcon
                icon={faBurger}
                className="w-7 h-7 text-opacity-70 dark:text-cfont-dark"
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
            {!isLoggedIn && (
              <div>
                <DropdownMenuItem asChild>
                  <Link to="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/signup">Sign Up</Link>
                </DropdownMenuItem>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <nav className="hidden md:flex space-x-4">
          <Link
            to="/"
            className="text-sm dark:text-cfont-dark font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50"
          >
            Home
          </Link>
          <Link
            to="/restaurants"
            className="text-sm dark:text-cfont-dark font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50"
          >
            Restaurants
          </Link>
          <Link
            to="/cart"
            className="text-sm dark:text-cfont-dark font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50"
          >
            Cart
          </Link>
          <Link
            to="/contact"
            className="text-sm dark:text-cfont-dark font-medium text-gray-600 hover:text-stone-900 dark:hover:text-stone-50"
          >
            Contact Us
          </Link>
        </nav>
        <div
          className={`${
            isLoggedIn ? "hidden" : "md:flex"
          } items-center sm:hidden space-x-2`}
        >
          <Button variant="ghost" asChild>
            <Link className="dark:text-cfont-dark" to="/login">
              Log In
            </Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
        {isLoggedIn && <ModeToggle />}
      </div>
    </header>
  );
}
