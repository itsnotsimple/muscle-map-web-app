import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Импортираме всички страници
import Index from "./pages/Index";
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

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Главна страница */}
          <Route path="/" element={<Index />} />
          
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
          
          {/* Детайли за мускул */}
          <Route path="/muscle/:muscleId" element={<MuscleDetail />} />
          
          {/* Страница за грешка (404) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;