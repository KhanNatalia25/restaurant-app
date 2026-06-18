import { Link } from "react-router";
import { restaurantInfo } from "../data/restaurant";

export function meta() {
  return [{ title: `${restaurantInfo.name} — Главная` }];
}

export default function HomePage() {
  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-5xl font-bold text-amber-600 mb-6">
        {restaurantInfo.name}
      </h1>
      <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-8">
        {restaurantInfo.description}
      </p>
      <Link
        to="/menu"
        className="inline-block bg-amber-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-amber-700 transition-colors"
      >
        Смотреть меню
      </Link>
    </div>
  );
}