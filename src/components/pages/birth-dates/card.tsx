import { MoreVertical, Trash } from "lucide-react";

type Props = {
  id: number;
  title: string;
  date: string;
  isMenuOpen: boolean;
  onMenuToggle: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function BirthDateCard({
  id,
  title,
  date,
  isMenuOpen,
  onMenuToggle,
  onDelete,
}: Props) {
  return (
    <div className="relative p-4 rounded-lg shadow-md bg-background hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-zinc-800 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            <span>تاریخ تولد : </span>
            {date}
          </p>
        </div>

        <button
          className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-500 transition"
          onClick={() => onMenuToggle(id)}
          aria-label="Toggle menu"
        >
          <MoreVertical className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-12 left-4 w-36 bg-background border border-zinc-200 dark:border-zinc-400 rounded-md shadow-lg z-50 animate-fade-in">
          <button
            onClick={() => onDelete(id)}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-100 dark:hover:bg-red-900 gap-2 text-red-600 dark:text-red-400 rounded-md"
          >
            <Trash className="w-4 h-4" />
            حذف
          </button>
        </div>
      )}
    </div>
  );
}
