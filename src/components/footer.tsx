import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 py-12 dark:bg-header-dark dark:text-cfont-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="w-52 h-52 overflow-hidden flex flex-col align-top">
              <img
                src={
                  window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "/DarkOrderLogo.PNG"
                    : "/orderLogo.JPG"
                }
                className="h-full top-0"
              ></img>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-stone-900 transition-colors dark:hover:text-stone-50"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="hover:text-stone-900 transition-colors dark:hover:text-stone-50"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-stone-900 transition-colors dark:hover:text-stone-50"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:bhuorder@gmail.com"
                  className="hover:text-stone-900 transition-colors dark:hover:text-stone-50"
                >
                  Become a Driver
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-stone-900 transition-colors dark:hover:text-stone-50"
              >
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-stone-900 transition-colors dark:hover:text-stone-50"
              >
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-stone-900 transition-colors dark:hover:text-stone-50"
              >
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Order. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
