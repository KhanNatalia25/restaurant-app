// Универсальная кнопка, используемая во всём приложении.
// Поддерживает разные варианты оформления (variant) и состояния.

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

// Базовые классы оформления для всех вариантов кнопок.
const baseClasses =
  "w-full py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

// Словарь классов под разные визуальные стили.
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-tom-thumb-800 text-white hover:bg-tom-thumb-700",
  secondary:
    "bg-stone-200 text-stone-800 hover:bg-stone-300",
  danger: "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
