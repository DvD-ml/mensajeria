import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loginRequest, meRequest, type UsuarioAuth } from "../services/authService";

type AuthContextType = {
  user: UsuarioAuth | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  setAuthAfterRegister: (token: string, usuario: UsuarioAuth) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioAuth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    meRequest()
      .then((usuario) => {
        setUser(usuario);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(email: string, password: string) {
    const data = await loginRequest(email, password);
    localStorage.setItem("token", data.token);
    setUser(data.usuario);
  }

  function setAuthAfterRegister(token: string, usuario: UsuarioAuth) {
    localStorage.setItem("token", token);
    setUser(usuario);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, setAuthAfterRegister, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}