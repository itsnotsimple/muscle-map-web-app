import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
            <h1 className="text-3xl font-black text-[#1b3061] dark:text-white uppercase tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-slate-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">1. Information We Collect</h2>
                <p>When you create an account on Muscle Map, we collect the following personal information:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Email address</strong> — used for authentication, account verification, and password recovery.</li>
                    <li><strong>Password</strong> — securely hashed using bcrypt before storage. We never store plain-text passwords.</li>
                    <li><strong>Physical profile data</strong> (age, gender, height, weight, activity level) — provided voluntarily for calorie calculations and AI-powered workout plans.</li>
                    <li><strong>Google account data</strong> — if you sign in with Google, we receive your email and display name from Google's OAuth service.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">2. How We Use Your Data</h2>
                <p>Your data is used exclusively to provide and improve the Muscle Map platform:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Authenticate your identity and secure your account.</li>
                    <li>Generate personalized diet plans and workout recommendations.</li>
                    <li>Power the AI fitness coach with context about your fitness profile.</li>
                    <li>Track your exercise bookmarks, badges, and gamification progress.</li>
                </ul>
                <p className="mt-2 font-semibold">We do NOT sell, rent, or share your personal data with third parties for marketing purposes.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">3. AI & Third-Party Services</h2>
                <p>Muscle Map uses <strong>Groq AI</strong> (LLaMA model) to power the fitness chatbot and workout plan generator. When you interact with the AI:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Your messages are sent to Groq's API for processing.</li>
                    <li>No personal health data is stored by Groq — only real-time message processing occurs.</li>
                    <li>We do not send your email, password, or account credentials to any AI service.</li>
                </ul>
                <p className="mt-2">We also use <strong>Vercel Analytics</strong> and <strong>Speed Insights</strong> for anonymous, aggregated performance monitoring. No personally identifiable information is shared with Vercel.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">4. Data Storage & Security</h2>
                <ul className="list-disc pl-5 space-y-1">
                    <li>All data is stored in a <strong>MongoDB</strong> database with encrypted connections.</li>
                    <li>Passwords are hashed with <strong>bcrypt</strong> (cost factor 10).</li>
                    <li>Authentication uses <strong>JWT tokens</strong> with a 7-day expiration.</li>
                    <li>API endpoints are protected by <strong>rate limiting</strong> to prevent abuse.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">5. Cookies & Local Storage</h2>
                <p>Muscle Map uses browser <strong>localStorage</strong> to persist:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Your JWT authentication token (to keep you logged in).</li>
                    <li>Theme preference (dark/light mode).</li>
                    <li>Language preference (English/Bulgarian).</li>
                </ul>
                <p className="mt-2">We do not use third-party tracking cookies. No advertising cookies are used on this platform.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Access</strong> your personal data at any time through your Profile page.</li>
                    <li><strong>Update</strong> your physical profile and account information.</li>
                    <li><strong>Delete</strong> your account — contact us and we will permanently remove all your data.</li>
                    <li><strong>Withdraw consent</strong> for data processing at any time.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">7. Children's Privacy</h2>
                <p>Muscle Map is not intended for children under the age of 16. We do not knowingly collect personal information from minors. If you believe a child has provided us with personal data, please contact us immediately.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">8. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated "Last updated" date. Continued use of the platform after changes constitutes acceptance of the revised policy.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">9. Contact</h2>
                <p>If you have questions about this Privacy Policy or your personal data, please reach out at <strong>musclemap@yahoo.com</strong> or use our <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact page</a>.</p>
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

export default PrivacyPolicy;
