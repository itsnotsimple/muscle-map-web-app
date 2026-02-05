import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LogOut, Calendar, Mail, ShieldCheck } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();

  // Функция за красива дата (напр. 15 March 2024)
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <Header />
      
      <main className="flex-1 container mx-auto py-12 px-4 flex flex-col items-center">
        
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Header на профила */}
          <div className="bg-slate-800 p-8 text-center relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-800 text-4xl font-bold border-4 border-blue-500">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-white">{user?.email}</h1>
            
            {/* ТУК БЕШЕ PRO MEMBER - МАХНАХМЕ ГО */}
          </div>

          {/* Детайли */}
          <div className="p-8">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Account Details</h2>
            
            <div className="space-y-6">
              
              {/* Email Row */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase">Email Address</p>
                  <p className="text-slate-700 font-medium">{user?.email}</p>
                </div>
              </div>

              {/* Status Row */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase">Account Status</p>
                  <p className="text-green-600 font-bold flex items-center gap-1">
                    Active & Verified
                  </p>
                </div>
              </div>

              {/* НОВО: Member Since Row */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase">Member Since</p>
                  <p className="text-slate-700 font-medium">
                    {/* Тук ползваме createdAt от AuthContext */}
                    {user?.createdAt ? formatDate(user.createdAt) : "Just joined"}
                  </p>
                </div>
              </div>

            </div>

            {/* LOGOUT BUTTON */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-3 rounded-xl transition-all font-bold"
              >
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;