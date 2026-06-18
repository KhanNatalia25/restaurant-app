import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase.config";
import Button from "../components/ui/Button";

// Описание интерфейса полей формы авторизации и регистрации
interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

export function meta() {
  return [{ title: "Авторизация | Вкусный Уголок" }];
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Инициализация react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AuthFormData>();

  // Следим за паролем для валидации совпадения при регистрации
  const passwordValue = watch("password");

  // Переключение режимов работы (вход / регистрация)
  const handleTabChange = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setServerError(null);
    reset(); // Очищаем поля формы при смене вкладки
  };

  // Метод отправки формы
  const onSubmit = async (data: AuthFormData) => {
    setServerError(null);
    setIsLoading(true);

    // Валидация совпадения паролей в режиме регистрации
    if (!isLogin && data.password !== data.confirmPassword) {
      setServerError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Выполняем вход по почте и паролю
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        // Создаем нового пользователя в Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        // Обновляем имя пользователя в его профиле Firebase, если оно заполнено
        if (data.name?.trim()) {
          await updateProfile(userCredential.user, {
            displayName: data.name.trim(),
          });
        }
      }

      // После успешной авторизации перенаправляем на страницу меню
      navigate("/menu");
    } catch (error: any) {
      console.error("Firebase Auth Error:", error);
      // Локализация сообщений об ошибках Firebase Auth
      switch (error.code) {
        case "auth/email-already-in-use":
          setServerError("Этот email уже зарегистрирован.");
          break;
        case "auth/weak-password":
          setServerError("Пароль слишком простой (минимум 6 символов).");
          break;
        case "auth/operation-not-allowed":
          setServerError("Регистрация по email/паролю отключена в Firebase. Включите ее в Firebase Console -> Authentication -> Sign-in method.");
          break;
        case "auth/network-request-failed":
          setServerError("Ошибка сети. Проверьте интернет-соединение и доступ к серверам Firebase.");
          break;
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setServerError("Неверные учетные данные или пользователь не существует.");
          break;
        default:
          setServerError(`Ошибка (${error.code || "unknown"}): ${error.message}`);
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-stone-100">
        {/* Кнопки переключения режимов */}
        <div className="flex border-b border-stone-200 mb-6">
          <button
            onClick={() => handleTabChange(true)}
            className={`flex-1 pb-3 text-lg font-semibold transition-colors ${
              isLogin
                ? "border-b-2 border-amber-600 text-amber-600"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => handleTabChange(false)}
            className={`flex-1 pb-3 text-lg font-semibold transition-colors ${
              !isLogin
                ? "border-b-2 border-amber-600 text-amber-600"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            Регистрация
          </button>
        </div>

        <h1 className="text-2xl font-bold text-stone-800 mb-6 text-center">
          {isLogin ? "Войти в аккаунт" : "Создать аккаунт"}
        </h1>

        {/* Вывод серверной ошибки */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-155">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Поле имени отображается только при регистрации */}
          {!isLogin && (
            <div>
              <label className="block text-stone-700 font-medium mb-1">Имя пользователя</label>
              <input
                type="text"
                {...register("name", { required: "Введите имя пользователя" })}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Имя"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-stone-700 font-medium mb-1">Электронная почта</label>
            <input
              type="email"
              {...register("email", {
                required: "Введите почту",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Неверный формат почты",
                },
              })}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="example@mail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Пароль</label>
            <input
              type="password"
              {...register("password", {
                required: "Введите пароль",
                minLength: {
                  value: 6,
                  message: "Пароль должен содержать минимум 6 символов",
                },
              })}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Поле подтверждения пароля отображается только при регистрации */}
          {!isLogin && (
            <div>
              <label className="block text-stone-700 font-medium mb-1">Подтвердите пароль</label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Повторите пароль",
                  validate: (value) =>
                    value === passwordValue || "Пароли не совпадают",
                })}
                className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full py-3 mt-4">
            {isLoading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
          </Button>
        </form>
      </div>
    </div>
  );
}
