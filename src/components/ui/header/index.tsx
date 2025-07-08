import { Link, useNavigate } from "@tanstack/react-router";
import { BiMoon } from "react-icons/bi";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { MdOutlineMessage } from "react-icons/md";
import { PiUserCircleLight } from "react-icons/pi";
import logo from "../../../assets/images/logo.png";
import { toggleTheme } from "../../../utils/toggle-theme";
import { useAuth } from "../../../context/auth-context";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  if (!isAuthenticated) return null;

  return (
    <header className="p-3">
      <div className="rounded-lg p-2 gap-10 px-4 bg-primary-main dark:bg-slate-700 w-full backdrop-blur-md flex flex-wrap justify-between shadow-lg relative items-center">
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            className="brightness-0 invert-100 w-14 h-14"
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="dark:!text-primary-main text-white text-[28px]"
          >
            <BiMoon className="hidden dark:block" />
            <IoSunnyOutline className="dark:hidden" />
          </button>

          {/* Cart Dropdown */}
          <div
            data-stats={4}
            className="relative h-6 group focus-within:z-50 stats"
          >
            <button
              className="text-white dark:!text-primary-main text-2xl "
              tabIndex={0}
            >
              <FaShoppingCart />
            </button>
            <button
              className="absolute w-0 h-0 opacity-0 pointer-events-none"
              aria-hidden
            />
            <div className="dropdown">
              <div className="px-4 py-3 !text-primary-main text-lg font-semibold">
                سبد خرید
              </div>
              <div className="text-sm px-4 py-2 text-gray-500 dark:text-gray-300">
                هیچ محصولی اضافه نشده است.
              </div>
              <Link
                to="/cart"
                className="block px-4 py-2 text-center text-sm !text-primary-main hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                مشاهده سبد خرید
              </Link>
            </div>
          </div>

          {/* Account Dropdown */}
          <div
            className="relative h-6 group focus-within:z-50 stats"
            data-stats={10}
          >
            <button
              className="text-white dark:!text-primary-main text-2xl"
              tabIndex={0}
            >
              <FaUser />
            </button>
            <button
              className="absolute w-0 h-0 opacity-0 pointer-events-none"
              aria-hidden
            />
            <div className="dropdown">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 !text-black dark:!text-white hover:bg-gray-100 dark:hover:bg-slate-600 text-xl"
              >
                <PiUserCircleLight className="text-2xl" />
                مشخصات کاربر
              </Link>
              <Link
                to="/messages"
                className="flex items-center gap-2 px-4 py-2 !text-black dark:!text-white hover:bg-gray-100 dark:hover:bg-slate-600 text-xl"
              >
                <MdOutlineMessage className="text-xl" />
                <span>پیام‌ها</span>
                <div className="left-4 absolute">
                  <div className="stats" data-stats={10}></div>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
                className="flex items-center gap-2 text-lg text-red-500 w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600"
              >
                <LuLogOut className="text-lg" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
