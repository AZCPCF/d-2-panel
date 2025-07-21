import { Link, useNavigate } from "@tanstack/react-router";
import {
  CircleUser,
  LogOut,
  Mail,
  Moon,
  ShoppingCart,
  Sun,
} from "lucide-react";
import { useState } from "react";
import logo from "../../../assets/images/logo.png";
import { useAuth } from "../../../context/auth-context";
import { cn } from "../../../utils/cn";
import { toggleTheme } from "../../../utils/toggle-theme";
import { useClient } from "../../../context/client-context";
export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { cart_count, unread_discount, unread_message } = useClient();
  const [openDropdown, setOpenDropdown] = useState<null | "cart" | "account">(
    null
  );

  if (!isAuthenticated) return null;
  const handleToggle = (dropdown: "cart" | "account") => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <header className="p-3 absolute top-0 w-full z-50">
      <div className="rounded-lg p-2 gap-10 px-4 bg-primary-400 dark:bg-slate-700 w-full backdrop-blur-md flex flex-wrap justify-between shadow-lg relative items-center">
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            className="brightness-0 invert-100 w-14 h-14"
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6 relative">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="dark:!text-primary-main text-white pb-1.5 text-[28px]"
          >
            <Moon className="hidden dark:block" />
            <Sun className="dark:hidden" />
          </button>

          {/* Cart Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleToggle("cart")}
              data-stats={cart_count}
              className="text-white dark:!text-primary-main text-2xl stats"
            >
              <ShoppingCart />
            </button>
            <div
              className={cn(
                "absolute left-0 top-8 w-52 bg-white dark:bg-slate-800 text-sm rounded-lg shadow-lg dark:shadow-2xl overflow-hidden transition-all duration-200 z-50",
                openDropdown === "cart"
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 translate-y-2 pointer-events-none"
              )}
            >
              <div className="px-4 py-3 !text-primary-main text-lg font-semibold">
                سبد خرید
              </div>
              <div className="text-base px-4 py-2 text-gray-500 dark:text-gray-300">
                هیچ محصولی اضافه نشده است.
              </div>
              <Link
                to="/cart"
                onClick={() => setOpenDropdown(null)}
                className="block px-4 py-2 text-center text-lg !text-primary-main hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                مشاهده سبد خرید
              </Link>
            </div>
          </div>

          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleToggle("account")}
              data-stats={unread_discount + unread_message}
              className="text-white dark:!text-primary-main text-2xl stats"
            >
              <CircleUser />
            </button>
            <div
              className={cn(
                "absolute left-0 top-8 w-56 bg-white dark:bg-slate-800 text-sm rounded-lg shadow-lg dark:shadow-2xl overflow-hidden transition-all duration-200 z-50",
                openDropdown === "account"
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 translate-y-2 pointer-events-none"
              )}
            >
              <Link
                to="/profile"
                onClick={() => setOpenDropdown(null)}
                className="flex items-center gap-2 px-4 py-2 !text-black dark:!text-white hover:bg-gray-100 dark:hover:bg-slate-600 text-xl"
              >
                <CircleUser className="text-2xl" />
                مشخصات کاربر
              </Link>
              <Link
                to="/messages"
                onClick={() => setOpenDropdown(null)}
                className="flex items-center gap-2 px-4 py-2 !text-black dark:!text-white hover:bg-gray-100 dark:hover:bg-slate-600 text-xl relative"
              >
                <Mail className="text-xl" />
                <span>پیام‌ها</span>
                <div className="absolute top-1/2 left-6 translate-y-1/2">
                  <div
                    className="stats"
                    data-stats={unread_discount + unread_message}
                  ></div>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                  setOpenDropdown(null);
                }}
                className="flex items-center gap-2 text-lg text-red-500 w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600"
              >
                <LogOut className="text-lg" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
