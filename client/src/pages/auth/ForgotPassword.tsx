import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { ApiService } from '../../services/api';
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage("");

    try {
      const res = await ApiService.forgotPassword(email);
      
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to send reset link');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage("Network error occurred.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative font-sans transition-colors">
      <Link to="/" className="absolute top-8 left-8 p-3 bg-white dark:bg-slate-900 rounded-full shadow-md text-slate-800 dark:text-white hover:scale-110 transition-transform">
        <ArrowLeft size={24} />
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 relative z-10 transition-colors">
          
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-800/50">
            <Mail className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Reset Password</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>

          {status === 'success' ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 p-4 rounded-xl text-center">
              <p className="text-sm font-bold text-green-700 dark:text-green-400">
                {message}
              </p>
              <Link to="/login" className="block mt-4 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-semibold border border-red-100 dark:border-red-900/30 transition-colors">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:border-blue-500 transition-colors outline-none text-sm placeholder-slate-400 font-medium"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all text-sm mt-4 bg-[#274690] hover:bg-[#1f3770] shadow-md flex justify-center items-center"
              >
                {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </button>

              <div className="text-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/login" className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                  Nevermind, I remembered it
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
