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
          
          {/* Защитени страници */}
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bmi" element={<BmiPage />} />
          
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