import CountdownTimer from "@/components/countdownComponent/countDownTimer";
import SignupForm from "@/components/countdownComponent/signupform";
import FloatingParticles from "@/components/countdownComponent/floatingParticles";
import { Bike } from "lucide-react";

const CountDown = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 relative overflow-hidden">
      <FloatingParticles />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Bike className="text-white" size={40} />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            <span className="block">BHUORDER</span>
            <span className="block text-2xl md:text-4xl lg:text-5xl text-orange-200 font-normal">
              Coming Soon
            </span>
          </h1>

          <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto leading-relaxed">
            Get ready for the most delicious food delivery experience! Fresh
            meals from your favorite restaurants, delivered lightning fast.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          {/* Countdown Timer */}
          <div className="lg:col-span-1">
            <CountdownTimer />
          </div>

          {/* Signup Form */}
          <div className="lg:col-span-1">
            <SignupForm />
          </div>
        </div>

        {/* Launch date highlight */}
        <div className="text-center mt-12 md:mt-16">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30">
            <p className="text-orange-200 text-sm md:text-base font-medium mb-1">
              Official Launch Date
            </p>
            <p className="text-white text-xl md:text-2xl font-bold">
              June 7, 2025 at 12:00 PM
            </p>
          </div>
        </div>

        {/* Features preview */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 md:mt-20 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl md:text-4xl mb-3">⚡</div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Lightning Fast
            </h3>
            <p className="text-orange-200 text-sm">
              30-minute delivery guarantee
            </p>
          </div>

          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl md:text-4xl mb-3">🍕</div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Premium Quality
            </h3>
            <p className="text-orange-200 text-sm">
              Fresh from top restaurants
            </p>
          </div>

          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl md:text-4xl mb-3">📱</div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Easy Ordering
            </h3>
            <p className="text-orange-200 text-sm">
              Seamless mobile experience
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 md:mt-20 text-orange-200">
          <p>&copy; 2025 Bhuorder. Preparing something amazing for you.</p>
        </div>
      </div>
    </div>
  );
};

export default CountDown;
