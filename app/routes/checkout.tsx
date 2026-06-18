import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import apiClient from "../services/apiClient";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

// Контракт полей формы оформления заказа
interface CheckoutFormData {
  name: string;
  phone: string;
  comment?: string;
  paymentMethod: "card" | "cash";
}

export function meta() {
  return [{ title: "Оформление заказа | Вкусный Уголок" }];
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Инициализируем react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      paymentMethod: "cash",
    },
  });

  // Отслеживаем значения полей для динамического вывода в модальном окне
  const watchedName = watch("name");
  const watchedPhone = watch("phone");

  // Автозаполнение имени авторизованного пользователя
  useEffect(() => {
    if (user?.name) {
      setValue("name", user.name);
    }
  }, [user, setValue]);

  // Во время проверки сессии показываем экран загрузки
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-pulse">
        <p className="text-xl text-stone-600 font-medium">Проверка авторизации...</p>
      </div>
    );
  }

  // Если корзина пуста, просим вернуться в меню
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-amber-600 mb-4">Корзина пуста</h1>
        <Link to="/menu" className="text-amber-600 hover:underline">
          Вернуться в меню
        </Link>
      </div>
    );
  }

  // Если пользователь не вошел в систему, показываем блокировку оформления заказа
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <h1 className="text-2xl font-bold text-amber-600 mb-4">Для оформления заказа требуется войти</h1>
        <p className="text-stone-500 mb-6 font-medium">
          Пожалуйста, войдите в свой аккаунт или зарегистрируйтесь, чтобы завершить оформление вашего заказа.
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

  // Метод отправки формы и создания заказа через API
  const onSubmitForm = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      const orderPayload = {
        customer: {
          name: data.name,
          phone: data.phone,
          comment: data.comment || "",
          paymentMethod: data.paymentMethod,
        },
        items: items, // Передаем товары из корзины с количеством и ценой
        total: totalAmount,
        userId: user ? user.uid : null, // Привязываем заказ к вошедшему пользователю
      };

      // Делаем реальный POST-запрос к API бэкенда
      await apiClient.post("/orders", orderPayload);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Ошибка при отправке заказа:", err);
      alert("Не удалось отправить заказ. Попробуйте еще раз или проверьте подключение к серверу.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearCart();
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-600 mb-8">Оформление заказа</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit(onSubmitForm)} className="flex-1 space-y-6">
          <div>
            <label className="block text-stone-700 font-medium mb-2">Ваше имя *</label>
            <input
              type="text"
              {...register("name", { required: "Введите ваше имя" })}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Иван Иванов"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-2">Телефон *</label>
            <input
              type="tel"
              {...register("phone", {
                required: "Введите номер телефона",
                pattern: {
                  value: /^(\+7|7|8)?[\s\-]?\(?[49][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
                  message: "Неправильный формат номера (н-р: +79991234567)",
                },
              })}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-2">Комментарий к заказу</label>
            <textarea
              {...register("comment")}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={3}
              placeholder="Пожелания, аллергии..."
            />
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-2">Способ оплаты</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="card"
                  {...register("paymentMethod")}
                  className="accent-amber-600"
                />
                <span>Картой онлайн</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="cash"
                  {...register("paymentMethod")}
                  className="accent-amber-600"
                />
                <span>Наличными при получении</span>
              </label>
            </div>
          </div>

          <div className="bg-stone-100 rounded-2xl p-5">
            <h3 className="font-bold text-stone-800 mb-3">Ваш заказ:</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between text-stone-600 text-sm">
                  <span>
                    {item.menuItem.name} × {item.quantity}
                  </span>
                  <span>{item.menuItem.price * item.quantity} ₽</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-300 mt-3 pt-3 flex justify-between font-bold text-lg">
              <span>Итого:</span>
              <span className="text-amber-600">{totalAmount} ₽</span>
            </div>
          </div>

          <Button type="submit" disabled={isProcessing} className="w-full py-4 text-lg">
            {isProcessing ? "Обработка платежа..." : "Оплатить заказ"}
          </Button>
        </form>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Заказ оформлен!">
          <div className="text-center py-4">
            <p className="text-lg text-stone-700 mb-2">Спасибо, {watchedName}!</p>
            <p className="text-stone-500 mb-6 font-medium">
              Ваш заказ на сумму {totalAmount} ₽ принят. Мы свяжемся с вами по телефону {watchedPhone}.
            </p>
            <Button onClick={handleCloseModal} className="w-full">
              На главную
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
