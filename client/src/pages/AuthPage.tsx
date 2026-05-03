import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  ChefHat,
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(url, formData);

      if (isLogin) {
        login(res.data.token, res.data.user);
        toast.success("🎉 Đăng nhập thành công!");
        navigate("/");
      } else {
        toast.success("Đăng ký thành công!");
        setIsLogin(true);
      }
    } catch (error: any) {
      console.log(error);
      const message = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8f7ff] relative overflow-hidden">
      {/* Decorative Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-brand-primary/5 rounded-2xl blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/5 rounded-2xl blur-[100px]" />
      </div>

      <div className="w-full max-w-xl bg-white border border-indigo-100/50 rounded-[3.5rem] p-12 md:p-16 shadow-2xl shadow-indigo-200/50 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-12">
          <div className="inline-flex p-5 bg-brand-primary/10 rounded-2xl mb-8 shadow-inner animate-float">
            <ChefHat className="text-brand-primary" size={48} />
          </div>
          <h2 className="text-5xl md:text-6xl font-normal text-[#1e1b4b] tracking-normal font-['Pacifico']">
            Recipe <span className="text-brand-primary">Cookbook</span>
          </h2>
          <p className="text-slate-400 mt-4 text-lg font-medium">
            {isLogin
              ? "Tuyệt vời, bạn đã trở lại!"
              : "Hành trình nấu nướng bắt đầu tại đây"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative group">
              <User
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors"
                size={22}
              />
              <input
                type="text"
                placeholder="Họ và tên"
                required
                className="w-full bg-indigo-50/50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 outline-none focus:bg-white focus:border-brand-primary transition-all text-[#1e1b4b] font-black placeholder:text-slate-300"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}
          <div className="relative group">
            <Mail
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors"
              size={22}
            />
            <input
              type="email"
              placeholder="Email của bạn"
              required
              className="w-full bg-indigo-50/50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 outline-none focus:bg-white focus:border-brand-primary transition-all text-[#1e1b4b] font-black placeholder:text-slate-300"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="relative group">
            <Lock
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors"
              size={22}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              required
              className="w-full bg-indigo-50/50 border-2 border-transparent rounded-2xl py-5 pl-14 pr-6 outline-none focus:bg-white focus:border-brand-primary transition-all text-[#1e1b4b] font-black placeholder:text-slate-300"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-violet-700 text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-violet-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin text-white" />
            ) : isLogin ? (
              <LogIn size={24} strokeWidth={3} />
            ) : (
              <UserPlus size={24} strokeWidth={3} />
            )}
            {isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ NGAY"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 hover:text-brand-primary font-black transition-all text-sm uppercase tracking-widest"
          >
            {isLogin
              ? "Chưa có tài khoản? Đăng ký ngay"
              : "Đã có tài khoản? Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}
