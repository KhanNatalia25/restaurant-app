import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Конфигурация Firebase для подключения клиентской части приложения
const firebaseConfig = {
  apiKey: "AIzaSyD7UQQo2OjSkZscw6fkysMBHGawQ6A5CEs", 
  authDomain: "restaraunt-app-e332f.firebaseapp.com", 
  projectId: "restaraunt-app-e332f", 
  storageBucket: "restaraunt-app-e332f.firebasestorage.app", 
  messagingSenderId: "915594487788", 
  appId: "1:915594487788:web:ab80ae877d1060f97782c9" 
};

// Инициализируем приложение Firebase
const app = initializeApp(firebaseConfig);

// Инициализируем Firebase Authentication и экспортируем его
export const auth = getAuth(app);

