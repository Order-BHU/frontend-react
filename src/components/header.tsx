import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import useAuthStore from "@/stores/useAuthStore";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn /*role*/ } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-soft-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-20 h-15 overflow-hidden">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/restaurants">Restaurants</NavLink>
            <NavLink to="/contact">Contact Us</NavLink>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div
            className={`items-center space-x-4 ${
              isLoggedIn ? " hidden" : "md:flex"
            }`}
          >
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-full transition-colors shadow-sm"
            >
              Sign Up
            </Link>
          </div>

          <div className="flex justify-end">
            <div className="flex md:hidden mr-4">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-primary-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>

            {isLoggedIn && <ModeToggle />}
          </div>

          {/* Mobile Menu Button */}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0"
        >
          <div className="px-4 py-5 space-y-5">
            <nav className="flex flex-col space-y-5">
              <MobileNavLink to="/" onClick={() => setIsOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/restaurants" onClick={() => setIsOpen(false)}>
                Restaurants
              </MobileNavLink>
              <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>
                Contact Us
              </MobileNavLink>
            </nav>
            <div
              className={`flex flex-col space-y-3 pt-5 border-t border-gray-100 ${
                isLoggedIn ? "hidden" : "md:flex"
              }`}
            >
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-full transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="text-base font-medium text-secondary-700 hover:text-primary-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-base font-medium text-secondary-700 hover:text-primary-600 transition-colors"
  >
    {children}
  </Link>
);

export default Header;
