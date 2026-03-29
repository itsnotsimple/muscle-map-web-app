import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-[#E5ECEF] dark:bg-slate-950 py-12 px-4 transition-colors">
      <Link to="/" className="absolute top-8 left-8 p-3 bg-white dark:bg-slate-900 rounded-full shadow-md text-slate-800 dark:text-white hover:scale-110 transition-transform z-50">
        <ArrowLeft size={24} />
      </Link>
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 md:p-12 text-slate-800 dark:text-slate-200">
        <div className="flex flex-col items-center mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95 mb-4">
            <img src="/images/logo.png" alt="Muscle Map" className="h-14 w-auto drop-shadow-sm" />
          </Link>
          <h1 className="text-3xl font-black text-[#1b3061] dark:text-white uppercase tracking-tight">Refund Policy</h1>
          <p className="text-sm text-slate-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">1. Digital Product — No Physical Goods</h2>
            <p>Muscle Map Premium is a digital subscription service that grants immediate access to premium features including unlimited AI workout plans, unlimited chatbot messages, and unlimited exercise bookmarks. No physical products are shipped.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">2. Refund Eligibility</h2>
            <p>Due to the nature of digital content, <strong>refunds are generally not provided</strong> once you have accessed Premium features. However, we understand that issues can arise:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Technical issues</strong> — If you were charged but never received access to Premium features due to a technical error, you are entitled to a full refund.</li>
              <li><strong>Duplicate charges</strong> — If you were accidentally charged more than once, we will refund any duplicate payments.</li>
              <li><strong>Within 48 hours</strong> — If you request a refund within 48 hours of purchase and have not extensively used Premium features, we may issue a refund at our discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">3. How to Request a Refund</h2>
            <p>To request a refund, please contact us at <strong>musclemap@yahoo.com</strong> with:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your account email address.</li>
              <li>The date of purchase.</li>
              <li>A brief description of the issue.</li>
            </ul>
            <p className="mt-2">We aim to respond to all refund requests within <strong>3 business days</strong>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">4. Payment Processing</h2>
            <p>All payments are securely processed through <strong>Stripe</strong>. Muscle Map does not store your credit card information. Approved refunds will be credited back to the original payment method within 5-10 business days, depending on your bank.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">5. Cancellation</h2>
            <p>Muscle Map Premium is a <strong>one-time lifetime purchase</strong>, not a recurring subscription. There is no monthly fee to cancel. Once purchased, Premium access remains active on your account permanently.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">6. Contact</h2>
            <p>For any billing-related questions, reach us at <strong>musclemap@yahoo.com</strong> or use the <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact page</Link>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <Link to="/" className="inline-block bg-[#274690] hover:bg-[#1f3770] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
