import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SpotlightCard from '../reactbits/SpotlightCard';
import { ApiService } from '../../services/api';

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
    setLoading(true);

    ApiService.getMuscleDetails(muscleKey)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
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
        <div className="fixed right-0 top-0 h-screen w-full md:w-[400px] bg-white dark:bg-slate-900 p-6 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-[1000] flex items-center justify-center transition-colors">
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
    <div className="fixed inset-0 z-[1000] md:right-0 md:left-auto md:top-0 md:h-screen md:w-[420px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.08)] dark:shadow-[-20px_0_50px_rgba(0,0,0,0.4)] border-l border-white/50 dark:border-slate-700/50 p-7 overflow-y-auto animate-in fade-in slide-in-from-right-full duration-500 transition-all custom-scrollbar flex flex-col">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-8 shrink-0 relative pt-2">
        <div className="pr-10">
           {/* Взимаме заглавието от базата (напр. "Pectoralis Major") */}
           <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight mb-0.5">{String(t(`db.${muscleData.title}`, muscleData.title))}</h2>
           <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{t(`db.${muscleKey}`, muscleKey)} {t('card.training')}</p>
        </div>
        <button onClick={onClose} className="absolute right-0 top-0 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 backdrop-blur-sm font-bold shadow-sm p-2.5 transition-all hover:rotate-90">
            ✕
        </button>
      </div>

      {/* TARGET MUSCLES (SubTitle от базата) */}
      <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-2xl mb-8 backdrop-blur-sm border border-blue-100/60 dark:border-blue-800/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)] shrink-0">
        <h3 className="text-blue-900 dark:text-blue-300 font-bold text-sm mb-3 tracking-wide uppercase text-[11px] flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            {t('card.targetMuscles')}
        </h3>
        <ul className="list-disc pl-5 text-[13px] text-blue-800/80 dark:text-blue-300/80 space-y-2 font-medium">
            <li className="font-semibold text-blue-900 dark:text-blue-200">{String(t(`db.${muscleData.title}`, muscleData.title))}</li>
            {/* Ако в базата има SubTitle, показваме го */}
            {muscleData.subTitle && muscleData.subTitle.split(',').map((part: string, index: number) => (
                <li key={index}>{String(t(`db.${part.trim()}`, part.trim()))}</li>
            ))}
        </ul>
      </div>

      {/* EXERCISES PREVIEW HEADER */}
      <div className="flex items-center gap-2.5 mb-5 px-1 shrink-0">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-lg">{t('card.topExercise')}</h3>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-3 py-1 rounded-full font-bold ml-auto shadow-sm border border-slate-200/50 dark:border-slate-700 tracking-wide">
            {muscleData.exercises?.length || 0} {t('card.available')}
        </span>
      </div>

      {/* ПОКАЗВАМЕ ПЪРВОТО УПРАЖНЕНИЕ ОТ БАЗАТА */}
      {exampleExercise ? (
          <div 
            className="flex-1 border border-slate-200/60 dark:border-slate-700/60 rounded-[1.5rem] p-6 bg-white dark:bg-slate-800/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col" 
            onClick={() => navigate(`/muscle/${muscleKey}`)}
          >
              <div className="flex justify-between items-start mb-5 gap-4">
                  <h4 className="font-bold text-[19px] text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {String(t(`db.${exampleExercise.name}`, exampleExercise.name))}
                  </h4>
                  {exampleExercise.difficulty && (
                      <span className="shrink-0 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase whitespace-nowrap border border-blue-100 dark:border-blue-800/50">
                          {String(t(`db.${exampleExercise.difficulty}`, exampleExercise.difficulty))}
                      </span>
                  )}
              </div>

              {/* IMAGE GIF SLOT */}
              {exampleExercise.gif && (
                 <div className="mb-6 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 shadow-inner group-hover:shadow-md transition-shadow relative">
                     <img src={exampleExercise.gif} alt={exampleExercise.name} className="w-full h-auto max-h-[240px] object-cover mix-blend-multiply dark:mix-blend-normal" loading="lazy" />
                 </div>
              )}
              
              {/* Описанието от базата */}
              <p className="text-[14px] text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed font-medium">
                  {String(t(`db.${exampleExercise.text}`, exampleExercise.text)) || t('card.noDescription')}
              </p>
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl transition-colors border border-slate-100 dark:border-slate-700/50">
                       <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-1">{t('card.equipment')}</p>
                       <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold">
                           {String(t(`db.${exampleExercise.equipment}`, exampleExercise.equipment)) || t('card.gym')}
                       </p>
                  </div>
              </div>

              {/* Стъпките от базата (показваме само първите 2) */}
              {exampleExercise.steps && exampleExercise.steps.length > 0 && (
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 mt-auto">
                      <p className="text-xs uppercase tracking-widest text-blue-800 dark:text-blue-400 font-bold mb-4 flex items-center gap-2 border-b border-blue-200/50 dark:border-blue-800/30 pb-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {t('card.instructions')}
                      </p>
                      <ol className="list-decimal pl-5 text-[14px] leading-loose text-slate-700 dark:text-slate-300 space-y-3 font-medium">
                          {exampleExercise.steps.slice(0, 2).map((step: string, i: number) => (
                              <li key={i} className="pl-2">{String(t(`db.${step}`, step))}</li>
                          ))}
                          {exampleExercise.steps.length > 2 && (
                              <li className="italic text-blue-600 dark:text-blue-400 cursor-pointer py-1.5 list-none -ml-5 pl-5 bg-white/60 dark:bg-slate-800/50 rounded-lg mt-2 text-sm text-center shadow-sm hover:shadow-md transition-all font-bold">
                                  {t('card.clickToSee', { count: exampleExercise.steps.length - 2 })} &rarr;
                              </li>
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