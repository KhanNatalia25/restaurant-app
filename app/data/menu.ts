import type { MenuItem } from "../types";

// изображения находятся в папке public/images/
export const menuData: MenuItem[] = [
  {
    id: 1,
    name: "Брускетта с томатами",
    description: "Хрустящий багет с сочными томатами, чесноком, базиликом и оливковым маслом",
    price: 450,
    image: "/images/брускетта-с-томатами.jpg",
    category: "Закуски",
  },
  {
    id: 2,
    name: "Сырный суп",
    description: "Нежный сливочный суп с плавленым сыром, гренками и зеленью",
    price: 320,
    image: "/images/сырный-суп.jpg",
    category: "Основные блюда",
  },
  {
    id: 3,
    name: "Картофель фри с соусом",
    description: "Золотистый картофель фри с фирменным чесночным соусом",
    price: 120,
    image: "/images/картофель-фри-с-соусом.jpg",
    category: "Закуски",
  },
  {
    id: 4,
    name: "Бургер с говядиной",
    description: "Сочная котлета из мраморной говядины, сыр чеддер, свежие овощи и соус BBQ",
    price: 520,
    image: "/images/бургер-с-мраморной-говядиной.jpg",
    category: "Основные блюда",
  },
  {
    id: 5,
    name: "Тирамису",
    description: "Классический итальянский десерт с маскарпоне и кофе",
    price: 350,
    image: "/images/тирамису.jpg",
    category: "Десерты",
  },
  {
    id: 6,
    name: "Чизкейк",
    description: "Нежный творожный чизкейк с ягодным соусом",
    price: 320,
    image: "/images/чизкейк.jpg",
    category: "Десерты",
  },
  {
    id: 7,
    name: "Апельсиновый сок",
    description: "Свежевыжатый апельсиновый сок",
    price: 150,
    image: "/images/апельсиновый-сок.jpg",
    category: "Напитки",
  },
  {
    id: 8,
    name: "Капучино",
    description: "Кофе с нежной молочной пеной",
    price: 120,
    image: "/images/капучино.jpg",
    category: "Напитки",
  },
];