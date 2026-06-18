import { Link } from "react-router";
import { useCart } from "../hooks/useCart";
import CartItemComponent from "../components/CartItem";

export function meta() {
  return [{ title: "Корзина | Вкусный Уголок" }];
}

export default function CartPage() {
  const { items, totalAmount, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-amber-600 mb-4">Корзина пуста</h1>
        <p className="text-stone-500 mb-8">Добавьте блюда из меню, чтобы сделать заказ</p>
        <Link
          to="/menu"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors"
        >
          Перейти в меню
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-600 mb-8">Корзина</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-md p-6">
            {items.map((item) => (
              <CartItemComponent
                key={item.menuItem.id}
                item={item}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>
          <button
            onClick={clearCart}
            className="mt-4 text-red-500 hover:text-red-700 text-sm"
          >
            Очистить корзину
          </button>
        </div>

        <div className="lg:w-80">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Итого</h2>
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Сумма:</span>
              <span className="text-amber-600">{totalAmount} ₽</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-amber-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors"
            >
              Оформить заказ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
