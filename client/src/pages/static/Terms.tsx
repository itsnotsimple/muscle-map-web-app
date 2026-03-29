import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  const { t } = useTranslation();

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
            <h1 className="text-3xl font-black text-[#1b3061] dark:text-white uppercase tracking-tight text-center">Terms and Conditions</h1>
            <p className="text-sm text-slate-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">1. Acceptance of Terms</h2>
                <p>Welcome to Muscle Map. By accessing this web application, you agree to be bound by these Terms and Conditions and agree that you are responsible for compliance with any applicable local laws.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">2. Medical Disclaimer</h2>
                <p>The content provided by Muscle Map is for informational purposes only and is not absolute medical advice. Please consult a physician before beginning any diet or exercise program.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">3. User Accounts</h2>
                <p>You must ensure that any information you provide when creating an account is accurate. You are strictly responsible for safeguarding your password and any activities or actions under your account.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">4. Privacy Policy</h2>
                <p>Your privacy is important to us. Our Privacy Policy explains how we collect and use your information. We do not sell your personal data to third parties.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">5. Modifications</h2>
                <p>Muscle Map may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then-current version of these Terms and Conditions.</p>
            </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link to="/register" className="inline-block bg-[#274690] hover:bg-[#1f3770] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
                Back to Registration
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
