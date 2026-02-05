import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InteractiveMuscleMap from "../components/InteractiveMuscleMap";
import MuscleInfoCard from "../components/MuscleInfoCard"; // Импортираме новия панел

const Index = () => {
  const { user } = useAuth();
  
  // State за избрания мускул (вместо директна навигация)
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const handleMuscleSelect = (muscle: string) => {
    console.log("Panel opened for:", muscle);
    setSelectedMuscle(muscle); // Само отваря панела, не навигира
  };

  const closePanel = () => {
    setSelectedMuscle(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
      <Header />

      <main className="flex-grow relative">
        {/* HERO SECTION */}
        <section className="bg-white py-8 shadow-sm">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2">
              Muscle Map <span className="text-blue-600">Explorer</span>
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto mb-6">
              Select a muscle group to view details.
            </p>
            
            {!user && (
              <div className="flex justify-center gap-4">
                <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 shadow-md">
                  Start Now
                </Link>
                <Link to="/login" className="bg-white text-slate-700 border border-slate-200 px-6 py-2 rounded-full font-bold hover:bg-slate-50">
                  Login
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* MAP SECTION */}
        <section className="py-8 container mx-auto px-4 flex justify-center">
          {/* Картата се измества леко вляво, ако панелът е отворен (на големи екрани) */}
          <div className={`transition-all duration-500 ${selectedMuscle ? 'md:mr-[350px]' : ''}`}>
             <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 inline-block">
                <InteractiveMuscleMap onMuscleSelect={handleMuscleSelect} />
             </div>
          </div>
        </section>

        {/* СТРАНИЧЕН ПАНЕЛ (SIDE TAB) */}
        {selectedMuscle && (
            <MuscleInfoCard 
                muscleKey={selectedMuscle} 
                onClose={closePanel} 
            />
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Index;