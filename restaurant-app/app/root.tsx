// Корневой layout приложения.
// Внутри Layout оборачиваем всё в:
//   1. <html> и <body> со шрифтами Inter
//   2. AuthProvider — контекст авторизации (обязательно выше, чем CartProvider,
//      т.к. корзина не зависит от auth, но порядок лучше оставить логичным)
//   3. CartProvider — контекст корзины
//   4. Header и Footer — общие элементы для всех страниц
//   5. <Outlet> — место, куда React Router рендерит текущую страницу.

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { AuthProvider } from "~/hooks/useAuth";
import { CartProvider } from "~/hooks/useCart";
import "./app.css";

// Подключение шрифта Inter и иконок favicon.
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    // Провайдер авторизации оборачивает всё приложение, чтобы любой компонент
    // мог получить данные о текущем пользователе через useAuth().
    <AuthProvider>
      {/* Провайдер корзины вложен в AuthProvider, чтобы корзина жила в рамках сессии. */}
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
          <Header />
          <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
            <Outlet />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

// Обработчик ошибок React Router. Показывает дружелюбное сообщение пользователю.
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Упс!";
  let details = "Произошла непредвиденная ошибка.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Ошибка";
    details =
      error.status === 404
        ? "Запрашиваемая страница не найдена."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-3xl font-bold mb-2">{message}</h1>
      <p className="text-stone-600 mb-4">{details}</p>
      {stack && (
        <pre className="w-full p-4 bg-stone-100 overflow-x-auto text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
