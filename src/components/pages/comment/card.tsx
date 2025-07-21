import { MessageSquareText } from "lucide-react";
import { cn } from "../../../utils/cn";

type Comment = {
  id: number;
  message: string;
  admin_answer: string | null;
  is_accepted: boolean;
  product: { id: number; title: string };
};

export default function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="rounded-md p-4 bg-background dark:text-white shadow-sm hover:shadow-md duration-200 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg truncate font-semibold text-gray-800 dark:text-primary-main">
          محصول: {comment.product.title}
        </h3>
        <span
          className={cn(
            `text-xs px-2 py-1 rounded text-nowrap`,
            comment.is_accepted
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          )}
        >
          {comment.is_accepted ? "تایید شده" : "در انتظار تایید"}
        </span>
      </div>

      <p className="text-gray-700 dark:text-white text-base flex gap-2 truncate items-center">
        <MessageSquareText size={20} /> {comment.message}
      </p>

      {comment.admin_answer && (
        <div className="text-sm bg-gray-200 p-2 rounded text-gray-600 dark:bg-gray-400 dark:text-white">
          پاسخ ادمین : <span className="truncate">{comment.admin_answer}</span>
        </div>
      )}
    </div>
  );
}
