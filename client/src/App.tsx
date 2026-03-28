import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Импортираме всички страници
import Index from "./pages/Index";
import Exercises from "./pages/Exercises";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookmarks from "./pages/Bookmarks";
import MuscleDetail from "./pages/MuscleDetail";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile"; 
import BmiPage from "./pages/BmiPage";
import DietPlan from './pages/DietPlan';
import VerifyEmail from './pages/VerifyEmail';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Premium from './pages/Premium';
import WorkoutPlanner from './pages/WorkoutPlanner';
import { GamificationEngine } from './components/GamificationEngine';
import SoftAurora from './components/reactbits/SoftAurora';
import Chatbot from './components/Chatbot';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Главна страница и Упражнения */}
          <Route path="/" element={<Index />} />
          <Route path="/exercises" element={<Exercises />} />
          
          {/* Вход и Регистрация */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Защитени страници */}
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bmi" element={<BmiPage />} />
          <Route path="/diet" element={<DietPlan />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/workout-planner" element={<WorkoutPlanner />} />
          
          {/* Детайли за мускул */}
          <Route path="/muscle/:muscleId" element={<MuscleDetail />} />
          
          {/* Страница за грешка (404) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <GamificationEngine />
        <Chatbot />
        <SoftAurora
          speed={0.5}
          scale={1.5}
          brightness={1}
          color1="#f7f7f7"
          color2="#001eff"
          noiseFrequency={2.5}
          noiseOctaves={4}
        />
      </BrowserRouter>
      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  );
};

export default App;