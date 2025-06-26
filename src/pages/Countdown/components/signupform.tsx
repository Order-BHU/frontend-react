import { Button } from "@/components/ui/button";
import { Truck, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaPhone } from "react-icons/fa";

const SignupForm = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
        <div className="text-center mb-6">
          {localStorage.getItem("registeredBeforeLaunch") === "true" ? (
            <>
              <div className="flex justify-around">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <Link
                    to="https://whatsapp.com/channel/0029VbAikJF84Om30J1VPC45"
                    target="_blank"
                  >
                    <FaWhatsapp className="text-orange-500" size={24} />
                  </Link>
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <Link to="https://instagram.com/bhu_order" target="_blank">
                    <FaInstagram className="text-orange-500" size={24} />
                  </Link>
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <Link to="tel:+2348091803206">
                    <FaPhone className="text-orange-500" size={24} />
                  </Link>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Join The Community
              </h3>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 animate-bounce">
                <Truck className="text-orange-500" size={24} />
              </div>
              {/* <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Be the First to Know!
              </h3> */}
              <p className="text-orange-200">
                Register and be part of the community
              </p>
            </>
          )}
        </div>
        {localStorage.getItem("registeredBeforeLaunch") != "true" && (
          <Button
            onClick={handleSignupClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Register!!!</span>
            <ArrowRight size={18} />
          </Button>
        )}

        <p className="text-center text-orange-200 text-sm mt-4">
          No spam, just delicious updates! 🍕
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
