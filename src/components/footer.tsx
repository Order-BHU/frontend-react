import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Short Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-5">
              <img
                src="https://ext.same-assets.com/905646781/234163757.jpeg"
                alt="Order Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-display font-bold text-primary-600">
                Order
              </span>
            </Link>
            <p className="text-secondary-600 mb-5 text-sm">
              Your go-to platform for convenient, delicious meals delivered
              straight to your door.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-secondary-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-secondary-600 hover:text-primary-600 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="text-secondary-600 hover:text-primary-600 transition-colors text-sm"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-secondary-600 hover:text-primary-600 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-semibold text-secondary-900 mb-4">
              Our Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/food-delivery"
                  className="text-secondary-600 hover:text-primary-600 transition-colors text-sm"
                >
                  Food Delivery
                </Link>
              </li>

              <li>
                <a
                  href="/contact"
                  className="text-secondary-600 hover:text-primary-600 transition-colors text-sm"
                >
                  Become a Driver
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-secondary-900 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-secondary-600">
              <li>Email: bhuorder@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <p className="text-sm text-secondary-500">
              &copy; {new Date().getFullYear()} Order. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-xs text-secondary-500 hover:text-primary-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-xs text-secondary-500 hover:text-primary-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-xs text-secondary-500 hover:text-primary-600 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
