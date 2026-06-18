// Шапка сайта с навигацией, логотипом, иконкой корзины и меню профиля.
// Динамически меняется в зависимости от того, авторизован ли пользователь:
//   - Если нет — справа отображается кнопка "Войти" со ссылкой на /auth.
//   - Если да — кнопка с именем пользователя, по клику открывается выпадающее
//     меню с переходом в "Историю заказов" и кнопкой "Выйти".

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  LuClipboardList,
  LuLogIn,
  LuLogOut,
  LuShoppingCart,
  LuUser,
} from "react-icons/lu";
import { useAuth } from "~/hooks/useAuth";
import { useCart } from "~/hooks/useCart";

export default function Header() {
  // Получаем текущего пользователя, состояние загрузки и функцию выхода.
  const { user, loading, logout } = useAuth();
  // Получаем количество товаров в корзине для бейджа на иконке.
  const { totalCount } = useCart();
  // useNavigate нужен для программного перенаправления после logout.
  const navigate = useNavigate();
  // Локальное состояние выпадающего меню профиля.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Ссылка на DOM-узел меню для отслеживания кликов "снаружи".
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрываем выпадающее меню при клике вне его области.
  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMenuOpen]);

  // Обработчик выхода из аккаунта. Вызывает logout() и возвращает на главную.
  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-tom-thumb-900 text-white shadow-md">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Логотип. Ссылка ведёт на главную страницу. */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-tom-thumb-100 transition-colors"
        >
          НАТК
        </Link>

        {/* Центральная навигация */}
        <div className="flex gap-8 text-lg items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-tom-thumb-100 font-bold"
                : "text-white hover:text-tom-thumb-200 transition-colors"
            }
          >
            Главная
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              isActive
                ? "text-tom-thumb-100 font-bold"
                : "text-white hover:text-tom-thumb-200 transition-colors"
            }
          >
            Меню
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? "text-tom-thumb-100 font-bold font-medium flex items-center gap-1"
                : "text-white hover:text-tom-thumb-200 transition-colors flex items-center gap-1"
            }
          >
            <LuShoppingCart className="w-5 h-5" />
            <span>Корзина</span>
            {totalCount > 0 && (
              <span className="bg-tom-thumb-600 text-tom-thumb-100 text-xs font-semibold px-2 py-0.5 rounded-full ml-1">
                {totalCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-tom-thumb-100 font-bold"
                : "text-white hover:text-tom-thumb-200 transition-colors"
            }
          >
            О нас
          </NavLink>
        </div>

        {/* Правая часть: либо кнопка "Войти", либо меню пользователя.
            Пока идёт начальная загрузка auth — ничего не показываем. */}
        <div className="flex items-center">
          {loading ? null : user ? (
            <div className="relative" ref={menuRef}>
              {/* Кнопка-имя пользователя открывает выпадающее меню */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-tom-thumb-900/40 px-4 py-2 rounded-xl border border-tom-thumb-700/50 hover:bg-tom-thumb-900/60 transition-colors"
              >
                <LuUser className="w-5 h-5 text-tom-thumb-200" />
                <span
                  className="text-sm font-medium max-w-[120px] truncate"
                  title={user.name}
                >
                  {user.name}
                </span>
              </button>

              {/* Само выпадающее меню. Рендерится только при isMenuOpen */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-stone-100 z-20 text-stone-800 animate-in fade-in slide-in-from-top-1 duration-100">
                  {/* Ссылка на историю заказов */}
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-stone-50 text-stone-700 hover:text-tom-thumb-900 transition-colors"
                  >
                    <LuClipboardList className="w-4 h-4 text-stone-400" />
                    <span>История заказов</span>
                  </Link>
                  {/* Разделитель */}
                  <hr className="border-stone-100 my-1" />
                  {/* Кнопка выхода */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors text-left"
                  >
                    <LuLogOut className="w-4 h-4" />
                    <span>Выйти</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Если пользователь не залогинен — кнопка "Войти"
            <Link
              to="/auth"
              className="flex items-center gap-2 bg-white text-tom-thumb-800 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-tom-thumb-100 transition-colors shadow-sm"
            >
              <LuLogIn className="w-4 h-4" />
              <span>Войти</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
