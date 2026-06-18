// Страница "О нас" — статическая информация о ресторане.

export function meta() {
  return [
    { title: "О нас | НАТК" },
    {
      name: "description",
      content: "Информация о ресторане НАТК: контакты, история, команда.",
    },
  ];
}

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-tom-thumb-900 mb-2">О нас</h1>
        <p className="text-stone-600">
          Учебный ресторан Новосибирского авиационного технического колледжа
          имени Б.С. Галущака.
        </p>
      </header>

      <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-tom-thumb-800 mb-3">История</h2>
        <p className="text-stone-700 leading-relaxed">
          Наш ресторан работает при колледже с 2015 года. Это не просто
          столовая — это учебная площадка, где студенты специальности
          «Поварское и кондитерское дело» отрабатывают профессиональные навыки
          под руководством опытных мастеров.
        </p>
      </section>

      <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-tom-thumb-800 mb-3">
          Наша команда
        </h2>
        <p className="text-stone-700 leading-relaxed">
          Более 30 студентов и 5 преподавателей работают над тем, чтобы ваш
          заказ был приготовлен вкусно и в срок. Каждое блюдо — это маленький
          дипломный проект на пути к будущей профессии.
        </p>
      </section>

      <section className="bg-tom-thumb-900 text-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-3">Контакты</h2>
        <ul className="space-y-1 text-tom-thumb-100">
          <li>📍 г. Новосибирск, ул. Галущака, 2</li>
          <li>📞 +7 (999) 000-00-00</li>
          <li>✉️ natk@edu.ru</li>
          <li>🕐 Пн–Пт 10:00–21:00, Сб–Вс 11:00–22:00</li>
        </ul>
      </section>
    </div>
  );
}
