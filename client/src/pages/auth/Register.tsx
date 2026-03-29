import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import AnimatedContent from "../../components/reactbits/AnimatedContent";
import { ApiService } from "../../services/api";
import { ArrowLeft } from "lucide-react";
import GoogleIcon from "../../components/ui/GoogleIcon";

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

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Import from context instead of redirecting so Google registers + logs in instantly

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        try {
            setError("");
            setIsSubmitting(true);
            const response = await ApiService.googleLogin(tokenResponse.access_token);
            
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
      const response = await ApiService.register({ email, password });

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
    <div className="min-h-screen bg-transparent relative flex shadow-inner flex-col items-center justify-center py-10 px-4 font-sans transition-colors">
      <Link to="/" className="absolute top-8 left-8 p-3 bg-white dark:bg-slate-900 rounded-full shadow-md text-slate-800 dark:text-white hover:scale-110 transition-transform z-50">
        <ArrowLeft size={24} />
      </Link>
      <AnimatedContent
        distance={40}
        direction="vertical"
        duration={1}
        ease="back.out(1.5)"
        scale={0.9}
        threshold={0}
      >
        <div className="backdrop-blur-3xl bg-white/70 dark:bg-slate-900/70 rounded-[2rem] shadow-2xl dark:shadow-blue-900/10 w-full max-w-[440px] p-10 transition-colors border border-white/20 dark:border-slate-700/50">
          
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
      </AnimatedContent>
    </div>
  );
};

export default Register;