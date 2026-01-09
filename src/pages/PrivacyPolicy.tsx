import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-8">Last updated: January 9, 2026</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our food delivery
              platform, including our website and mobile applications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Personal Information You Provide:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Name and email address</li>
                  <li>
                    Phone number and phone number type (WhatsApp/SMS/Both)
                  </li>
                  <li>Account type (Customer, Restaurant, Driver, Admin)</li>
                  <li>Password (encrypted)</li>
                  <li>Profile picture and cover picture</li>
                  <li>Delivery address and location data</li>
                  <li>Payment information and billing details</li>
                  <li>
                    Bank account information (for restaurant and driver payouts)
                  </li>
                  <li>Driver license and vehicle information (drivers only)</li>
                  <li>Business licenses and tax information (restaurants)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Automatically Collected Information:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>IP address and browser type</li>
                  <li>Device information and unique identifiers</li>
                  <li>Log data and usage patterns</li>
                  <li>Location data (with your permission)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Search history and browsing behavior</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Third-Party Information:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Payment processor data (Paystack/payment gateways)</li>
                  <li>Bank verification data</li>
                  <li>reCAPTCHA verification data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>To create and maintain your account</li>
              <li>To process orders and payments</li>
              <li>To facilitate delivery and tracking</li>
              <li>To communicate with you about orders and account status</li>
              <li>To verify your identity and prevent fraud</li>
              <li>
                To send promotional emails and notifications (with consent)
              </li>
              <li>To improve our platform and user experience</li>
              <li>To conduct analytics and market research</li>
              <li>To comply with legal obligations</li>
              <li>To resolve disputes and customer support issues</li>
              <li>To monitor platform security and prevent abuse</li>
              <li>To calculate commissions and driver payments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. How We Share Your Information
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>We share your information in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>With Other Users:</strong> Customers share delivery
                  addresses and phone numbers with restaurant and driver
                  accounts necessary to complete orders. Restaurants and drivers
                  may see customer contact information.
                </li>
                <li>
                  <strong>With Service Providers:</strong> Payment processors,
                  hosting providers, analytics services, and customer support
                  tools.
                </li>
                <li>
                  <strong>With Legal Authorities:</strong> When required by law,
                  court order, or government request.
                </li>
                <li>
                  <strong>For Business Transfers:</strong> In case of merger,
                  acquisition, or sale of assets.
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly
                  authorize sharing of your information.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We implement industry-standard security measures to protect your
                personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Encrypted transmission of sensitive data (SSL/TLS)</li>
                <li>Secure password storage using encryption</li>
                <li>Secure API connections</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
              </ul>
              <p>
                However, no security system is completely impenetrable. While we
                strive to protect your information, we cannot guarantee absolute
                security.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your
              experience, remember your preferences, and analyze platform usage.
              You can control cookie settings through your browser, but this may
              limit platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Location Data
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                For drivers, we collect location data in real-time during active
                deliveries to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Track delivery status</li>
                <li>Provide accurate ETAs to customers</li>
                <li>Optimize routes and delivery efficiency</li>
                <li>Ensure driver safety</li>
              </ul>
              <p>
                Location sharing is only active during delivery assignments and
                can be disabled when not delivering.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Third-Party Services
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Our platform integrates with third-party services for payment
                processing, analytics, and communication. These services have
                their own privacy policies. We recommend reviewing them:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Paystack (Payment Processing)</li>
                <li>Google (Authentication, Analytics)</li>
                <li>reCAPTCHA (Security)</li>
                <li>React Query (Data Management)</li>
              </ul>
              <p>
                We are not responsible for the privacy practices of these
                third-party services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Data Retention
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                policy. Information retained includes:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Active Accounts:</strong> Maintained while your
                  account is active
                </li>
                <li>
                  <strong>Order History:</strong> Retained for 5 years for
                  dispute resolution and compliance
                </li>
                <li>
                  <strong>Deleted Accounts:</strong> Personal data deleted
                  within 30 days, transaction records retained as required by
                  law
                </li>
                <li>
                  <strong>Communication Records:</strong> Retained for 1 year
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to delete your account and associated data</li>
              <li>Right to export your data</li>
              <li>Right to opt-out of marketing communications</li>
              <li>Right to restrict data processing</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us through our support channels
              or the contact form on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform is not intended for users under 18 years of age. We
              do not knowingly collect personal information from children. If we
              become aware that a child has provided us with personal
              information, we will delete such information and terminate the
              child's account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. International Data Transfer
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to, stored in, and processed
              in countries other than your country of residence. These countries
              may have data protection laws that differ from your home country.
              By using our platform, you consent to the transfer of your
              information to countries outside your country of residence.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Changes to Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy to reflect changes in our
              practices or for other operational, legal, or regulatory reasons.
              We will notify you of material changes by posting the updated
              policy and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or our privacy
              practices, please contact us using the contact form available on
              our platform or through our support channels.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
