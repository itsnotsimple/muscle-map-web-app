import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MuscleInfoCardProps {
  muscleKey: string;
  onClose: () => void;
}

const MuscleInfoCard = ({ muscleKey, onClose }: MuscleInfoCardProps) => {
  const [muscleData, setMuscleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. ТЕГЛИМ РЕАЛНИТЕ ДАННИ ОТ БАЗАТА
    setLoading(true);
    console.log(`📡 Fetching real DB data for: ${muscleKey}`);

    fetch(`http://localhost:5000/api/muscles/${muscleKey}`)
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
        <div className="fixed right-0 top-0 h-screen w-full md:w-[400px] bg-white p-6 shadow-2xl border-l border-slate-200 z-50 flex items-center justify-center">
            <div className="text-purple-600 font-bold animate-pulse">Loading from Database...</div>
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
    <div className="fixed right-0 top-0 h-screen w-full md:w-[400px] bg-white shadow-2xl border-l border-slate-200 p-6 overflow-y-auto z-50 animate-slide-in">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
           {/* Взимаме заглавието от базата (напр. "Pectoralis Major") */}
           <h2 className="text-xl font-extrabold text-slate-800">{muscleData.title}</h2>
           <p className="text-sm text-slate-500 capitalize">{muscleKey} Training</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => navigate(`/muscle/${muscleKey}`)}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-md font-bold transition-colors flex items-center gap-1"
            >
                ⚡ Expand
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2">
                ✕
            </button>
        </div>
      </div>

      {/* TARGET MUSCLES (SubTitle от базата) */}
      <div className="bg-purple-50 p-4 rounded-xl mb-6">
        <h3 className="text-purple-800 font-bold text-sm mb-2">Target Muscles:</h3>
        <ul className="list-disc pl-4 text-sm text-purple-700 space-y-1">
            <li className="font-semibold">{muscleData.title}</li>
            {/* Ако в базата има SubTitle, показваме го */}
            {muscleData.subTitle && <li>{muscleData.subTitle}</li>}
        </ul>
      </div>

      {/* EXERCISES PREVIEW */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-purple-500">⚡</span>
        <h3 className="font-bold text-slate-700">Top Exercise</h3>
        <span className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full font-bold">
            {muscleData.exercises?.length || 0} available
        </span>
      </div>

      {/* ПОКАЗВАМЕ ПЪРВОТО УПРАЖНЕНИЕ ОТ БАЗАТА */}
      {exampleExercise ? (
          <div 
            className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group" 
            onClick={() => navigate(`/muscle/${muscleKey}`)}
          >
              <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                      {exampleExercise.name}
                  </h4>
                  {exampleExercise.difficulty && (
                      <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                          {exampleExercise.difficulty}
                      </span>
                  )}
              </div>
              
              {/* Описанието от базата */}
              <p className="text-xs text-slate-500 mb-4 line-clamp-3">
                  {exampleExercise.text || "No description available."}
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-50 p-2 rounded-lg">
                       <p className="text-[10px] text-slate-400 font-bold">EQUIPMENT</p>
                       <p className="text-xs text-slate-700 font-semibold">
                           {exampleExercise.equipment || "Gym"}
                       </p>
                  </div>
              </div>

              {/* Стъпките от базата (показваме само първите 2) */}
              {exampleExercise.steps && exampleExercise.steps.length > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-800 font-bold mb-1">ⓘ Instructions:</p>
                      <ol className="list-decimal pl-4 text-[11px] text-blue-700 space-y-1">
                          {exampleExercise.steps.slice(0, 2).map((step: string, i: number) => (
                              <li key={i}>{step}</li>
                          ))}
                          {exampleExercise.steps.length > 2 && (
                              <li className="italic text-blue-500">Click to see {exampleExercise.steps.length - 2} more steps...</li>
                          )}
                      </ol>
                  </div>
              )}
          </div>
      ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-sm text-slate-500">No exercises found in database for this muscle.</p>
          </div>
      )}

      <button 
        onClick={() => navigate(`/muscle/${muscleKey}`)}
        className="w-full mt-6 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg flex justify-center items-center gap-2"
      >
        <span>View Full Guide</span>
        <span>→</span>
      </button>

    </div>
  );
};

export default MuscleInfoCard;