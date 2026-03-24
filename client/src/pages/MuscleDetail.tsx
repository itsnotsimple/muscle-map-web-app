import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, Dumbbell, MapPin, Clock, Info, Bookmark, Check } from "lucide-react";

const MuscleDetail = () => {
  const { t } = useTranslation();
  const { muscleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Използваме 'any' за данните от базата, за да не усложняваме с дълги интерфейси сега
  const [muscleData, setMuscleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Стейт за запазените, също масив от 'any'
  const [savedExercises, setSavedExercises] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const muscleRes = await fetch(`https://muscle-map-main.onrender.com/api/muscles/${muscleId}`);
        if (!muscleRes.ok) throw new Error("Muscle not found");
        const muscleJson = await muscleRes.json();
        setMuscleData(muscleJson);

        if (user) {
          const bookmarksRes = await fetch("https://muscle-map-main.onrender.com/api/user/bookmarks", {
            headers: { "Authorization": `Bearer ${user.token}` }
          });
          if (bookmarksRes.ok) {
            const bookmarksJson = await bookmarksRes.json();
            setSavedExercises(bookmarksJson);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [muscleId, user]);

  const handleBookmark = async (exercise: any) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const isAlreadySaved = savedExercises.some((e) => e.name === exercise.name);
    let newSavedList;
    
    if (isAlreadySaved) {
        newSavedList = savedExercises.filter((e) => e.name !== exercise.name);
    } else {
        newSavedList = [...savedExercises, { ...exercise, muscleGroup: muscleData.title }];
    }
    setSavedExercises(newSavedList);

    try {
      const response = await fetch("https://muscle-map-main.onrender.com/api/user/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
            exercise: { ...exercise, muscleGroup: muscleData.title } 
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }
      
      const updatedList = await response.json();
      setSavedExercises(updatedList);

    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const isSaved = (exerciseName: string) => {
    return savedExercises.some((e) => e.name === exerciseName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!muscleData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{t('detail.notFound')}</h2>
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 transition-colors">{t('detail.goBack')}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4 md:px-6">
        
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors font-medium">
          <ArrowLeft size={20} /> {t('detail.backToMap')}
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 mb-10 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
              <Dumbbell size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 capitalize transition-colors">
                {String(t(`db.${muscleData.title}`, muscleData.title))}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">
                {t('detail.completeGuide')}
              </p>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 transition-colors">
             <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 transition-colors">{t('detail.targetAnatomy')}</span>
             <div className="flex flex-wrap gap-2">
                {(muscleData.subTitle || String(t('detail.primaryMuscle'))).split(',').map((part: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-semibold shadow-sm transition-colors">
                    {String(t(`db.${part.trim()}`, part.trim()))}
                  </span>
                ))}
             </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 transition-colors">
           <span className="w-2 h-8 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
           {t('detail.exercises')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {muscleData.exercises && muscleData.exercises.length > 0 ? (
            muscleData.exercises.map((ex: any, index: number) => {
              const saved = isSaved(ex.name); 

            return (
                <div key={index} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all flex flex-col relative group">
                
                <button 
                    onClick={() => handleBookmark(ex)}
                    className={`absolute top-4 right-4 z-10 p-2.5 rounded-full shadow-md transition-all transform active:scale-90 ${
                    saved 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
                    }`}
                    title={saved ? t('detail.removeSaved') : t('detail.saveExercise')}
                >
                    {saved ? <Check size={18} strokeWidth={3} /> : <Bookmark size={18} />}
                </button>

                <div className="bg-slate-100 dark:bg-slate-800/50 aspect-video flex items-center justify-center relative overflow-hidden group transition-colors">
                    {ex.gif ? (
                        <img 
                        src={ex.gif} 
                        alt={ex.name} 
                        className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                        />
                    ) : (
                        <div className="text-slate-400 dark:text-slate-600 flex flex-col items-center transition-colors">
                            <Dumbbell size={48} className="opacity-20 mb-2" />
                            <span className="text-sm font-medium opacity-50">{t('detail.noGif')}</span>
                        </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-colors ${
                            ex.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            ex.difficulty === 'Advanced' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                            'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}>
                            {String(t(`db.${ex.difficulty}`, ex.difficulty || String(t('detail.general'))))}
                        </span>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">{String(t(`db.${ex.name}`, ex.name))}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed border-b border-slate-100 dark:border-slate-800 pb-4 transition-colors">
                        {String(t(`db.${ex.text}`, ex.text))}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 mb-6 transition-colors">
                        {ex.equipment && (
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded transition-colors">
                                <Clock size={14} /> <span>{String(t(`db.${ex.equipment}`, ex.equipment))}</span>
                            </div>
                        )}
                        {ex.location && (
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded transition-colors">
                                <MapPin size={14} /> <span className="text-blue-600 dark:text-blue-400 font-semibold transition-colors">{String(t(`db.${ex.location}`, ex.location))}</span>
                            </div>
                        )}
                    </div>

                    {ex.steps && ex.steps.length > 0 && (
                        <div className="mt-auto bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-50 dark:border-blue-900/30 transition-colors">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-3 transition-colors">
                                <Info size={14} /> {t('detail.execution')}
                            </div>
                            <ul className="space-y-2">
                                {ex.steps.map((step: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                                        <span className="font-bold text-blue-400 dark:text-blue-500 min-w-[20px] transition-colors">{i + 1}.</span>
                                        <span className="leading-snug">{String(t(`db.${step}`, step))}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                </div>
            );
          })
          ) : (
             <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
               <span className="text-slate-500 dark:text-slate-400 font-medium">{t('detail.noExercises', 'No exercises found.')}</span>
             </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default MuscleDetail;