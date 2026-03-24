import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface MuscleInfoCardProps {
  muscleKey: string;
  onClose: () => void;
}

const MuscleInfoCard = ({ muscleKey, onClose }: MuscleInfoCardProps) => {
  const [muscleData, setMuscleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // 1. ТЕГЛИМ РЕАЛНИТЕ ДАННИ ОТ БАЗАТА
    setLoading(true);
    console.log(`📡 Fetching real DB data for: ${muscleKey}`);

    fetch(`https://electronic-nadiya-musclemap-a30e9055.koyeb.app/api/muscles/${muscleKey}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Data received:", data); // Виж конзолата (F12) да се увериш, че е от базата
        setMuscleData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [muscleKey]);

  if (loading) {
    return (
        <div className="fixed right-0 top-0 h-screen w-full md:w-[400px] bg-white dark:bg-slate-900 p-6 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 flex items-center justify-center transition-colors">
            <div className="text-purple-600 dark:text-purple-400 font-bold animate-pulse">{t('card.loading')}</div>
      </div>
    );
  }

  // Ако няма данни в базата за този мускул
  if (!muscleData) return null;

  // Взимаме първото упражнение от масива в базата (ако има)
  const exampleExercise = muscleData.exercises && muscleData.exercises.length > 0 
    ? muscleData.exercises[0] 
    : null;

  return (
    <div className="fixed right-0 top-0 h-screen w-full md:w-[400px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto z-50 animate-slide-in transition-colors">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
           {/* Взимаме заглавието от базата (напр. "Pectoralis Major") */}
           <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 transition-colors">{String(t(`db.${muscleData.title}`, muscleData.title))}</h2>
           <p className="text-sm text-slate-500 dark:text-slate-400 capitalize transition-colors">{t(`db.${muscleKey}`, muscleKey)} {t('card.training')}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => navigate(`/muscle/${muscleKey}`)}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-md font-bold transition-colors flex items-center gap-1"
            >
                ⚡ {t('card.expand')}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-bold text-xl px-2 transition-colors">
                ✕
            </button>
        </div>
      </div>

      {/* TARGET MUSCLES (SubTitle от базата) */}
      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl mb-6 transition-colors">
        <h3 className="text-purple-800 dark:text-purple-300 font-bold text-sm mb-2 transition-colors">{t('card.targetMuscles')}</h3>
        <ul className="list-disc pl-4 text-sm text-purple-700 dark:text-purple-400 space-y-1 transition-colors">
            <li className="font-semibold">{String(t(`db.${muscleData.title}`, muscleData.title))}</li>
            {/* Ако в базата има SubTitle, показваме го */}
            {muscleData.subTitle && muscleData.subTitle.split(',').map((part: string, index: number) => (
                <li key={index}>{String(t(`db.${part.trim()}`, part.trim()))}</li>
            ))}
        </ul>
      </div>

      {/* EXERCISES PREVIEW */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-purple-500 dark:text-purple-400">⚡</span>
        <h3 className="font-bold text-slate-700 dark:text-slate-300 transition-colors">{t('card.topExercise')}</h3>
        <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full font-bold transition-colors">
            {muscleData.exercises?.length || 0} {t('card.available')}
        </span>
      </div>

      {/* ПОКАЗВАМЕ ПЪРВОТО УПРАЖНЕНИЕ ОТ БАЗАТА */}
      {exampleExercise ? (
          <div 
            className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all cursor-pointer group" 
            onClick={() => navigate(`/muscle/${muscleKey}`)}
          >
              <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {String(t(`db.${exampleExercise.name}`, exampleExercise.name))}
                  </h4>
                  {exampleExercise.difficulty && (
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] px-2 py-1 rounded-full font-bold uppercase transition-colors">
                          {String(t(`db.${exampleExercise.difficulty}`, exampleExercise.difficulty))}
                      </span>
                  )}
              </div>
              
              {/* Описанието от базата */}
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 transition-colors">
                  {String(t(`db.${exampleExercise.text}`, exampleExercise.text)) || t('card.noDescription')}
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg transition-colors">
                       <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold transition-colors">{t('card.equipment')}</p>
                       <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold transition-colors">
                           {String(t(`db.${exampleExercise.equipment}`, exampleExercise.equipment)) || t('card.gym')}
                       </p>
                  </div>
              </div>

              {/* Стъпките от базата (показваме само първите 2) */}
              {exampleExercise.steps && exampleExercise.steps.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 transition-colors">
                      <p className="text-xs text-blue-800 dark:text-blue-400 font-bold mb-1 transition-colors">ⓘ {t('card.instructions')}</p>
                      <ol className="list-decimal pl-4 text-[11px] text-blue-700 dark:text-blue-300 space-y-1 transition-colors">
                          {exampleExercise.steps.slice(0, 2).map((step: string, i: number) => (
                              <li key={i}>{String(t(`db.${step}`, step))}</li>
                          ))}
                          {exampleExercise.steps.length > 2 && (
                              <li className="italic text-blue-500 dark:text-blue-400 transition-colors">{t('card.clickToSee', { count: exampleExercise.steps.length - 2 })}</li>
                          )}
                      </ol>
                  </div>
              )}
          </div>
      ) : (
          <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 transition-colors">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('card.noExercises')}</p>
          </div>
      )}

      <button 
        onClick={() => navigate(`/muscle/${muscleKey}`)}
        className="w-full mt-6 bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition-all shadow-lg flex justify-center items-center gap-2"
      >
        <span>{t('card.viewFullGuide')}</span>
        <span>→</span>
      </button>

    </div>
  );
};

export default MuscleInfoCard;