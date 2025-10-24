import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const popupMessages = {
  0: {
    title: "Order is now on Mobile!!",
    description: "It's fast, free and convenient",
  },
  1: [
    {
      title: "Have you tried the mobile app yet?",
      description: "Wanna make life easier? Install our app.",
    },
    {
      title: "Try the Order app for mobile!!",
      description: "Quick tip: things work smoother in the app",
    },
    {
      title: "Install Order on mobile for better convenience!",
      description: "Get Order for Mobile",
    },
    {
      title: "Get Order on your phone today!!",
      description: "An easier way to access your favorite restaurant",
    },
  ],
  2: [
    {
      title: "Quick reminder about the Order app",
      description: "Just click the buttons and install",
    },
    {
      title: "Still here? Try mobile",
      description: "Remember the app from before? It's still worth a look",
    },
    {
      title: "Still here? Try mobile",
      description: "Remember the app from before? It's still worth a look",
    },
    {
      title: "Hi there! Try the order app!",
      description: "It's deliciously convenient",
    },
  ],
  3: [
    {
      title: "You'd actually love the app!!",
      description:
        "It's smoother, faster, and no popups like this one. We hate popups here at Order",
    },
    {
      title: "Better experience with the app",
      description:
        "Real talk, it’s genuinely better than using the site. The app has no popups",
    },
    {
      title: "You might like the app",
      description:
        "But seriously, just give it a shot. Don't you want to try something new?",
    },
    {
      title: "One Click is all it takes!!",
      description: "Get the app today!!! Popups are annoying!!!",
    },
  ],
  4: [
    {
      title: "Wait… no app yet?",
      description: "You must’ve installed it and just forgot, yeah?",
    },
    {
      title: "You still haven't installed Order?",
      description:
        "Maybe you installed it and forgot. Just use the buttons and open the app store",
    },
    {
      title: "You definitely installed Order already, right? ",
      description: "How have you not done this already?",
    },
    {
      title: "You didn’t download the Order app?",
      description: "Do you actually like these popups?",
    },
  ],
  5: [
    {
      title: "You’re really ignoring these messages to install the app?",
      description: "DOWNLOAD. THE. APP. TODAY",
    },
    {
      title: "Six popups aren't enough for you to install the Order app?",
      description: "Just get the app, it's really not that hard",
    },
    {
      title: "Fine, don't Install the app",
      description: "I don't even care anymore, do whatever you want",
    },
    {
      title: "You’re making this difficult for both of us",
      description: "Get the app today. COME ON!",
    },
  ],
  6: [
    {
      title: "Okay okay, Hear us out",
      description:
        "You install the app, and the popups stop showing up. Everyone wins.",
    },
    {
      title: "You want fewer popups?",
      description: "PLEASE just click install",
    },
    {
      title: "I PROMISE YOU using the app is better than the site",
      description: "Just install the app.",
    },
    {
      title: "DO YOU WANT MONEY!!!?",
      description:
        "We don't have any money, but we do have an app. Install it. Please.",
    },
  ],
  7: [
    {
      title: ";-;",
      description:
        "You don’t want the app. I get it. Just ignore this like you've already been doing",
    },
    {
      title: "I just thought you'd like our mobile app",
      description: "Guess I was wrong ;;",
    },
    {
      title: "Kinda hurts, not gonna lie",
      description:
        "We spend all this time making an app and you won't even check it out",
    },
    {
      title: "This is so sad",
      description: "Look at you. Sad and app-less. Disgusting",
    },
  ],
  8: [
    {
      title: "Order is an app",
      description: "",
    },
    {
      title: "The order app",
      description: "",
    },
    {
      title: "A mobile app called Order",
      description: "",
    },
    {
      title: "Order; The app that lets you order",
      description: "",
    },
  ],
};

const MobileAppDownloadModal = () => {
  const initialTimesShown = sessionStorage.getItem("BHU-appModalDismissed");
  const [isOpen, setIsOpen] = useState(false);
  const [timesShown, setTimesShown] = useState(Number(initialTimesShown) || 0);
  const [randomIndex, setRandomIndex] = useState<number>(
    Math.floor(Math.random() * 4)
  );
  const timerRef = useRef<NodeJS.Timeout>();
  useEffect(() => console.log(timesShown), [timesShown]);
  useEffect(() => {
    setIsOpen(true);
  }, []);
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (isOpen) {
      setRandomIndex(Math.floor(Math.random() * 4));
    }
  }, [isOpen]);
  const handleDismiss = () => {
    const newCount = timesShown + 1;

    setIsOpen(false);
    setTimesShown(newCount);
    sessionStorage.setItem("BHU-appModalDismissed", String(newCount));

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 60000);
  };

  const handleDownload = (platform: "ios" | "android") => {
    // Add your app store links here
    console.log(`Redirecting to ${platform} app store`);
    handleDismiss();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[85%] rounded-xl sm:max-w-md border-0 p-0 gap-0 overflow-hidden shadow-2xl bg-gradient-to-br from-primary-800 via-primary-700 to-primary-500 animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 z-50 rounded-full bg-background/20 p-1 backdrop-blur-sm transition-all hover:bg-background/40 hover:rotate-90"
        >
          <X className="h-3 w-3 text-white" />
        </button>

        <div className="relative p-8 text-white">
          <DialogHeader className="space-y-4 text-center">
            <div className="mx-auto overflow-hidden mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm animate-glow-pulse">
              <img src="orderLogo.JPG" />
            </div>

            <DialogTitle className="text-3xl text-center font-bold tracking-tight text-white">
              {timesShown != 0
                ? (popupMessages as any)[Math.min(8, timesShown)][randomIndex!]
                    .title
                : popupMessages[0].title}
            </DialogTitle>

            <DialogDescription className="text-lg text-white/90 leading-relaxed"></DialogDescription>
          </DialogHeader>

          {/* App Store Buttons */}
          <div className="mt-8 space-y-3">
            <Button
              onClick={() => handleDownload("ios")}
              className="w-full bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-primary-300 hover:text-primary font-semibold text-base h-14 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <svg
                className="mr-2 h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Download on App Store
            </Button>

            <Button
              onClick={() => handleDownload("android")}
              className="w-full bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-primary-300 hover:text-primary font-semibold text-base h-14 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <svg
                className="mr-2 h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Get it on Google Play
            </Button>
          </div>

          {/* Cheeky footer text */}
          <p className="mt-6 text-center text-sm text-white/80 italic">
            {timesShown != 0
              ? (popupMessages as any)[Math.min(8, timesShown)][randomIndex!]
                  .description
              : popupMessages[0].description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileAppDownloadModal;
