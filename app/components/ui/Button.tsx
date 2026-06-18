import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseClass =
    "px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50";

  const variants = {
    primary: "bg-amber-600 text-white hover:bg-amber-700",
    secondary: "bg-stone-200 text-stone-800 hover:bg-stone-300",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}