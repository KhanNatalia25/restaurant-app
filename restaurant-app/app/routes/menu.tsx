// Страница меню ресторана. Загружает список блюд с бэкенда (GET /api/menu),
// позволяет фильтровать по категориям, добавлять блюда в корзину.

import { useEffect, useState } from "react";
import MenuCard from "~/components/MenuCard";
import { useCart } from "~/hooks/useCart";
import apiClient from "~/services/apiClient";
import type { MenuItem } from "~/types";

export function meta() {
  return [{ title: "Меню | НАТК" }];
}

export default function MenuPage() {
  // Категории фильтра (фиксированный список — простой вариант без API).
  const categories = ["Все", "Закуски", "Основные блюда", "Десерты", "Напитки"];
  const [activeCategory, setActiveCategory] = useState("Все");

  // Получаем функцию добавления в корзину из контекста.
  const { addItem, totalCount } = useCart();

  // Состояния для асинхронной загрузки меню с сервера.
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // При монтировании делаем GET /menu и кладём результат в state.
  useEffect(() => {
    apiClient
      .get<MenuItem[]>("/menu")
      .then((response) => {
        setMenuData(response.data);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || err.message || "Не удалось загрузить меню",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Фильтрация по активной категории.
  const filteredMenu =
    activeCategory === "Все"
      ? menuData
      : menuData.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Заголовок и счётчик товаров в корзине */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-tom-thumb-900">Меню</h1>
        <span className="bg-tom-thumb-100 text-tom-thumb-800 px-4 py-2 rounded-full">
          {totalCount} {totalCount === 1 ? "блюдо" : "блюда"}
        </span>
      </div>

      {/* Состояние загрузки */}
      {isLoading && (
        <div className="text-center py-20 text-xl font-medium text-stone-500">
          Загрузка меню...
        </div>
      )}

      {/* Состояние ошибки */}
      {error && (
        <div className="text-center py-20 text-xl font-medium text-red-500">
          Ошибка: {error}
        </div>
      )}

      {/* Основной контент — кнопки категорий и сетка карточек */}
      {!isLoading && !error && (
        <>
          {/* Кнопки-фильтры по категориям */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full border transition-colors ${
                  activeCategory === cat
                    ? "bg-tom-thumb-600 text-white border-tom-thumb-600"
                    : "bg-white text-tom-thumb-800 border-tom-thumb-200 hover:bg-tom-thumb-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Сетка карточек блюд (1/2/3 колонки в зависимости от ширины экрана) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={(i) => addItem(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
