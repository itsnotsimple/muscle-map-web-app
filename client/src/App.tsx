import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// App pages
import Index from "./pages/app/Index";
import Exercises from "./pages/app/Exercises";
import Bookmarks from "./pages/app/Bookmarks";
import MuscleDetail from "./pages/app/MuscleDetail";
import Profile from "./pages/app/Profile";
import BmiPage from "./pages/app/BmiPage";
import DietPlan from "./pages/app/DietPlan";
import Premium from "./pages/app/Premium";
import WorkoutPlanner from "./pages/app/WorkoutPlanner";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Static pages
import Terms from "./pages/static/Terms";
import PrivacyPolicy from "./pages/static/PrivacyPolicy";
import CookiePolicy from "./pages/static/CookiePolicy";
import RefundPolicy from "./pages/static/RefundPolicy";
import FAQ from "./pages/static/FAQ";
import Contact from "./pages/static/Contact";
import About from "./pages/static/About";
import NotFound from "./pages/static/NotFound";

// UI Components
import CookieBanner from "./components/ui/CookieBanner";

// Global components
import { GamificationEngine } from "./components/features/GamificationEngine";
import Chatbot from "./components/features/Chatbot";
import SoftAurora from "./components/reactbits/SoftAurora";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 мин — не refetch-ва ако данните са "пресни"
      retry: 1,                         // 1 retry на fail, не повтаряй безкрай
      refetchOnWindowFocus: false,      // не презареждай при alt-tab
    },
  },
});

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
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
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
        <CookieBanner />
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