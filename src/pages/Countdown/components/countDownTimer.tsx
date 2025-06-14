import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = new Date("2025-06-07T12:00:00").getTime();

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
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl border border-white/20 hover:scale-105 transition-all duration-300 hover:bg-white/20">
      <div className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 font-mono tracking-tight">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-orange-200 text-sm md:text-base uppercase tracking-widest font-medium">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="text-orange-300 animate-pulse" size={32} />
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Launch Countdown
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl w-full">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>

      <div className="text-center mt-6">
        <p className="text-orange-200 text-lg md:text-xl font-medium">
          Get ready for something delicious!
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
