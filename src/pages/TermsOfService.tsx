import { motion } from "framer-motion";

export default function TermsOfService() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto px-4 max-w-4xl"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-gray-600 mb-8">
          Last updated: January 9, 2026
        </p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using this food delivery platform, you accept and
              agree to be bound by the terms and provision of this agreement.
              If you do not agree to abide by the above, please do not use this
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. User Accounts
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                When you create an account on our platform, you must provide
                accurate, complete, and current information. You are responsible
                for maintaining the confidentiality of your account credentials
                and password.
              </p>
              <p>
                You agree to accept responsibility for all activities that occur
                under your account. You must notify us immediately of any
                unauthorized use of your account.
              </p>
              <p>
                We support multiple account types: Customer, Restaurant Owner,
                Driver, and Admin. Each account type has specific terms and
                responsibilities outlined below.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Customer Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Provide accurate delivery addresses and contact information</li>
              <li>
                Ensure payment information is current and valid at all times
              </li>
              <li>
                Be available to receive orders at the specified delivery location
                and time
              </li>
              <li>
                Treat drivers and restaurant staff with respect and courtesy
              </li>
              <li>
                Report any issues with orders within 24 hours of delivery
              </li>
              <li>Not place fraudulent or test orders</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Restaurant Owner Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Maintain accurate menu information and pricing</li>
              <li>Keep real-time inventory and availability status updated</li>
              <li>Prepare orders according to customer specifications</li>
              <li>Ensure food safety and health code compliance</li>
              <li>Accept or reject orders in a timely manner</li>
              <li>Provide accurate order tracking and status updates</li>
              <li>
                Resolve customer complaints and disputes in good faith
              </li>
              <li>
                Maintain valid business licenses and insurance documentation
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Driver Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Maintain an active and professional account status</li>
              <li>
                Follow traffic laws and safe driving practices at all times
              </li>
              <li>Accept delivery assignments responsibly</li>
              <li>
                Pick up orders from restaurants and deliver them promptly and
                safely
              </li>
              <li>
                Handle food items with care to prevent damage or contamination
              </li>
              <li>
                Communicate with customers regarding delivery status and ETA
              </li>
              <li>Maintain a professional appearance and demeanor</li>
              <li>Provide valid identification and vehicle documentation</li>
              <li>Maintain acceptable cancellation and completion rates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Payment and Billing
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Customers agree to pay all charges and fees associated with
                their orders, including food costs, delivery fees, and taxes.
              </p>
              <p>
                Payment must be made through the methods available on our
                platform. We accept various payment methods and use secure
                payment processing.
              </p>
              <p>
                Restaurant owners agree to remit payment to the platform
                according to the agreed commission structure and payment terms.
              </p>
              <p>
                Drivers will receive compensation as specified in the delivery
                acceptance and completed delivery confirmation.
              </p>
              <p>
                All transactions are subject to verification and may be reversed
                if fraudulent activity is detected.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, the platform shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including but not limited to damages for loss of
              profits, goodwill, use, data, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Prohibited Activities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to engage in any of the following prohibited
              activities:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Harassing, abusing, or threatening other users</li>
              <li>Posting offensive, illegal, or defamatory content</li>
              <li>
                Attempting to gain unauthorized access to accounts or systems
              </li>
              <li>
                Using the platform for illegal purposes or in violation of
                applicable laws
              </li>
              <li>Manipulating ratings, reviews, or user feedback</li>
              <li>Engaging in fraudulent transactions or chargebacks</li>
              <li>Operating multiple accounts for fraudulent purposes</li>
              <li>Interfering with platform operations or security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Dispute Resolution
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                In the event of a dispute between users, the platform will
                attempt to facilitate resolution through our support channels.
              </p>
              <p>
                Disputes regarding orders, payments, or deliveries should be
                reported within 24 hours of the incident.
              </p>
              <p>
                Our support team will review evidence and make a determination
                based on our policies and transaction records.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Termination of Service
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to terminate or suspend user accounts that
              violate these terms, engage in fraudulent activity, or pose a risk
              to other users or the platform. Termination may be immediate and
              without notice in cases of serious violations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting to the platform. Your
              continued use of the service constitutes acceptance of the modified
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us through our contact form or support channels available
              on the platform.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}