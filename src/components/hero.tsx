// ... existing code ... <import statements>
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Typewriter from "@/hooks/typewriter";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-100 to-orange-200 pt-32 pb-20 md:pt-40 md:pb-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-24 -right-20 h-96 w-96 rounded-full bg-primary-400 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-primary-300 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight"
            >
              <span className="text-primary-600">Order,</span> is here to serve
              you
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-secondary-700 max-w-lg mx-auto lg:mx-0"
            >
              <Typewriter
                text=" Where Restaurants meet students, One Order at a time"
                delay={45}
              />
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            >
              <Link
                to="/restaurants"
                className="inline-flex items-center justify-center px-2 py-1 rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all font-medium text-base"
              >
                Order Food
              </Link>
              <div className="relative inline-block">
                <div
                  className="w-full inline-flex items-center flex-col justify-center px-2 py-1 rounded-lg text-gray-400 bg-gray-100 shadow-sm cursor-not-allowed border border-gray-200 text-base font-medium"
                  title="Coming Soon"
                >
                  Deliver Parcel
                </div>
                <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-300 text-xs text-gray-800 font-semibold px-1.5 py-0.5 rounded shadow">
                  Coming Soon
                </span>
              </div>

              {/* <Link
                to="/"
                className="inline-flex items-center flex-col justify-center px-2 py-1 rounded-lg text-primary-700 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all font-medium text-base border border-gray-200"
              >
                Deliver Parcel
              </Link> */}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto lg:mx-0 max-w-md lg:max-w-none"
          >
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 opacity-30 blur" />
              <div className="relative bg-white rounded-2xl shadow-soft-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1664&q=80"
                  alt="Food Delivery"
                  className="w-full h-auto"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-soft-md p-4 flex items-center">
                <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-secondary-900 font-medium">
                    Fast Delivery
                  </p>
                  <p className="text-secondary-500 text-sm">30 min or less</p>
                </div>
              </div>

              {/* Floating Rating */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-soft-md p-4">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p className="font-medium">4.9</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
