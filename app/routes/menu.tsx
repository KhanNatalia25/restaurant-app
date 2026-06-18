import { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import MenuCard from "../components/MenuCard";
import { useCart } from "../hooks/useCart";
import type { MenuItem } from "../types";

const categories = ["Все", "Закуски", "Основные блюда", "Десерты", "Напитки"];

export function meta() {
  return [{ title: "Меню | Вкусный Уголок" }];
}

export default function MenuPage() {
  // Локальные состояния для меню, процесса загрузки и ошибки
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Все");
  const { addItem } = useCart();

  useEffect(() => {
    // Подгрузка меню из API при монтировании компонента
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<MenuItem[]>("/menu");
        setMenuData(response.data);
      } catch (err: any) {
        setError(err.message || "Не удалось загрузить меню");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Фильтрация меню по выбранной категории
  const filteredMenu =
    activeCategory === "Все"
      ? menuData
      : menuData.filter((item) => item.category === activeCategory);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    alert(`${item.name} добавлено в корзину!`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-stone-600">Загрузка меню...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-amber-600 mb-2">Наше меню</h1>
      <p className="text-center text-stone-500 mb-8">Выберите блюда по душе</p>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeCategory === cat
                ? "bg-amber-600 text-white"
                : "bg-stone-200 text-stone-700 hover:bg-stone-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((item) => (
          <MenuCard key={item.id} item={item} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}
