import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LogOut, Calendar, Mail, ShieldCheck, Activity, Trash2 } from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
        const res = await fetch(`https://muscle-map-main.onrender.com/api/user/profile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // fallback if token state isn't directly exposed
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ password: deletePassword })
        });
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.message || 'Deletion failed');
        }

        logout();
    } catch (err: any) {
        setDeleteError(err.message);
    } finally {
        setIsDeleting(false);
    }
  };

  // Функция за красива дата (напр. 15 March 2024)
  const formatDate = (dateString: string) => {
    if (!dateString) return t('profile.unknown');
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans transition-colors">
      <Header />
      
      <main className="flex-1 container mx-auto py-12 px-4 flex flex-col items-center">
        
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
          
          {/* Header на профила */}
          <div className="bg-slate-800 dark:bg-slate-950 p-8 text-center relative transition-colors">
            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-800 dark:text-slate-100 text-4xl font-bold border-4 border-blue-500 transition-colors">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-white">{user?.email}</h1>
            
            {/* ТУК БЕШЕ PRO MEMBER - МАХНАХМЕ ГО */}
          </div>

          {/* Детайли */}
          <div className="p-8">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-800 pb-2 transition-colors">{t('profile.accountDetails')}</h2>
            
            <div className="space-y-6">
              
              {/* Email Row */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase transition-colors">{t('profile.emailAddress')}</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium transition-colors">{user?.email}</p>
                </div>
              </div>

              {/* Status Row */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 transition-colors">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase transition-colors">{t('profile.accountStatus')}</p>
                  {user?.isVerified || (user?.authProvider && user.authProvider !== 'local') ? (
                      <p className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1 transition-colors">
                        {t('profile.activeVerified', 'Active & Verified')}
                      </p>
                  ) : (
                      <p className="text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1 transition-colors">
                        {t('profile.pendingVerification', 'Pending Verification')}
                      </p>
                  )}
                </div>
              </div>

              {/* НОВО: Member Since Row */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 transition-colors">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase transition-colors">{t('profile.memberSince')}</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium transition-colors">
                    {/* Тук ползваме createdAt от AuthContext */}
                    {user?.createdAt ? formatDate(user.createdAt) : t('profile.justJoined')}
                  </p>
                </div>
              </div>

              {/* НОВО: Physical Profile Row */}
              {user?.physicalProfile && user.physicalProfile.age ? (
                  <div className="flex items-start gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/40 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 transition-colors">
                      <Activity size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase mb-2 transition-colors">{t('profile.physicalProfile', 'Physical Profile')}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg transition-colors">
                             <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">{t('diet.gender', 'Gender')}</p>
                             <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{t(`diet.${user.physicalProfile.gender}`, user.physicalProfile.gender)}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg transition-colors">
                             <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">{t('diet.age', 'Age')}</p>
                             <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.physicalProfile.age}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg transition-colors">
                             <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">{t('diet.weight', 'Weight (kg)')}</p>
                             <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.physicalProfile.weight} kg</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg transition-colors">
                             <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">{t('diet.height', 'Height (cm)')}</p>
                             <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.physicalProfile.height} cm</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg transition-colors col-span-2 md:col-span-1">
                             <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">{t('diet.activity', 'Activity Level')}</p>
                             <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{t(`diet.${user.physicalProfile.activityLevel}`, user.physicalProfile.activityLevel.replace('_', ' '))}</p>
                          </div>
                      </div>
                    </div>
                  </div>
              ) : (
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 transition-colors">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase transition-colors">{t('profile.physicalProfile', 'Physical Profile')}</p>
                      <p className="text-slate-700 dark:text-slate-300 font-medium transition-colors italic opacity-60">
                        {t('profile.noPhysicalProfile', 'Not entered yet')}
                      </p>
                    </div>
                  </div>
              )}

            </div>

            {/* DELETE ACCOUNT */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
              {!showDeleteConfirm ? (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 py-3 rounded-xl transition-all font-bold"
                  >
                    <Trash2 size={20} /> {t('profile.deleteAccount', 'Delete Account')}
                  </button>
              ) : (
                  <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-xl border border-red-200 dark:border-red-900/50">
                     <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-4">{t('profile.confirmDeleteDesc', 'Are you sure you want to permanently delete your account? This action cannot be reversed.')}</p>
                     
                     {(!user?.authProvider || user?.authProvider === 'local') && (
                         <input 
                            type="password"
                            placeholder={t('profile.enterPassword', 'Enter your password to confirm')}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg mb-4 shadow-sm outline-none font-medium dark:text-white"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                         />
                     )}
                     
                     {deleteError && <p className="text-xs text-red-600 dark:text-red-400 mb-3 font-bold bg-red-100 dark:bg-red-900/30 p-2 rounded-md">{deleteError}</p>}

                     <div className="flex gap-3">
                         <button 
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg shadow-sm transition-colors"
                         >
                            {isDeleting ? '...' : t('profile.confirmDelete', 'Confirm Delete')}
                         </button>
                         <button 
                            onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); setDeleteError(""); }}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-lg transition-colors"
                         >
                            {t('profile.cancel', 'Cancel')}
                         </button>
                     </div>
                  </div>
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 py-3 rounded-xl transition-all font-bold"
              >
                <LogOut size={20} /> {t('profile.signOut', 'Sign Out')}
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