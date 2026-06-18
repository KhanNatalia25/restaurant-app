import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { FiShoppingCart, FiUser, FiLogOut, FiLogIn, FiClipboard } from "react-icons/fi";

export default function Header() {
  const navigate = useNavigate();
  const { totalCount } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Классы стилизации активных и неактивных вкладок меню
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 ${
      isActive
        ? "bg-amber-600 text-white font-bold shadow-sm"
        : "text-stone-600 hover:bg-stone-100 font-medium"
    }`;

  // Скрытие выпадающего меню профиля при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Метод выхода из аккаунта
  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/"); // Программное перенаправление на главную после выхода
    } catch (error) {
      console.error("Ошибка при выходе из аккаунта:", error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Логотип ресторана */}
          <Link to="/" className="text-2xl font-black text-amber-600 tracking-tight">
            Geezzdil
          </Link>

          {/* Навигационное меню */}
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>
              Главная
            </NavLink>
            <NavLink to="/menu" className={navLinkClass}>
              Меню
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              О нас
            </NavLink>

            {/* Ссылка на корзину с иконкой и баджем количества товаров */}
            <NavLink to="/cart" className={navLinkClass}>
              <FiShoppingCart className="text-lg" />
              <span>Корзина</span>
              {totalCount > 0 && (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold rounded-full h-5 px-1.5 flex items-center justify-center animate-pulse">
                  {totalCount}
                </span>
              )}
            </NavLink>

            {/* Блок авторизации пользователя / выпадающее меню */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-bold transition-colors border border-amber-200 cursor-pointer"
                >
                  <FiUser className="text-lg" />
                  <span className="hidden sm:inline">{user.name}</span>
                </button>

                {/* Выпадающее меню профиля */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                        Аккаунт
                      </p>
                      <p className="text-sm font-semibold text-stone-700 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-amber-600 transition-colors"
                    >
                      <FiClipboard className="text-base" />
                      <span>История заказов</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-semibold cursor-pointer"
                    >
                      <FiLogOut className="text-base" />
                      <span>Выйти</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-250 shadow-sm"
              >
                <FiLogIn className="text-lg" />
                <span>Войти</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
