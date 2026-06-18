// Карточка блюда в меню. Отображает изображение, название, описание, цену
// и кнопку "В корзину". Используется на странице menu.tsx.

import Button from "~/components/Button";
import type { MenuItem } from "~/types";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Картинка блюда. Берём из статической папки assets бэкенда по абсолютному URL.
          В dev-режиме фронтенд крутится на :3000, бэкенд на :5000, поэтому http://localhost:5000. */}
      <img
        src={`http://localhost:5000/assets/${item.image}`}
        alt={item.name}
        className="w-full h-48 object-cover"
        loading="lazy"
      />

      <div className="p-5 flex flex-col flex-grow">
        {/* Заголовок и цена — в одну строку */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-stone-800">{item.name}</h3>
          <span className="text-tom-thumb-700 font-semibold whitespace-nowrap">
            {item.price} ₽
          </span>
        </div>

        <p className="text-sm text-stone-600 mb-4 flex-grow">{item.description}</p>

        <Button onClick={() => onAddToCart(item)}>В корзину</Button>
      </div>
    </div>
  );
}
