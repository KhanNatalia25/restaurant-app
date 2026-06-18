import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import type { UserProfile } from "../types";

// Определяем интерфейс значения контекста авторизации
interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Создаем контекст со значением по умолчанию null
const AuthContext = createContext<AuthContextValue | null>(null);

// Провайдер авторизации для оборачивания приложения
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Слушаем изменение состояния авторизации в Firebase
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Пользователь",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Отписываемся от слушателя при размонтировании
    return () => unsubscribe();
  }, []);

  // Функция для выхода из аккаунта
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Кастомный хук для использования контекста авторизации
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
