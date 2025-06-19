//import CountDown from "@/pages/Countdown/countDown";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DownTime from "../downtime";
interface CountdownRedirectProps {
  children: React.ReactNode;
}
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownRedirect = ({ children }: CountdownRedirectProps) => {
  const allowedPaths = ["/signup", "dashboard", "verify", "login", "admin"];
  const location = useLocation();

  // Calculate initial timeLeft synchronously
  const targetDate = new Date("2026-06-07T12:00:00").getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;
  const initialTimeLeft =
    difference > 0
      ? {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        }
      : {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(initialTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (
    timeLeft.hours === 0 &&
    timeLeft.days === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds <= 0
  ) {
    return <>{children}</>;
  }
  if (allowedPaths.some((name) => location.pathname.includes(name))) {
    return <>{children}</>;
  }

  return <DownTime />;
};

export default CountdownRedirect;
