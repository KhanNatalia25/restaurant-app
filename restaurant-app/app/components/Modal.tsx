// Универсальное модальное окно. Используется, например, для подтверждения
// успешного оформления заказа на странице checkout.tsx.

import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean; // открыто ли окно
  onClose: () => void; // обработчик закрытия
  title?: string; // заголовок окна
  children: ReactNode; // содержимое
}

// Простая реализация модалки: затемнённый фон + центрированная карточка.
// Закрытие по клику на затемнение.
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4"
      onClick={onClose}
    >
      {/* Контейнер с содержимым. onClick с stopPropagation, чтобы клик внутри не закрывал окно. */}
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-2xl font-bold text-stone-800 mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
