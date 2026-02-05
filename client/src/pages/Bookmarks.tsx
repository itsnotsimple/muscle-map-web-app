import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Bookmark, Lock, Trash2, ArrowRight, X, Check } from "lucide-react";

// --- КОМПОНЕНТ ЗА ЕДИНИЧНА КАРТА ---
const BookmarkCard = ({ ex, onRemove, onNavigate }: any) => {
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
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group relative flex flex-col justify-between h-full"
        >
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                        {ex.name}
                    </h3>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-bold uppercase">
                        {ex.muscleGroup}
                    </span>
                </div>
                
                <div className="flex gap-2 mt-2 mb-4">
                    {ex.difficulty && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {ex.difficulty}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 min-h-[40px]">
                {!isConfirming ? (
                    <>
                        <span className="text-xs text-blue-600 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Workout <ArrowRight size={12} />
                        </span>
                        
                        <button 
                            onClick={handleDeleteClick}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove"
                        >
                            <Trash2 size={18} />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center justify-between w-full bg-red-50 p-1 rounded-lg animate-in fade-in zoom-in duration-200">
                        <span className="text-xs text-red-600 font-bold ml-2">Delete?</span>
                        <div className="flex gap-1">
                            <button 
                                onClick={handleConfirmDelete}
                                className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                title="Confirm"
                            >
                                <Check size={14} />
                            </button>
                            <button 
                                onClick={handleCancelDelete}
                                className="p-1.5 bg-white text-slate-500 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                                title="Cancel"
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
            const response = await fetch("http://localhost:5000/api/user/bookmarks", {
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
        const response = await fetch(`http://localhost:5000/api/user/bookmarks/${id}`, {
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
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {!user ? (
            <div className="max-w-xl mx-auto text-center mt-12 p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="text-slate-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">Login Required</h2>
                <div className="flex justify-center gap-4">
                    <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md">Log In</Link>
                </div>
            </div>
        ) : (
            <>
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <Bookmark size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">My Collection</h1>
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
                       <div className="bg-white p-10 rounded-xl border border-dashed border-slate-300 text-center">
                          <p className="text-slate-500 mb-4">No exercises saved yet.</p>
                          <Link to="/" className="text-blue-600 font-bold hover:underline">Go to Map</Link>
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