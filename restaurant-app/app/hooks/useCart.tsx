// Кастомный хук useCart — управление корзиной пользователя через React Context.
// Аналогичен useAuth, но отвечает за хранение товаров, добавленных в корзину,
// подсчёт их количества и итоговой суммы. Должен оборачивать корневой layout
// внутри AuthProvider, чтобы корзина была доступна во всех частях приложения.

import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartItem, MenuItem } from "~/types";

// Структура значения, которое передаётся через контекст корзины.
interface CartContextValue {
  items: CartItem[];
  totalCount: number; // общее число товаров (сумма quantity)
  totalAmount: number; // итоговая сумма корзины
  addItem: (item: MenuItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

// Создаём контекст. По умолчанию null — реальное значение задаётся в CartProvider.
const CartContext = createContext<CartContextValue | null>(null);

// Провайдер корзины. Должен быть размещён в корневом layout.
// Внутри себя хранит список товаров, вычисляет totalCount/totalAmount
// и предоставляет методы addItem/removeItem/clearCart через контекст.
export function CartProvider({ children }: { children: ReactNode }) {
  // Локальное состояние корзины — массив позиций {menuItem, quantity}.
  const [items, setItems] = useState<CartItem[]>([]);

  // Добавить блюдо в корзину. Если оно уже есть — увеличиваем quantity на 1.
  const addItem = (item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  // Полностью убрать позицию из корзины по id блюда.
  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== id));
  };

  // Очистить корзину целиком (например, после успешного оформления заказа).
  const clearCart = () => setItems([]);

  // Общее число товаров: сумма quantity по всем позициям.
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  // Итоговая сумма корзины: сумма (price * quantity) по всем позициям.
  const totalAmount = items.reduce(
    (sum, i) => sum + i.menuItem.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{ items, totalCount, totalAmount, addItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Хук для доступа к контексту корзины. Бросает ошибку, если используется
// вне CartProvider — это помогает отловить неправильное использование на этапе разработки.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
