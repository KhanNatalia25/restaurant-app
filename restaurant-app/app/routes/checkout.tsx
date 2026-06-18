// Страница оформления заказа. Использует react-hook-form для валидации полей
// (имя, телефон, комментарий, способ оплаты) и отправляет заказ на бэкенд
// (POST /api/orders). При успехе показывает модальное окно подтверждения,
// при ошибке — alert. После успешной отправки корзина очищается.
//
// Если пользователь залогинен — поле имени автоматически заполняется
// его displayName (поведение из обновлённой версии checkout из методички).

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Button from "~/components/Button";
import Modal from "~/components/Modal";
import { useAuth } from "~/hooks/useAuth";
import { useCart } from "~/hooks/useCart";
import apiClient from "~/services/apiClient";

// Структура данных формы.
interface CheckoutFormData {
  name: string;
  phone: string;
  comment: string;
  paymentMethod: "card" | "cash";
}

export function meta() {
  return [{ title: "Оформление заказа | НАТК" }];
}

export default function CheckoutPage() {
  // Данные корзины и функция её очистки.
  const { items, totalAmount, clearCart } = useCart();
  // Текущий пользователь (для автозаполнения имени и привязки заказа).
  const { user } = useAuth();
  const navigate = useNavigate();

  // Состояние модального окна "Заказ оформлен".
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Состояние процесса отправки.
  const [isProcessing, setIsProcessing] = useState(false);

  // Инициализация react-hook-form с дефолтными значениями.
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      paymentMethod: "card",
      comment: "",
    },
  });

  // Подписываемся на текущие значения для отображения в модалке после успеха.
  const watchedName = watch("name");
  const watchedPhone = watch("phone");

  // Если пользователь залогинен и у него есть имя — подставляем его в форму.
  useEffect(() => {
    if (user?.name) {
      setValue("name", user.name);
    }
  }, [user, setValue]);

  // Если корзина пуста — рендерим "нечего оформлять".
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-stone-700 mb-4">
          Нечего оформлять
        </h2>
        <Link
          to="/menu"
          className="text-tom-thumb-600 hover:underline text-lg"
        >
          Перейти в меню
        </Link>
      </div>
    );
  }

  // Обработчик отправки формы. Вызывается только если react-hook-form
  // прошёл валидацию.
  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    // Формируем payload в формате, который ожидает бэкенд.
    const orderData = {
      customer: {
        name: data.name,
        phone: data.phone,
        comment: data.comment,
        paymentMethod: data.paymentMethod,
      },
      items: items.map((item) => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
      })),
      total: totalAmount,
      // userId может быть null, если заказ оформляет незалогиненный пользователь.
      userId: user ? user.uid : null,
    };

    try {
      // POST /api/orders — бэкенд сохранит заказ в Firestore и вернёт его ID.
      await apiClient.post("/orders", orderData);
      setIsProcessing(false);
      // Открываем модалку с подтверждением.
      setIsModalOpen(true);
    } catch {
      setIsProcessing(false);
      alert("Не удалось отправить заказ. Проверьте подключение к серверу.");
    }
  };

  // Обработчик закрытия модалки — очищаем корзину и идём на главную.
  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearCart();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-tom-thumb-900 mb-8 text-center">
        Оформление заказа
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Поле "Имя" */}
        <div>
          <label className="block text-stone-700 font-medium mb-2">
            Ваше имя *
          </label>
          <input
            type="text"
            placeholder="Иван Иванов"
            className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"
            {...register("name", { required: "Укажите ваше имя" })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Поле "Телефон" */}
        <div>
          <label className="block text-stone-700 font-medium mb-2">
            Телефон *
          </label>
          <input
            type="tel"
            placeholder="+7 (999) 123-45-67"
            className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"
            {...register("phone", {
              required: "Укажите номер телефона",
            })}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Поле "Комментарий" (необязательное) */}
        <div>
          <label className="block text-stone-700 font-medium mb-2">
            Комментарий к заказу
          </label>
          <textarea
            rows={3}
            placeholder="Пожелания, аллергии..."
            className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tom-thumb-400"
            {...register("comment")}
          />
        </div>

        {/* Способ оплаты (radio) */}
        <div>
          <label className="block text-stone-700 font-medium mb-2">
            Способ оплаты
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="card"
                className="accent-tom-thumb-600"
                {...register("paymentMethod")}
              />
              Картой онлайн
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="cash"
                className="accent-tom-thumb-600"
                {...register("paymentMethod")}
              />
              Наличными
            </label>
          </div>
        </div>

        {/* Сводка по корзине */}
        <div className="bg-stone-100 rounded-2xl p-5">
          <h3 className="font-bold text-stone-800 mb-3">Ваш заказ:</h3>
          {items.map((item) => (
            <div
              key={item.menuItem.id}
              className="flex justify-between text-sm text-stone-600 py-1"
            >
              <span>
                {item.menuItem.name} × {item.quantity}
              </span>
              <span>{item.menuItem.price * item.quantity} ₽</span>
            </div>
          ))}
          <div className="border-t border-stone-300 mt-3 pt-3 flex justify-between font-bold text-lg">
            <span>Итого:</span>
            <span className="text-tom-thumb-700">{totalAmount} ₽</span>
          </div>
        </div>

        {/* Кнопка отправки */}
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? "Обработка платежа..." : "Оплатить заказ"}
        </Button>
      </form>

      {/* Модалка успешного оформления */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Заказ оформлен!"
      >
        <div className="text-center py-4">
          <p className="text-lg text-stone-700 mb-2">
            Спасибо, {watchedName}!
          </p>
          <p className="text-stone-500 mb-6">
            Ваш заказ на сумму {totalAmount} ₽ принят.
            <br />
            Мы свяжемся с вами по телефону {watchedPhone}.
          </p>
          <Button onClick={handleCloseModal}>На главную</Button>
        </div>
      </Modal>
    </div>
  );
}
