export type Category = "Закуски" | "Основные блюда" | "Десерты" | "Напитки";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  email: string;
}

// Данные покупателя для оформления заказа
export interface CustomerInfo {
  name: string;
  phone: string;
  comment?: string;
  paymentMethod: "card" | "cash";
}

// Структура заказа, обрабатываемая и хранимая на сервере
export interface ServerOrder {
  id?: string;
  userId?: string | null;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  status: string;
  created_at?: string;
}

// Данные профиля авторизованного пользователя
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
}
