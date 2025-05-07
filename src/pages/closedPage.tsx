import { useState, useEffect } from "react";
import { Clock, AlertCircle, ChevronRight } from "lucide-react";

const ClosedPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update time every second to show real-time seconds
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check if current time is between 12pm and 8pm
      const hours = now.getHours();
      setIsOpen(hours >= 12 && hours < 20);
    }, 1000); // Update every second instead of every minute

    // Initial check
    const hours = currentTime.getHours();
    setIsOpen(hours >= 12 && hours < 20);

    return () => clearInterval(timer);
  }, []);

  // Calculate time until opening or closing with seconds
  const getTimeMessage = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    if (isOpen) {
      // Calculate time until closing (8pm)
      const hoursUntilClose = 19 - hours;
      const minutesUntilClose = 59 - minutes;
      const secondsUntilClose = 59 - seconds;

      // Handle edge cases for prettier display
      if (minutes === 59 && seconds === 59) {
        return `Closing in ${hoursUntilClose + 1}h 0m 0s`;
      }

      return `Closing in ${hoursUntilClose}h ${minutesUntilClose}m ${secondsUntilClose}s`;
    } else {
      // Calculate time until opening (12pm)
      if (hours < 12) {
        const hoursUntilOpen = 11 - hours;
        const minutesUntilOpen = 59 - minutes;
        const secondsUntilOpen = 59 - seconds;

        // Handle edge cases
        if (minutes === 59 && seconds === 59) {
          return `Opening in ${hoursUntilOpen + 1}h 0m 0s`;
        }

        return `Opening in ${hoursUntilOpen}h ${minutesUntilOpen}m ${secondsUntilOpen}s`;
      } else {
        // After 8pm, show time until opening tomorrow
        const hoursUntilOpen = 35 - hours; // 24 + 11 = 35 (11am next day)
        const minutesUntilOpen = 59 - minutes;
        const secondsUntilOpen = 59 - seconds;

        // Handle edge cases
        if (minutes === 59 && seconds === 59) {
          return `Opening in ${hoursUntilOpen + 1}h 0m 0s`;
        }

        return `Opening in ${hoursUntilOpen}h ${minutesUntilOpen}m ${secondsUntilOpen}s`;
      }
    }
  };

  // Format current time for display
  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-peach-100 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-3xl mx-auto mt-10">
        <div className="w-full space-y-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-orange-600">We're Currently</span>
            <br />
            <span className="text-gray-700">
              {isOpen ? "Open for Orders" : "Closed"}
            </span>
          </h2>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center justify-center gap-3 text-gray-700 mb-4">
              <Clock className="text-orange-600" size={24} />
              <span className="font-medium text-xl">Operating Hours</span>
            </div>

            <div className="text-2xl font-semibold text-gray-800 mb-4">
              {formatCurrentTime()}
            </div>

            <p className="text-gray-600 text-xl mb-6">
              We're active daily from{" "}
              <span className="font-semibold">12:00 PM to 8:00 PM</span>
            </p>

            <div className="flex items-center justify-center gap-2 mt-2">
              <AlertCircle
                className={isOpen ? "text-green-600" : "text-orange-600"}
                size={22}
              />
              <span
                className={`font-medium text-lg ${
                  isOpen ? "text-green-600" : "text-orange-600"
                }`}
              >
                {isOpen ? "We're currently accepting orders" : getTimeMessage()}
              </span>
            </div>
          </div>

          {isOpen && (
            <button className="bg-orange-600 text-white px-8 py-4 rounded-full hover:bg-orange-700 transition-colors flex items-center gap-2 mx-auto text-lg">
              Order Now <ChevronRight size={20} />
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-600 border-t border-orange-200 mt-auto">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-orange-600 transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-orange-600 transition-colors">
            Restaurants
          </a>
          <a href="#" className="hover:text-orange-600 transition-colors">
            Contact Us
          </a>
        </div>
        <p>© {new Date().getFullYear()} BHU Order. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ClosedPage;
