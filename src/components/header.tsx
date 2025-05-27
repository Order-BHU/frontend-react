import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import useAuthStore from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Define custom event type
type DropdownStateChangeEvent = CustomEvent<{ isOpen: boolean }>;

// Create a custom event name
export const DROPDOWN_STATE_CHANGE_EVENT = "dropdown-state-change";

// Export function for the ModeToggle component to use
export const notifyHeaderDropdownState = (isOpen: boolean): void => {
  const event = new CustomEvent<{ isOpen: boolean }>(
    DROPDOWN_STATE_CHANGE_EVENT,
    {
      detail: { isOpen },
    }
  );
  document.dispatchEvent(event);
};

const Header = () => {
  const username = localStorage.getItem("name")?.slice(0, 2).toUpperCase();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { isLoggedIn, role } = useAuthStore();
  const navigate = useNavigate();

  // Calculate scrollbar width
  const getScrollbarWidth = (): number => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  // Listen for dropdown state changes
  useEffect(() => {
    const handleDropdownStateChange = (event: DropdownStateChangeEvent) => {
      setDropdownOpen(event.detail.isOpen);
    };

    document.addEventListener(
      DROPDOWN_STATE_CHANGE_EVENT,
      handleDropdownStateChange as EventListener
    );

    return () => {
      document.removeEventListener(
        DROPDOWN_STATE_CHANGE_EVENT,
        handleDropdownStateChange as EventListener
      );
    };
  }, []);

  // Handle scroll effects
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

  // Calculate dynamic header styles
  const headerStyle = dropdownOpen
    ? { paddingRight: `${getScrollbarWidth()}px` }
    : {};

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-soft-md py-3"
          : "bg-transparent py-5"
      }`}
      style={headerStyle}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-20 h-16 overflow-hidden">
              <img
                src={"/DarkerOrderLogo.PNG"}
                className="h-full w-full object-cover"
                alt="Logo"
              />
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

            {isLoggedIn && (
              <Avatar
                className="w-10 h-10"
                onClick={() => navigate(`/${role}-dashboard`)}
              >
                <AvatarImage src={localStorage.getItem("pfp") || ""} />
                <AvatarFallback className="text-gray-900 dark:text-gray-300">
                  {username}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
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

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => (
  <Link
    to={to}
    className="text-base font-medium text-secondary-700 hover:text-primary-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
  >
    {children}
  </Link>
);

interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}

const MobileNavLink = ({ to, children, onClick }: MobileNavLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-base font-medium text-secondary-700 hover:text-primary-600 transition-colors"
  >
    {children}
  </Link>
);

export default Header;
