import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Bookmark, Lock, Trash2, ArrowRight, X, Check } from "lucide-react";

// --- КОМПОНЕНТ ЗА ЕДИНИЧНА КАРТА ---
const BookmarkCard = ({ ex, onRemove, onNavigate }: any) => {
    const { t } = useTranslation();
    const [isConfirming, setIsConfirming] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsConfirming(true);
    };

    const handleConfirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(ex._id);
    };

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsConfirming(false);
    };

    return (
        <div 
            onClick={() => onNavigate(ex.muscleGroup || "chest")}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group relative flex flex-col justify-between h-full"
        >
            <div>
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
                      {String(t(`db.${ex.name}`, ex.name))}
                    </h3>
                    <div className="flex gap-2 mt-2">
                       <span className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                          ex.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          ex.difficulty === 'Advanced' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                       }`}>
                          {String(t(`db.${ex.difficulty}`, ex.difficulty || String(t('detail.general'))))}
                       </span>
                    </div>
                  </div>
                  <span className="bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded transition-colors">
                    {String(t(`db.${ex.muscleGroup}`, ex.muscleGroup))}
                  </span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800/50 min-h-[40px] transition-colors">
                {!isConfirming ? (
                    <>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {t('bookmarks.viewWorkout')} <ArrowRight size={12} />
                        </span>
                        
                        <button 
                            onClick={handleDeleteClick}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title={t('bookmarks.remove')}
                        >
                            <Trash2 size={18} />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center justify-between w-full bg-red-50 dark:bg-red-900/20 p-1 rounded-lg animate-in fade-in zoom-in duration-200 transition-colors">
                        <span className="text-xs text-red-600 dark:text-red-400 font-bold ml-2">{t('bookmarks.confirmDelete')}</span>
                        <div className="flex gap-1">
                            <button 
                                onClick={handleConfirmDelete}
                                className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                title={t('bookmarks.confirm')}
                            >
                                <Check size={14} />
                            </button>
                            <button 
                                onClick={handleCancelDelete}
                                className="p-1.5 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                title={t('bookmarks.cancel')}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- ОСНОВНА СТРАНИЦА ---
const Bookmarks = () => {
  const { user, updateUser } = useAuth(); 
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [savedExercises, setSavedExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. ВАЖНО: ТЕГЛИМ ДАННИТЕ ОТ СЪРВЪРА ПРИ ВСЯКО ОТВАРЯНЕ
  useEffect(() => {
    const fetchBookmarks = async () => {
        if (!user || !user.token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("https://muscle-map-main.onrender.com/api/user/bookmarks", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Проверка дали е масив
                if (Array.isArray(data)) {
                    setSavedExercises(data);
                    // Синхронизираме и Context-а, за да са актуални данните навсякъде
                    if (updateUser) updateUser({ savedExercises: data });
                }
            } else {
                console.error("Грешка при зареждане");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchBookmarks();
  }, [user?.token]); // Зависимост само от токена

  // 2. ТРИЕНЕ
  const removeBookmark = async (id: string) => {
     try {
        const response = await fetch(`https://muscle-map-main.onrender.com/api/user/bookmarks/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user?.token}`,
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Ако сървърът върне новия списък, ползваме него
            if (Array.isArray(data)) {
                setSavedExercises(data);
                if (updateUser) updateUser({ savedExercises: data });
            } else {
                // Иначе трием локално
                const newList = savedExercises.filter(ex => ex._id !== id);
                setSavedExercises(newList);
                if (updateUser) updateUser({ savedExercises: newList });
            }
        } 
     } catch (err) {
        console.error("Error removing:", err);
     }
  };

  const handleNavigate = (muscleGroup: string) => {
      const muscleKey = muscleGroup ? muscleGroup.toLowerCase().replace(" ", "_") : "chest";
      navigate(`/muscle/${muscleKey}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {!user ? (
            <div className="max-w-xl mx-auto text-center mt-12 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                    <Lock className="text-slate-400 dark:text-slate-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 transition-colors">{t('bookmarks.loginRequired')}</h2>
                <div className="flex justify-center gap-4">
                    <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md">{t('header.login')}</Link>
                </div>
            </div>
        ) : (
            <>
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400 transition-colors">
                        <Bookmark size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{t('bookmarks.myCollection')}</h1>
                </div>

                {loading ? (
                   <div className="text-center py-20">
                       <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                   </div>
                ) : (
                   Array.isArray(savedExercises) && savedExercises.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {savedExercises.map((ex) => (
                            <BookmarkCard 
                                key={ex._id || Math.random()} 
                                ex={ex} 
                                onRemove={removeBookmark} 
                                onNavigate={handleNavigate} 
                            />
                          ))}
                       </div>
                   ) : (
                       <div className="bg-white dark:bg-slate-900 p-10 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center transition-colors">
                          <p className="text-slate-500 dark:text-slate-400 mb-4 transition-colors">{t('bookmarks.noExercises')}</p>
                          <Link to="/" className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors">{t('bookmarks.goToMap')}</Link>
                       </div>
                   )
                )}
            </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Bookmarks;