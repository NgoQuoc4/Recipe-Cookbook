import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api/axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}
// Tạo context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra xem đã đăng nhập chưa từ Server
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        try {
          // Gửi request lên server để kiểm tra token
          const response = await api.get("/auth/me");
          setToken(savedToken);
          setUser(response.data);
        } catch (e) {
          console.error("Phiên đăng nhập hết hạn hoặc không hợp lệ", e);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  // Hàm đăng nhập
  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Kiểm tra xem đã đăng nhập chưa
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Tạo hook để sử dụng context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
