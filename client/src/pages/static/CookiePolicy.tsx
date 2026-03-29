import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CookiePolicy = () => {
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
          <h1 className="text-3xl font-black text-[#1b3061] dark:text-white uppercase tracking-tight">Cookie Policy</h1>
          <p className="text-sm text-slate-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">1. What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device by your web browser. They help websites remember information about your visit, making your next visit easier and the site more useful to you.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">2. How We Use Cookies & Local Storage</h2>
            <p>Muscle Map primarily uses <strong>browser localStorage</strong> (similar to cookies) for essential functionality:</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                    <th className="py-2 pr-4 font-bold text-slate-700 dark:text-slate-300">Data</th>
                    <th className="py-2 pr-4 font-bold text-slate-700 dark:text-slate-300">Purpose</th>
                    <th className="py-2 font-bold text-slate-700 dark:text-slate-300">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2 pr-4">JWT Token</td>
                    <td className="py-2 pr-4">Keeps you logged in</td>
                    <td className="py-2"><span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">Essential</span></td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Theme preference</td>
                    <td className="py-2 pr-4">Remembers dark/light mode</td>
                    <td className="py-2"><span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">Essential</span></td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Language preference</td>
                    <td className="py-2 pr-4">Remembers EN/BG choice</td>
                    <td className="py-2"><span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">Essential</span></td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Cookie consent</td>
                    <td className="py-2 pr-4">Remembers your cookie choice</td>
                    <td className="py-2"><span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">Essential</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">3. Third-Party Cookies</h2>
            <p>The following third-party services may set their own cookies:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Stripe</strong> — Sets cookies for fraud prevention during payment processing. These are strictly necessary for secure transactions.</li>
              <li><strong>Google OAuth</strong> — If you sign in with Google, Google may set authentication cookies on its own domain.</li>
              <li><strong>Vercel Analytics</strong> — Collects anonymous, aggregated performance data. No personally identifiable cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">4. No Advertising or Tracking Cookies</h2>
            <p className="font-semibold">Muscle Map does NOT use:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Advertising cookies (Google Ads, Facebook Pixel, etc.)</li>
              <li>Social media tracking cookies</li>
              <li>Cross-site tracking or retargeting cookies</li>
              <li>Any cookies that profile you for marketing purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">5. Managing Cookies</h2>
            <p>You can clear localStorage and cookies at any time through your browser settings. Note that clearing your authentication token will log you out, and clearing preferences will reset your theme and language settings.</p>
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

export default CookiePolicy;
