// Страница "Корзина". Показывает содержимое корзины, позволяет изменить
// количество и перейти к оформлению заказа.

import { Link } from "react-router";
import Button from "~/components/Button";
import { useCart } from "~/hooks/useCart";

export function meta() {
  return [{ title: "Корзина | НАТК" }];
}

export default function CartPage() {
  const { items, totalAmount, addItem, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">
          Корзина пуста
        </h2>
        <Link
          to="/menu"
          className="text-tom-thumb-600 hover:underline text-lg"
        >
          Перейти в меню и выбрать блюда
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-tom-thumb-900 mb-8">Корзина</h1>

      <div className="bg-stone-100 rounded-2xl p-5 space-y-3">
        {items.map((item) => (
          <div
            key={item.menuItem.id}
            className="flex justify-between items-center text-stone-700"
          >
            <div>
              <div className="font-medium">
                {item.menuItem.name} × {item.quantity}
              </div>
              <div className="text-sm text-stone-500">
                {item.menuItem.price} ₽ за шт.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => removeItem(item.menuItem.id)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700"
                aria-label="Убрать"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => addItem(item.menuItem)}
                className="w-8 h-8 rounded-full bg-tom-thumb-200 hover:bg-tom-thumb-400 text-tom-thumb-900"
                aria-label="Добавить ещё"
              >
                +
              </button>
              <span className="font-semibold ml-3 w-20 text-right">
                {item.menuItem.price * item.quantity} ₽
              </span>
            </div>
          </div>
        ))}

        <div className="border-t border-stone-300 mt-3 pt-3 flex justify-between font-bold text-lg">
          <span>Итого:</span>
          <span className="text-tom-thumb-700">{totalAmount} ₽</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="secondary" onClick={clearCart}>
          Очистить
        </Button>
        <Link
          to="/checkout"
          className="flex-1 text-center bg-tom-thumb-800 text-white font-medium py-3 rounded-xl hover:bg-tom-thumb-700 transition-colors shadow-sm"
        >
          Оформить заказ
        </Link>
      </div>
    </div>
  );
}
