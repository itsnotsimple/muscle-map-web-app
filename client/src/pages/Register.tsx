import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
);

const MWMWLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-[#274690] dark:text-blue-400">
      <path d="M4 18L12 4L20 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 10L12 18L20 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Register = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Import from context instead of redirecting so Google registers + logs in instantly

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        try {
            setError("");
            setIsSubmitting(true);
            const response = await fetch("https://muscle-map-main.onrender.com/api/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ access_token: tokenResponse.access_token }),
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Server Error`);
            
            // Google Registration automatically verifies and logs in the user
            login(data.token, data.user);
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Google Authentication failed");
        } finally {
            setIsSubmitting(false);
        }
    },
    onError: () => setError("Google Signup was canceled or failed."),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
        setError("You must accept the Terms and Conditions to register.");
        return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("https://muscle-map-main.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5ECEF] dark:bg-slate-950 flex shadow-inner flex-col items-center justify-center py-10 px-4 font-sans transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-[440px] p-10 transition-colors border-t-8 border-transparent dark:border-t-slate-800">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-center">
            <Link to="/" className="inline-block mb-4 transition-transform hover:scale-105 active:scale-95 group" title="Return Home">
                <img src="/images/logo.png" alt="Muscle Map" className="h-[52px] w-auto drop-shadow-sm group-hover:drop-shadow-md transition-all object-contain" />
            </Link>
            <h1 className="text-[22px] font-black text-[#1b3061] dark:text-white tracking-tight uppercase mb-1 leading-snug">Muscle Map</h1>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-2 mb-2">{t('auth.createAccount', 'Create Account')}</h2>
        </div>

        {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-6 text-sm text-center border border-red-100 dark:border-red-900/30 transition-colors">
              {error}
            </div>
        )}

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mb-8">
            <button 
                type="button" 
                onClick={() => handleGoogleLogin()}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 border border-slate-300 dark:border-slate-700 font-semibold py-2.5 rounded-md transition-all text-sm shadow-sm"
            >
                <GoogleIcon />
                Sign up with Google
            </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6 opacity-70">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
            <span className="mx-4 text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500 uppercase">Or register with email</span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full px-1 py-1.5 bg-transparent border-b-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-blue-600 dark:focus:border-blue-500 transition-colors outline-none text-sm placeholder-slate-400"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                className="w-full px-1 py-1.5 bg-transparent border-b-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-blue-600 dark:focus:border-blue-500 transition-colors outline-none text-sm placeholder-slate-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-3 mt-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                        type="checkbox" 
                        required
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                        checked={acceptedTerms}
                        onChange={() => setAcceptedTerms(!acceptedTerms)}
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                        I accept the <Link to="/terms" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">Terms and Conditions</Link>
                    </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                        type="checkbox" 
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                        checked={newsletter}
                        onChange={() => setNewsletter(!newsletter)}
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                        Get updates, newsletter, and promotional materials via email.
                    </span>
                </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-md font-bold text-white transition-all text-sm mt-8 ${
                 isSubmitting ? "bg-slate-400 dark:bg-slate-600 cursor-not-allowed" : "bg-[#274690] hover:bg-[#1f3770] shadow-md"
              }`}
            >
              {isSubmitting ? t('auth.creating', 'Creating account...') : 'Register'}
            </button>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Already have an account? <Link to="/login" className="text-[#274690] dark:text-[#567ecd] hover:underline font-bold transition-all ml-1">Login Here</Link>
                </p>
            </div>
        </form>

      </div>
    </div>
  );
};

export default Register;