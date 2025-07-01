import { Cloud, CloudRain, Zap, Wind } from "lucide-react";
import { useState, useEffect } from "react";

const WeatherClosedPage = () => {
  const [currentWeatherIcon, setCurrentWeatherIcon] = useState(0);

  // Rotate through different weather icons for a fun animated effect
  useEffect(() => {
    const weatherIcons = [CloudRain, Cloud, Zap, Wind];
    const interval = setInterval(() => {
      setCurrentWeatherIcon((prev) => (prev + 1) % weatherIcons.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const weatherIcons = [CloudRain, Cloud, Zap, Wind];
  const CurrentIcon = weatherIcons[currentWeatherIcon];

  const weatherMessages = [
    "Mother Nature is having a moment! 🌧️",
    "The weather gods are not cooperating today! ⛈️",
    "It's a bit too spicy outside for our riders! 🌪️",
    "Even our delivery heroes need shelter from this storm! ☔",
  ];

  const randomMessage =
    weatherMessages[Math.floor(Math.random() * weatherMessages.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-orange-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-4xl mx-auto">
        <div className="w-full space-y-8 text-center">
          {/* Animated Weather Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <CurrentIcon className="w-16 h-16 text-blue-600 animate-bounce" />
              </div>
              {/* Floating weather elements */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-200 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gray-300 rounded-full animate-ping opacity-50 animation-delay-1000"></div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="text-blue-600">Weather Alert!</span>
            <br />
            <span className="text-gray-700">Deliveries Paused</span>
          </h1>

          {/* Main Message Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-0 bg-gradient-to-br from-white to-gray-50">
            <div className="space-y-6">
              {/* Weather Status */}
              <div className="flex items-center justify-center gap-4 text-blue-600 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CloudRain className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xl font-semibold">
                    Severe Weather Conditions
                  </span>
                </div>
              </div>

              {/* Fun Message */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <p className="text-lg text-gray-700 font-medium mb-2">
                  {randomMessage}
                </p>
                <p className="text-gray-600">
                  We've temporarily paused deliveries to keep our riders safe.
                  We'll be back as soon as the weather clears up!
                </p>
              </div>

              {/* Safety Message */}
              <div className="flex items-start gap-4 bg-orange-50 rounded-xl p-6 border border-orange-100">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-600 text-xl">🛡️</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Safety First!
                  </h3>
                  <p className="text-gray-600">
                    Our delivery team's safety is our top priority. We'll resume
                    service once conditions improve.
                  </p>
                </div>
              </div>

              {/* What to do section */}
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-50 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">📱</span>
                    <h4 className="font-semibold text-gray-900">
                      Stay Updated
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    We'll notify you as soon as deliveries resume. Keep the app
                    handy!
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">☕</span>
                    <h4 className="font-semibold text-gray-900">
                      Perfect Time
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Great weather for staying cozy indoors. Maybe brew some tea?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center">
            <p className="text-gray-500 text-lg">
              Thanks for your patience! 🙏
            </p>
            <p className="text-gray-400 text-sm mt-2">
              We'll be back stronger than the storm! ⚡
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeatherClosedPage;
