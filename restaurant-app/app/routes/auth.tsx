// Страница авторизации. Совмещает вход в существующий аккаунт и регистрацию
// нового пользователя. Использует Firebase Authentication напрямую с клиента
// (минуя бэкенд), так как Firebase — это BaaS и JWT-токены обрабатываются
// на стороне Google.
//
// Валидация формы — react-hook-form. Ошибки Firebase переводятся на русский.

import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "~/firebase.config";

// Структура данных формы (имя и подтверждение пароля нужны только при регистрации).
interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export function meta() {
  return [{ title: "Авторизация | НАТК" }];
}

export default function AuthPage() {
  const navigate = useNavigate();
  // Режим: true = вход, false = регистрация.
  const [isLogin, setIsLogin] = useState(true);
  // Серверная ошибка (от Firebase) — отображается в красном блоке.
  const [serverError, setServerError] = useState<string | null>(null);
  // Локальное состояние загрузки — блокирует кнопку отправки.
  const [isLoading, setIsLoading] = useState(false);

  // Хук react-hook-form. В defaultValues задаём значения по умолчанию.
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    defaultValues: { email: "", password: "" },
  });

  // Обработчик отправки формы. Вызывается только если валидация прошла.
  const onSubmit = async (data: AuthFormData) => {
    setServerError(null);
    setIsLoading(false);

    // Дополнительная проверка: пароли должны совпадать (только при регистрации).
    if (!isLogin && data.password !== data.confirmPassword) {
      setServerError("Пароли не совпадают");
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        // Вход по email и паролю.
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        // Регистрация нового пользователя.
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );
        // Если указано имя — обновляем профиль.
        if (data.name) {
          await updateProfile(userCredential.user, { displayName: data.name });
        }
      }
      // В обоих случаях перенаправляем на страницу меню.
      navigate("/menu");
    } catch (err: unknown) {
      // Приводим unknown к FirebaseError-подобному типу и переводим коды на русский.
      const error = err as { code?: string };
      switch (error.code) {
        case "auth/email-already-in-use":
          setServerError("Этот email уже зарегистрирован.");
          break;
        case "auth/weak-password":
          setServerError("Пароль слишком простой (минимум 6 символов).");
          break;
        case "auth/invalid-credential":
          setServerError("Неверная почта или пароль.");
          break;
        default:
          setServerError("Ошибка доступа. Попробуйте снова.");
      }
    } finally {
      // В любом случае возвращаем кнопку в доступное состояние.
      setIsLoading(false);
    }
  };

  // Переключение вкладок (вход / регистрация) с очисткой формы и ошибок.
  const handleTabChange = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setServerError(null);
    reset();
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      {/* Вкладки переключения режима */}
      <div className="flex border-b border-stone-200">
        <button
          type="button"
          onClick={() => handleTabChange(true)}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            isLogin
              ? "bg-white text-tom-thumb-800 border-b-2 border-tom-thumb-800"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Вход
        </button>
        <button
          type="button"
          onClick={() => handleTabChange(false)}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            !isLogin
              ? "bg-white text-tom-thumb-800 border-b-2 border-tom-thumb-800"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          Регистрация
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-4"
      >
        {/* Заголовок формы */}
        <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">
          {isLogin ? "Авторизация" : "Создание аккаунта"}
        </h2>

        {/* Блок серверной ошибки */}
        {serverError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-medium border border-red-200">
            {serverError}
          </div>
        )}

        {/* Поле "Имя" — только в режиме регистрации */}
        {!isLogin && (
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-1">
              Имя
            </label>
            <input
              type="text"
              placeholder="Константин"
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
              {...register("name", { required: isLogin ? false : "Обязательное поле" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
        )}

        {/* Поле "Email" */}
        <div>
          <label className="block text-stone-700 text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="example@mail.ru"
            className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
            {...register("email", { required: "Введите email" })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Поле "Пароль" с minLength валидацией (>=6 символов, как требует Firebase) */}
        <div>
          <label className="block text-stone-700 text-sm font-medium mb-1">
            Пароль
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
            {...register("password", {
              required: "Введите пароль",
              minLength: { value: 6, message: "Минимум 6 символов" },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Поле "Подтверждение пароля" — только в режиме регистрации */}
        {!isLogin && (
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-1">
              Повторите пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-tom-thumb-600 focus:border-transparent transition-all"
              {...register("confirmPassword", {
                required: "Обязательное поле",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {/* Кнопка отправки. disabled и меняет текст во время загрузки. */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-tom-thumb-800 text-white py-3 rounded-xl font-medium hover:bg-tom-thumb-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed mt-4 shadow-sm"
        >
          {isLoading
            ? "Загрузка..."
            : isLogin
              ? "Войти в личный кабинет"
              : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
}
