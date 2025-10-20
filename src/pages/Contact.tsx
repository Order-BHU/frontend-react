import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { FiMail, FiPhone, FiSend, FiCoffee } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { contact } from "@/api/profile";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/stores/useAuthStore";
import { Link } from "react-router-dom";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: custom * 0.1 },
  }),
};

const ContactPage = () => {
  const { isLoggedIn } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();
  const { mutate: contactMutate, status: contactStatus } = useMutation({
    mutationFn: contact,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something Went Wrong",
        description: error.message,
      });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    contactMutate({
      subject: formData.subject,
      message: formData.message,
    });
  };

  return (
    <div className="bg-secondary-50 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={1}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-secondary-600">
            Have questions or feedback? We'd love to hear from you. Our team is
            always here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={2}
            className="order-2 lg:order-1"
          >
            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-8 shadow-soft-md">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <FiMail size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                      Email Us
                    </h3>
                    <p className="text-secondary-600">
                      <a
                        href="mailto:support@bhuorder.com.ng"
                        className="hover:text-primary-600 transition-colors"
                      >
                        support@bhuorder.com.ng
                      </a>
                    </p>
                    <p className="text-secondary-500 text-sm mt-1">
                      We'll respond as soon as possible
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <FiPhone size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                      Call Us
                    </h3>
                    <Link
                      to="tel:+2349032497799"
                      className="text-secondary-600"
                    >
                      +234 903 249 7799
                    </Link>
                    <p className="text-secondary-500 text-sm mt-1">
                      Mon-Fri from 12pm to 6pm
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <FaWhatsapp size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                      Message on Whatsapp
                    </h3>
                    <Link
                      to="https://wa.me/2348091803206"
                      className="text-secondary-600 underline"
                      target="_blank"
                    >
                      Click to send us a message
                    </Link>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <FiCoffee size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                      Business Hours
                    </h3>
                    <p className="text-secondary-600">
                      Monday - Friday: 12:00 PM - 8:00 PM
                      <br />
                      Saturday - Sunday: 12:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://whatsapp.com/channel/0029VbAikJF84Om30J1VPC45" // Replace with your actual WhatsApp number
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                    aria-label="WhatsApp"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                    >
                      <path d="M16.001 3C9.372 3 4 8.373 4 15.001c0 2.645.866 5.085 2.332 7.064L4 29l7.123-2.3a11.937 11.937 0 0 0 4.878 1.063c6.628 0 12.001-5.373 12.001-12.001S22.63 3 16.001 3zm0 21.798c-1.69 0-3.3-.44-4.701-1.205l-.338-.193-4.222 1.361 1.366-4.108-.221-.36a9.732 9.732 0 0 1-1.458-5.07c0-5.39 4.387-9.777 9.776-9.777 5.39 0 9.777 4.387 9.777 9.777s-4.387 9.775-9.777 9.775zm5.516-7.348c-.301-.15-1.774-.873-2.05-.973-.276-.1-.477-.15-.678.15-.2.301-.776.973-.951 1.173-.175.2-.351.225-.652.075-.301-.15-1.275-.469-2.43-1.495-.9-.802-1.507-1.79-1.683-2.09-.175-.3-.019-.462.131-.612.134-.134.3-.351.451-.526.15-.175.2-.301.3-.502.1-.2.05-.376-.025-.526-.075-.15-.701-1.69-.963-2.325-.253-.61-.51-.527-.701-.537l-.601-.013c-.2 0-.526.075-.802.376-.276.301-1.057 1.063-1.057 2.596s1.082 2.988 1.237 3.198c.15.2 2.145 3.286 5.181 4.602.725.313 1.288.501 1.738.65.727.239 1.385.213 1.913.138.587-.088 1.773-.726 2.013-1.416.239-.688.239-1.264.163-1.388-.075-.126-.276-.201-.577-.351z" />
                    </svg>
                  </a>

                  <a
                    href="mailto:support.bhuorder.com.ng" // Replace with your actual email
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                    aria-label="Email"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.8l-10 6.25L2 5.8V4zm0 4.383V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.383l-9.385 5.86a1 1 0 0 1-1.23 0L2 8.383z" />
                    </svg>
                  </a>

                  <a
                    href="https://instagram.com/bhu_order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={3}
            className="order-1 lg:order-2"
          >
            <div className="bg-white rounded-2xl p-8 shadow-soft-md">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Send Us a Message
              </h2>

              {contactStatus === "success" ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-green-700">
                    Thank you for reaching out. We'll get back to you as soon as
                    possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 text-black">
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-secondary-700 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={(e) => {
                        if (isLoggedIn) {
                          handleChange(e);
                        } else {
                          toast({
                            description: "please login to continue",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="block w-full px-4 py-3 border border-secondary-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-secondary-700 mb-1"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Please write your message here..."
                      value={formData.message}
                      onChange={(e) => {
                        if (isLoggedIn) {
                          handleChange(e);
                        } else {
                          toast({
                            description: "please login to continue",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="block w-full px-4 py-3 border border-secondary-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={contactStatus === "pending"}
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all font-medium text-base disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {contactStatus === "pending" ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
