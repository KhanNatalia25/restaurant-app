import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { CartProvider } from "./hooks/useCart";
import { AuthProvider } from "./hooks/useAuth";
import Header from "./components/Header";
import Footer from "./components/Footer";
// @ts-ignore
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col bg-stone-50">
        {/* Провайдер авторизации является внешним по отношению к провайдеру корзины */}
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}