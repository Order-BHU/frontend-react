import { motion } from "framer-motion";
import {
  FiCheckCircle,
  //FiPackage,
  FiClock,
  //FiMap,
  FiStar,
  FiTruck,
} from "react-icons/fi";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1 },
  }),
};

const Services = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            custom={1}
            className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4"
          >
            Our Services
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-lg text-secondary-600 max-w-2xl mx-auto"
          >
            We offer fast, reliable delivery services to meet all your needs
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:gap-16">
          {/* Food Delivery */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-secondary-50 rounded-2xl p-8 lg:p-10 shadow-soft-md"
          >
            <motion.div
              variants={fadeInUp}
              custom={3}
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-500/10 text-primary-600 mb-6"
            >
              <FiTruck size={24} />
            </motion.div>
            <motion.h3
              variants={fadeInUp}
              custom={4}
              className="text-2xl font-bold text-secondary-900 mb-4"
            >
              Food Delivery
            </motion.h3>
            <div className="space-y-6">
              <motion.div
                variants={fadeInUp}
                custom={5}
                className="flex items-center"
              >
                <div className="flex-shrink-0 mt-1">
                  <FiCheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-secondary-900 mb-1">
                    Choose a restaurant
                  </h4>
                  <p className="text-secondary-600">
                    Browse our wide selection of restaurants
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                custom={6}
                className="flex items-start"
              >
                <div className="flex-shrink-0 mt-1">
                  <FiStar className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-secondary-900 mb-1">
                    Select your meal
                  </h4>
                  <p className="text-secondary-600">
                    Pick your favorite dishes from the menu
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                custom={7}
                className="flex items-start"
              >
                <div className="flex-shrink-0 mt-1">
                  <FiClock className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-secondary-900 mb-1">
                    Enjoy your delivery
                  </h4>
                  <p className="text-secondary-600">
                    We'll bring the food right to your door
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Parcel Delivery */}
          {/* <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-secondary-50 rounded-2xl p-8 lg:p-10 shadow-soft-md"
          >
            <motion.div
              variants={fadeInUp}
              custom={3}
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-500/10 text-primary-600 mb-6"
            >
              <FiPackage size={24} />
            </motion.div>
            <motion.h3
              variants={fadeInUp}
              custom={4}
              className="text-2xl font-bold text-secondary-900 mb-4"
            >
              Parcel Delivery
            </motion.h3>
            <div className="space-y-6">
              <motion.div
                variants={fadeInUp}
                custom={5}
                className="flex items-start"
              >
                <div className="flex-shrink-0 mt-1">
                  <FiPackage className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-secondary-900 mb-1">
                    Prepare your parcel
                  </h4>
                  <p className="text-secondary-600">
                    Pack your item securely for safe transit
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                custom={6}
                className="flex items-start"
              >
                <div className="flex-shrink-0 mt-1">
                  <FiMap className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-secondary-900 mb-1">
                    Set pickup & delivery
                  </h4>
                  <p className="text-secondary-600">
                    Enter the pickup and delivery addresses
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                custom={7}
                className="flex items-start"
              >
                <div className="flex-shrink-0 mt-1">
                  <FiClock className="w-5 h-5 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-secondary-900 mb-1">
                    Track and receive
                  </h4>
                  <p className="text-secondary-600">
                    Track your parcel and receive it at the destination
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
};

export default Services;
