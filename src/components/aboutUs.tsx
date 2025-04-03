import { motion } from "framer-motion";
import { FiCheckSquare } from "react-icons/fi";

const AboutUs = () => {
  const features = [
    { id: "feature-1", text: "Quick, reliable delivery" },
    { id: "feature-2", text: "Wide variety of restaurants" },
    { id: "feature-3", text: "Seamless ordering experience" },
    { id: "feature-4", text: "Live order tracking" },
    { id: "feature-5", text: "Secure payments" },
    { id: "feature-6", text: "24/7 customer support" },
  ];

  return (
    <section className="py-20 bg-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-soft-xl">
              <img
                src="https://images.unsplash.com/photo-1557744813-846c28d0d0db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                alt="Our team"
                className="w-full h-auto"
              />
            </div>

            {/* Stats Overlay */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-soft-md">
              <div className="flex space-x-10">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">2023</p>
                  <p className="text-secondary-600 text-sm">Founded</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">5k+</p>
                  <p className="text-secondary-600 text-sm">Happy Customers</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
              About Us
            </h2>
            <p className="text-lg text-secondary-700 mb-8">
              Order is your go-to platform for convenient, delicious meals
              delivered straight to your door. Founded in 2023, we've quickly
              become a favorite among food lovers and busy professionals alike.
            </p>
            <p className="text-lg text-secondary-700 mb-8">
              Our mission is to connect you with the best local restaurants,
              ensuring that you have access to a wide variety of cuisines
              without ever leaving your home or office. We partner with
              top-rated establishments to bring you quality food, on time, every
              time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-8">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center">
                  <FiCheckSquare className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-secondary-700">{feature.text}</span>
                </div>
              ))}
            </div>

            <a
              href="https://instagram.com/bhuorder"
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Learn more about us
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
