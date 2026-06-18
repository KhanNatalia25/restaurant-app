import type { CartItem } from "../types";

interface Props {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export default function CartItemComponent({ item, onUpdateQuantity }: Props) {
  const { menuItem, quantity } = item;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-stone-200">
      <img
        src={menuItem.image}
        alt={menuItem.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-stone-800">{menuItem.name}</h4>
        <p className="text-amber-600 font-medium">{menuItem.price} ₽</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(menuItem.id, quantity - 1)}
          className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold"
        >
          -
        </button>
        <span className="w-8 text-center font-semibold">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)}
          className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold"
        >
          +
        </button>
      </div>
      <div className="w-24 text-right font-semibold text-stone-800">
        {menuItem.price * quantity} ₽
      </div>
    </div>
  );
}