import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import type { MenuItem, CartItem } from "../types";

interface CartContextValue {
  items: CartItem[];
  totalAmount: number;
  totalCount: number;
  addItem: (item: MenuItem) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    [items]
  );

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const addItem = (menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.menuItem.id !== id));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.menuItem.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.menuItem.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalAmount,
        totalCount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}