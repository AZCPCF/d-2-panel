import {
  BookHeart,
  Cake,
  CirclePercent,
  Headset,
  Mail,
  MapPin,
  MessageCircle,
  ShoppingBag,
  ShoppingCart,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const routes: { title: string; route: string; icon: LucideIcon }[] = [
  { title: "سفارشات", route: "orders", icon: ShoppingBag },
  { title: "کیف پول", route: "wallet", icon: Wallet },
  { title: "آدرس ها", route: "addresses", icon: MapPin },
  { title: "سبد خرید", route: "cart", icon: ShoppingCart },
  { title: "پیام ها", route: "messages", icon: Mail },
  { title: "تخفیف ها", route: "discounts", icon: CirclePercent },
  { title: "یادآور تولد", route: "birth-dates", icon: Cake },
  { title: "علاقه مندی ها", route: "favorites", icon: BookHeart },
  { title: "پشتیبانی", route: "tickets", icon: Headset },
  { title: "نظرات", route: "comments", icon: MessageCircle },
];
