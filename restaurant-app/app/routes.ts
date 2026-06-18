// Конфигурация маршрутов приложения.
// Здесь мы регистрируем все страницы, на которые можно перейти через react-router.
// Каждая запись связывает URL-путь (например, "/menu") с файлом компонента.

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Главная страница — рендерится по адресу "/"
  index("routes/home.tsx"),
  // Страница со списком блюд
  route("menu", "routes/menu.tsx"),
  // Страница корзины
  route("cart", "routes/cart.tsx"),
  // Оформление заказа
  route("checkout", "routes/checkout.tsx"),
  // Страница авторизации / регистрации
  route("auth", "routes/auth.tsx"),
  // История заказов текущего пользователя
  route("orders", "routes/orders.tsx"),
  // Статическая страница "О нас"
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
