import { Link } from "@tanstack/react-router";
import { FaQuestionCircle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-40 text-right px-4">
      <h1 className="text-7xl font-extrabold text-primary-main mb-4 flex gap-2 items-center">
        <span>4</span>
        <FaQuestionCircle className="text-4xl" />
        <span>4</span>
      </h1>
      <h2 className="text-3xl text-gray-900 dark:text-primary-700 mb-2">
        صفحه پیدا نشد
      </h2>
      <p className="text-gray-600 mb-6 max-[500px]:text-sm text-lg dark:text-white">
        ممکن است این صفحه حذف شده باشد یا آدرس وارد شده نادرست باشد.
      </p>
      <Link
        to="/"
        className="bg-primary-main !text-white px-5 py-2 rounded hover:bg-primary-600 transition"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
