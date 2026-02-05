import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Bookmark, List, Info, User, LogOut } from "lucide-react"; // Иконите

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Помощна функция за стилизиране на активния линк
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
      isActive ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
    }`;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* ЛОГО И ИМЕ (В ЛЯВО) */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* ТУК Е ТВОЕТО ЛОГО */}
          <img 
            src="/public/images/logo.png" 
            alt="Muscle Map Logo" 
            className="h-10 w-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
          />
          <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
            Muscle Map
          </span>
        </Link>

        {/* НАВИГАЦИЯ (В ДЯСНО) */}
        <nav className="hidden md:flex items-center gap-2">
          
          <Link to="/" className={getLinkClass("/")}>
            <Home size={18} />
            <span>Home</span>
          </Link>

          <Link to="/bmi" className={getLinkClass("/bmi")}>
             <Info size={18} />
             <span>BMI</span>
          </Link>

          {/* BOOKMARKS - Винаги се вижда, дори да не си логнат */}
          <Link to="/bookmarks" className={getLinkClass("/bookmarks")}>
            <Bookmark size={18} />
            <span>Bookmark</span>
          </Link>

          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          {user ? (
            // АКО Е ЛОГНАТ
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all">
                <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                    <User size={16} />
                </div>
                <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate">
                  {user.email?.split('@')[0]}
                </span>
              </Link>
              
              <button 
                onClick={logout}
                title="Log out"
                className="text-slate-400 hover:text-red-500 transition-colors p-2"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            // АКО Е ГОСТ
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-600 font-bold hover:text-blue-600">
                Log In
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;