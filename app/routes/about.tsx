import { restaurantInfo } from "../data/restaurant";

export function meta() {
  return [{ title: `О нас | ${restaurantInfo.name}` }];
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-600 mb-6 text-center">О нашем ресторане</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <img
            src="/images/интерьер-ресторана.jpg"
            alt="Интерьер ресторана"
            className="rounded-2xl shadow-lg w-full h-64 object-cover"
          />
        </div>
        <div className="flex-1 space-y-4">
          <p className="text-stone-600 leading-relaxed">
            {restaurantInfo.description}
          </p>
          <p className="text-stone-600 leading-relaxed">
            Мы используем только свежие продукты от местных фермеров. Наша команда шеф-поваров
            постоянно работает над обновлением меню, чтобы радовать вас новыми вкусами.
          </p>
          <div className="pt-4">
            <p className="text-stone-800">
              <strong>Адрес:</strong> {restaurantInfo.address}
            </p>
            <p className="text-stone-800">
              <strong>Телефон:</strong> {restaurantInfo.phone}
            </p>
            <p className="text-stone-800">
              <strong>Режим работы:</strong> {restaurantInfo.hours}
            </p>
            <p className="text-stone-800">
              <strong>Email:</strong> {restaurantInfo.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}