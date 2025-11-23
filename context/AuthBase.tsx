import api from "../api/api";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "../types/user";
import { Alert } from "react-native"

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderBase({ children }: { children: ReactNode; onLogout?: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("📡 AuthProviderBase: iniciando fetchUser");
    const fetchUser = async () => {
      try {
        const res = await api.get<User>("/auth/me", { withCredentials: true });
        console.log(" Usuario obtenido:", res.data);
        setUser(res.data);
      } catch (err) {
        console.log(" Error obteniendo usuario:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      console.log("👋 Logout exitoso");
      setUser(null);
        
      Alert.alert("Sesión cerrada", "👋 Hasta pronto")
            
    } catch {
      console.log("⚠️ Error en logout");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe ser usado dentro de AuthProvider");
  return ctx;
}
