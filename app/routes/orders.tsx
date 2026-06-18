import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../services/apiClient";
import type { ServerOrder } from "../types";

export function meta() {
  return [{ title: "История заказов | Вкусный Уголок" }];
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<ServerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Если сессия загружается или пользователя нет, запрос не выполняем
    if (authLoading || !user) {
      if (!authLoading) {
        setIsLoading(false);
      }
      return;
    }

    // Загрузка списка заказов конкретного пользователя
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<ServerOrder[]>("/orders", {
          params: { userId: user.uid },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Не удалось получить заказы:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading]);

  // Отображаем загрузку во время проверки сессии или ожидания ответа сервера
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-stone-600">Загрузка истории заказов...</p>
      </div>
    );
  }

  // Если пользователь не вошел в систему, показываем заглушку
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <h1 className="text-2xl font-bold text-amber-600 mb-4">История заказов недоступна</h1>
        <p className="text-stone-500 mb-6 font-medium">
          Пожалуйста, войдите в систему, чтобы просмотреть свои заказы.
        </p>
        <Link
          to="/auth"
          className="inline-block w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-center"
        >
          Войти в аккаунт
        </Link>
      </div>
    );
  }

  // Если у пользователя пока нет заказов, предлагаем перейти в меню
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-stone-800 mb-4">Заказов пока нет</h1>
        <p className="text-stone-500 mb-6 font-medium">У вас пока нет оформленных заказов.</p>
        <Link to="/menu" className="text-amber-600 hover:underline font-semibold">
          Перейти к выбору блюд
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-stone-800 mb-8">История заказов</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          // Форматирование даты в русский формат
          let formattedDate = "Дата отсутствует";
          if (order.created_at) {
            try {
              formattedDate = new Date(order.created_at).toLocaleString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            } catch (e) {
              formattedDate = String(order.created_at);
            }
          }

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-md border border-stone-100 p-6 space-y-4"
            >
              {/* Информация о номере заказа, дате и статусе */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-3 gap-2">
                <div>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                    Заказ ID: {order.id}
                  </p>
                  <p className="text-sm text-stone-500 font-medium mt-1">{formattedDate}</p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100">
                  {order.status}
                </span>
              </div>

              {/* Состав заказа */}
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-stone-600">
                    <span>
                      {item.menuItem.name} <span className="text-stone-400 font-medium">× {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-stone-800">
                      {item.menuItem.price * item.quantity} ₽
                    </span>
                  </div>
                ))}
              </div>

              {/* Способ оплаты и итоговая сумма */}
              <div className="border-t border-stone-100 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <p className="text-xs text-stone-400 font-medium">
                  Оплата: {order.customer.paymentMethod === "card" ? "Картой онлайн" : "Наличными"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-medium text-sm">Итого:</span>
                  <span className="text-amber-600 font-extrabold text-xl">{order.total} ₽</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
