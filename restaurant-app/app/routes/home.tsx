// Главная страница ресторана. Содержит краткое приветствие и блок с преимуществами.

import { Link } from "react-router";

export function meta() {
  return [
    { title: "Главная | НАТК" },
    {
      name: "description",
      content:
        "Учебный ресторан Новосибирского авиационного технического колледжа. Онлайн-заказ блюд.",
    },
  ];
}

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero-секция */}
      <section className="bg-tom-thumb-900 text-white rounded-3xl px-8 py-16 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Добро пожаловать в НАТК
        </h1>
        <p className="text-lg text-tom-thumb-100 mb-8 max-w-2xl mx-auto">
          Готовим блюда студенты и преподаватели колледжа. Закажите онлайн —
          мы привезём горячее прямо к вам.
        </p>
        <Link
          to="/menu"
          className="inline-block bg-white text-tom-thumb-800 font-semibold px-8 py-3 rounded-xl hover:bg-tom-thumb-100 transition-colors shadow-sm"
        >
          Перейти к меню
        </Link>
      </section>

      {/* Блок преимуществ */}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-tom-thumb-800 mb-2">
            Свежие продукты
          </h3>
          <p className="text-stone-600 text-sm">
            Используем только проверенные ингредиенты от местных поставщиков.
          </p>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-tom-thumb-800 mb-2">
            Быстрая доставка
          </h3>
          <p className="text-stone-600 text-sm">
            Привезём заказ в течение часа или ко времени, которое вы укажете.
          </p>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-tom-thumb-800 mb-2">
            Удобная оплата
          </h3>
          <p className="text-stone-600 text-sm">
            Принимаем оплату картой или наличными при получении.
          </p>
        </div>
      </section>
    </div>
  );
}
