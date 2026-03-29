import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { ApiService } from "../../services/api";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
        setStatus('error');
        setMessage("Passwords do not match");
        return;
    }

    if (password.length < 6) {
        setStatus('error');
        setMessage("Password must be at least 6 characters long");
        return;
    }

    setStatus('loading');
    setMessage("");

    try {
      const res = await ApiService.resetPassword(token as string, password);
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => {
            navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to reset password');
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
            <KeyRound className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Create New Password</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Your new password must be different from previous used passwords and at least 6 characters long.
          </p>

          {status === 'success' ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 p-4 rounded-xl text-center">
              <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">
                {message}
              </p>
              <p className="text-xs font-semibold text-slate-500">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === 'error' && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-semibold border border-red-100 dark:border-red-900/30 transition-colors">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:border-blue-500 transition-colors outline-none text-sm placeholder-slate-400 font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:border-blue-500 transition-colors outline-none text-sm placeholder-slate-400 font-medium"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all text-sm mt-6 bg-[#274690] hover:bg-[#1f3770] shadow-md flex justify-center items-center"
              >
                {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
