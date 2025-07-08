import type { IconType } from "react-icons";
import { BiSupport } from "react-icons/bi";
import {
    FaRegComment
} from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { IoWalletOutline } from "react-icons/io5";
import { LuShoppingBag, LuShoppingCart } from "react-icons/lu";
import { MdFavoriteBorder, MdOutlineLocationOn } from "react-icons/md";
import { RiCake2Line, RiDiscountPercentLine } from "react-icons/ri";

export const routes: { title: string; route: string; icon: IconType }[] = [
  { title: "سفارشات", route: "orders", icon: LuShoppingBag },
  { title: "کیف پول", route: "wallet", icon: IoWalletOutline },
  { title: "آدرس ها", route: "addresses", icon: MdOutlineLocationOn },
  { title: "سبد خرید", route: "cart", icon: LuShoppingCart },
  { title: "پیام ها", route: "messages", icon: FaRegMessage },
  { title: "تخفیف ها", route: "discounts", icon: RiDiscountPercentLine },
  { title: "یادآور تولد", route: "birth-dates", icon: RiCake2Line },
  { title: "علاقه مندی ها", route: "favorites", icon: MdFavoriteBorder },
  { title: "پشتیبانی", route: "tickets", icon: BiSupport },
  { title: "نظرات", route: "comments", icon: FaRegComment },
];
