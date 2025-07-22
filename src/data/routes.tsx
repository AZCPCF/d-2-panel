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
import type { ClientContextType } from "../context/client-context";

export const routes: {
  title: string;
  route: string;
  icon: LucideIcon;
  statsKey?: keyof ClientContextType;
}[] = [
  { title: "سفارشات", route: "orders", icon: ShoppingBag },
  { title: "کیف پول", route: "wallet", icon: Wallet },
  { title: "آدرس ها", route: "addresses", icon: MapPin },
  {
    title: "سبد خرید",
    route: "cart",
    icon: ShoppingCart,
    statsKey: "cart_count",
  },
  {
    title: "پیام ها",
    route: "messages",
    icon: Mail,
    statsKey: "unread_message",
  },
  {
    title: "تخفیف ها",
    route: "discounts",
    icon: CirclePercent,
    statsKey: "unread_discount",
  },
  { title: "یادآور تولد", route: "birth-dates", icon: Cake },
  { title: "علاقه مندی ها", route: "favorites", icon: BookHeart },
  {
    title: "پشتیبانی",
    route: "tickets",
    icon: Headset,
    statsKey: "unread_ticket",
  },
  { title: "نظرات", route: "comments", icon: MessageCircle },
];
