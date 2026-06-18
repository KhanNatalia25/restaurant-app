// Кастомный HTTP-клиент на базе axios.
// Используется во всём приложении для взаимодействия с бэкендом (Flask).
// Преимущества единого клиента:
//   1. Единая точка настройки (baseURL, заголовки, интерсепторы).
//   2. Удобная централизованная обработка ошибок.
//   3. DRY — не дублируем конфигурацию axios в каждом компоненте.

import axios, { type AxiosInstance, type AxiosError } from "axios";
import { API_URL } from "~/config";

// Создаём экземпляр axios с предустановленным базовым URL бэкенда.
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Перехватчик ответов: если сервер вернул ошибку, логируем её в консоль
// и отклоняем промис, чтобы её можно было поймать через try/catch наверху.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // eslint-disable-next-line no-console
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
