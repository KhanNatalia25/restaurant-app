import type { MenuItem } from "../types";

interface Props {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{item.name}</h3>
          <span className="text-amber-600 font-bold">{item.price} ₽</span>
        </div>
        <p className="text-sm text-stone-500 mb-4">{item.description}</p>
        <button
          onClick={() => onAddToCart(item)}
          className="w-full bg-amber-600 text-white py-2 rounded-xl hover:bg-amber-700 transition-colors"
        >
          В корзину
        </button>
      </div>
    </div>
  );
}