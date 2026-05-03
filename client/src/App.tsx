import { Navigate, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MyCookbook from "./pages/MyCookbook";
import HomeFeed from "./pages/HomeFeed";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import RecipeDetails from "./pages/RecipeDetails";
import { usePopup } from "./context/PopupContext";
import { useEffect } from "react";

function App() {
  const { isLoggedIn, loading } = useAuth();
  // Khóa cuộn trang khi có recipe (đang mở popup)
  const { isOpen, activeRecipeId, closePopup } = usePopup();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7ff]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
          <p className="text-indigo-900 font-bold animate-pulse">
            Đang xác thực phiên đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] text-[#1e1b4b] selection:bg-brand-primary selection:text-white relative overflow-x-hidden">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />
      {/* Decorative Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-brand-primary/5 rounded-2xl blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/5 rounded-2xl blur-[100px]" />
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-pink-400/5 rounded-2xl blur-[80px]" />
      </div>

      <Navbar />

      <main className="relative pt-20">
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route
            path="/auth"
            element={isLoggedIn ? <Navigate to="/" /> : <AuthPage />}
          />
          <Route
            path="/my-recipes"
            element={isLoggedIn ? <MyCookbook /> : <Navigate to="/auth" />}
          />

          <Route path="/recipe/:id" element={<RecipeDetails />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
