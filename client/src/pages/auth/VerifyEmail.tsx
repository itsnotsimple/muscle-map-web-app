import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ApiService } from "../../services/api";

const VerifyEmail = () => {
  const { token } = useParams<{token: string}>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { user, updateUser } = useAuth();
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;
      
      try {
        const res = await ApiService.verifyEmail(token);
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message);
          
          if (user) {
              updateUser({ isVerified: true });
          }
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error occurred during verification');
      }
    };
    verifyToken();
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative font-sans transition-colors">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-10 max-w-sm w-full text-center shadow-lg border-t-4 border-blue-600">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Verifying Email...</h2>
            </div>
          )}
          {status === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">Verified!</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">{message}</p>
              <Link to="/login" className="bg-[#274690] hover:bg-[#1f3770] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md w-full">Login</Link>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center">
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">Verification Failed</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">{message}</p>
              <Link to="/" className="text-[#274690] dark:text-blue-400 font-bold hover:underline">Return Home</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
