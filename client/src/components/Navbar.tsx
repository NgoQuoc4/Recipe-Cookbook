import { Book, ChefHat, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-indigo-100/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-brand-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-500">
            <ChefHat className="text-brand-primary" size={24} />
          </div>
          <span className="text-3xl font-normal text-[#1e1b4b] font-['Pacifico'] tracking-normal">
            Recipe <span className="text-brand-primary">Cookbook</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link
                to="/my-recipes"
                className="text-slate-500 hover:text-brand-primary flex items-center gap-2 font-bold transition-all"
              >
                <Book size={20} />
                <span className="hidden md:inline">Sổ tay của tôi</span>
              </Link>
              <div className="h-6 w-[1px] bg-indigo-100 mx-2" />
              <div className="flex items-center gap-3 bg-brand-primary/5 px-4 py-2 rounded-2xl border border-indigo-100">
                <User size={18} className="text-brand-primary" />
                <span className="text-[#1e1b4b] text-sm font-black">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-brand-primary hover:bg-violet-700 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-xl shadow-violet-500/20 active:scale-95"
            >
              ĐĂNG NHẬP
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
