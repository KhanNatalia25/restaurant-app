// Централизованное хранилище TypeScript-типов, используемых во всём приложении.
// Все интерфейсы описаны в одном месте, чтобы упростить сопровождение и обеспечить
// согласованность структур данных между клиентом, сервером (Flask) и Firebase.

// Базовая информация о ресторане (название, описание, контакты, график работы).
// Отображается на странице "О нас" и в шапке сайта.
export interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  workHours: string;
}

// Позиция меню (блюдо). Получается с бэкенда (GET /api/menu) из коллекции Firestore "menu".
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

// Позиция в корзине пользователя. Хранится локально (в useCart) на клиенте.
// Включает ссылку на MenuItem + текущее количество.
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

// Заказ, который оформляется в форме checkout.tsx (CustomerInfo — данные о клиенте).
// Эта структура отправляется на сервер (POST /api/orders) и сохраняется в Firestore.
export interface CustomerInfo {
  name: string;
  phone: string;
  comment?: string;
  paymentMethod: "card" | "cash";
}

// Полный заказ в том виде, как он хранится в Firestore и приходит с бэкенда (GET /api/orders).
// Содержит служебные поля (id, userId, status, created_at) и список товаров.
export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ServerOrder {
  id: string;
  userId: string | null;
  customer: CustomerInfo;
  items: OrderItem[];
  total: number;
  status: "Новый" | "Готовится" | "В пути" | "Доставлен";
  created_at: string;
}

// Профиль авторизованного пользователя. Получается из Firebase Auth
// и хранится в AuthContext (см. useAuth.tsx).
export interface UserProfile {
  uid: string;
  email: string | null;
  name?: string;
}
