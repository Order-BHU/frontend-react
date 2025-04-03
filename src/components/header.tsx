import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from "@/stores/useAuthStore";
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const { isLoggedIn /*role*/ } = useAuthStore();
  const [activeButton, setActiveButton] = useState("home");
  const handleButtonClick = (
    buttonId: "home" | "contact" | "restaurant" | "signup" | "login"
  ) => {
    setActiveButton(buttonId);
  };

  return (
    <header className="bg-white dark:bg-header-dark shadow-sm flex justify-center sticky z-10 top-0 max-h-16 text-blue-headers">
      <div className="container py-4 flex justify-between items-center w-full px-0">
        <div className="flex flex-row ml-9 align-middle justify-end">
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
            <DropdownMenuItem asChild onClick={() => navigate("/home")}>
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
          <Button
            variant={activeButton === "home" ? "default" : "ghost"}
            onClick={() => {
              handleButtonClick("home");
              navigate("/");
            }}
          >
            Home
          </Button>

          <Button
            variant={activeButton === "restaurant" ? "default" : "ghost"}
            onClick={() => {
              handleButtonClick("restaurant");
              navigate("restaurants");
            }}
          >
            Restaurants
          </Button>

          <Button
            variant={activeButton === "contact" ? "default" : "ghost"}
            onClick={() => {
              handleButtonClick("contact");
              navigate("/contact");
            }}
          >
            Contact Us
          </Button>
        </nav>
        <div
          className={`${
            isLoggedIn ? "hidden" : "md:flex"
          } items-center sm:hidden space-x-2`}
        >
          <Button
            variant={activeButton === "login" ? "default" : "ghost"}
            onClick={() => {
              handleButtonClick("login");
              navigate("/login");
            }}
          >
            Log in
          </Button>
          <Button
            onClick={() => {
              handleButtonClick("signup");
              navigate("/signup");
            }}
            variant={activeButton === "signup" ? "default" : "ghost"}
          >
            Sign Up
          </Button>
        </div>
        {isLoggedIn && <ModeToggle />}
      </div>
    </header>
  );
}
