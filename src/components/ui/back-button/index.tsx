import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

type Props = {
  label?: string;
  to?: string;
};

export default function BackButton({ label = "بازگشت", to = ".." }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate({ to, replace: true })}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-medium text-white dark:text-zinc-100 bg-primary-main hover:bg-primary-main/90 focus:outline-none focus:ring-2 focus:ring-primary-main/40 active:scale-[0.98] transition-all duration-150 shadow-md dark:shadow-none hover:*:ml-1 *:duration-200 mb-4"
    >
      <ArrowRight className="w-4 h-4" />
      {label}
    </button>
  );
}
