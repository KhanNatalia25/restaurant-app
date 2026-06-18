// Кастомный хук useAuth — централизованное управление авторизацией пользователя
// через Firebase Authentication. Хранит данные текущего пользователя, состояние
// загрузки и предоставляет функцию выхода из системы. Должен оборачивать корневой
// layout, чтобы доступ к данным сессии был во всех частях приложения.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import { auth } from "~/firebase.config";
import type { UserProfile } from "~/types";

// Структура значения, передаваемого через контекст авторизации.
interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean; // идёт ли сейчас проверка авторизации
  logout: () => Promise<void>;
}

// Создаём контекст. По умолчанию null — реальное значение задаётся в AuthProvider.
const AuthContext = createContext<AuthContextValue | null>(null);

// Провайдер авторизации. Подписывается на onAuthStateChanged, чтобы
// автоматически обновлять данные пользователя при входе/выходе из системы.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Подписываемся на изменения состояния авторизации Firebase.
    // Колбэк вызывается при входе, выходе и перезагрузке страницы.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Пользователь залогинен: формируем объект UserProfile для контекста.
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          // Если displayName не задан, берём часть email до "@", иначе — "Пользователь".
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Пользователь",
        });
      } else {
        // Пользователь не залогинен.
        setUser(null);
      }
      setLoading(false);
    });

    // При размонтировании провайдера отписываемся от слушателя.
    return () => unsubscribe();
  }, []);

  // Функция выхода из системы. Использует Firebase signOut.
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для доступа к контексту авторизации. Бросает ошибку, если используется
// вне AuthProvider — помогает отловить неправильное использование на этапе разработки.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
