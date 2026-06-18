// Подвал сайта. Содержит общую информацию, ссылки на разделы и контакты.

export default function Footer() {
  return (
    <footer className="bg-tom-thumb-900 text-stone-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        {/* Колонка 1 — название и описание */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">НАТК</h3>
          <p className="text-sm">
            Учебный ресторан Новосибирского авиационного технического колледжа.
            Готовим с душой и подаём с улыбкой.
          </p>
        </div>

        {/* Колонка 2 — контакты */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Контакты</h3>
          <ul className="text-sm space-y-1">
            <li>г. Новосибирск, ул. Галущака, 2</li>
            <li>+7 (999) 000-00-00</li>
            <li>natk@edu.ru</li>
          </ul>
        </div>

        {/* Колонка 3 — график работы */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">График работы</h3>
          <p className="text-sm">Пн–Пт: 10:00 – 21:00</p>
          <p className="text-sm">Сб–Вс: 11:00 – 22:00</p>
        </div>
      </div>

      <div className="border-t border-stone-700 py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} НАТК. Все права защищены.
      </div>
    </footer>
  );
}
