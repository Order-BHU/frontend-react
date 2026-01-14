import { Link, useNavigate } from "react-router-dom";
import { FiInstagram, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { GMAIL, WHATSAPP_LINK } from "@/constants/links";

const Footer = () => {
  const navigate = useNavigate();

  //to make footer hidden if we haven't launched order yet. Can be deleted after launch
  function isAfterTargetDate(): boolean {
    const targetDate = new Date("2025-06-07T12:00:00");
    const currentDate = new Date();
    return currentDate > targetDate;
  }
  //end

  if (!isAfterTargetDate()) {
    return <></>;
  }

  return (
    <footer className="bg-white border-t border-gray-100 py-4">
      <div className="container mx-auto px-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-2">
              <img
                onClick={() => navigate("/")}
                src="/orderLogo.JPG"
                alt="Order Logo"
                className="h-16 w-16 object-cover cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-sm">
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-sm">
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">
              Our Services
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/food-delivery"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Food Delivery
                </Link>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Become a Driver
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-sm">
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">
              Contact Us
            </h3>
            <p className="text-gray-600 mb-1">{`Email: ${GMAIL}`}</p>
            <div className="flex space-x-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={16} />
              </a>
              <a
                href={`mailto:${GMAIL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Mail"
              >
                <FiMail size={16} />
              </a>
              <a
                href="https://instagram.com/bhu_order"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap justify-between items-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Order. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-1 md:mt-0">
              <Link
                to="/privacy-policy"
                className="text-xs text-gray-500 hover:text-blue-600"
              >
                Privacy
              </Link>
              <Link
                to="/tos-policy"
                className="text-xs text-gray-500 hover:text-blue-600"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="text-xs text-gray-500 hover:text-blue-600"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
