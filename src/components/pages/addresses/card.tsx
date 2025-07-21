import { MoreVertical, Trash, Pencil } from "lucide-react";
import { useState } from "react";

type Props = {
  data: {
    id: number;
    title: string;
    text: string;
    full_name?: string;
    phone_number?: string;
  };
  onEdit: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function AddressCard({ data, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative p-4 rounded-xl shadow-md bg-background hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold text-xl text-zinc-800 dark:text-primary-main">
            {data.title}
          </h3>
          {data.full_name && (
            <p className="text-base text-zinc-500 dark:text-zinc-300">
              گیرنده: {data.full_name}
            </p>
          )}
          {data.phone_number && (
            <p className="text-base text-zinc-500 dark:text-zinc-300">
              شماره تماس: {data.phone_number}
            </p>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          aria-label="Toggle menu"
        >
          <MoreVertical className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-12 left-4 w-36 bg-background border border-zinc-200 dark:border-zinc-400 rounded-md shadow-lg z-50 animate-fade-in">
          <button
            onClick={() => onEdit(data.id)}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-2 text-blue-600 dark:text-blue-400 rounded-t-md"
          >
            <Pencil className="w-4 h-4" />
            ویرایش
          </button>
          <button
            onClick={() => onDelete(data.id)}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-100 dark:hover:bg-red-900 gap-2 text-red-600 dark:text-red-400 rounded-b-md"
          >
            <Trash className="w-4 h-4" />
            حذف
          </button>
        </div>
      )}
    </div>
  );
}
