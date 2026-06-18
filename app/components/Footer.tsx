import { restaurantInfo } from "../data/restaurant";

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-white mb-3">{restaurantInfo.name}</h3>
            <p className="text-sm">{restaurantInfo.description}</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Контакты</h3>
            <p className="text-sm">{restaurantInfo.address}</p>
            <p className="text-sm">{restaurantInfo.phone}</p>
            <p className="text-sm">{restaurantInfo.email}</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Режим работы</h3>
            <p className="text-sm">{restaurantInfo.hours}</p>
          </div>
        </div>
        <div className="border-t border-stone-700 mt-6 pt-4 text-center text-sm">
          © {new Date().getFullYear()} {restaurantInfo.name}. Все права защищены.
        </div>
      </div>
    </footer>
  );
}