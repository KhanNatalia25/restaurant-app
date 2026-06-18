// Конфигурация клиента Firebase для фронтенд-приложения.
// Включает в себя: ключ API, домен аутентификации, идентификатор проекта и т.д.
// Эти данные берутся из Firebase Console (Project Settings -> Your apps -> Web app).
// Не путать с серверным firebase-config.json (для firebase-admin во Flask).

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Конфигурация подключения Firebase-проекта. Эти значения уникальны для каждого проекта.
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "restaurant-app.firebaseapp.com",
  projectId: "restaurant-app",
  storageBucket: "restaurant-app.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
  measurementId: "G-XXXXXXXXXX",
};

// Инициализируем Firebase-приложение с указанной конфигурацией.
// Возвращает экземпляр приложения, который затем используется для получения сервисов.
const app: FirebaseApp = initializeApp(firebaseConfig);

// Экспортируем инстанс Auth для использования в useAuth.tsx
// (signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged).
export const auth: Auth = getAuth(app);
