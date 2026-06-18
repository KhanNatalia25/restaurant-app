import axios from "axios";
import { API_URL } from "../config";

// Создаем экземпляр axios для отправки запросов к API бэкенда
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
