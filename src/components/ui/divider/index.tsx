import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "../../../utils/cn";

export default function Divider({
  title,
  button,
}: {
  title: ReactNode;
  button?: { title: string; onClick: () => void; completeTitle?: ReactNode };
}) {
  return (
    <div>
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl !font-aviny dark:text-white">{title}</h1>
        <button
          onClick={button?.onClick}
          className={cn(
            "bg-primary-400 p-2 text-white rounded-md hover:bg-primary-main duration-200 shadow-lg",
            button?.onClick || "hidden"
          )}
        >
          <span className="text-xl !font-aviny flex items-center gap-1">
            {button?.completeTitle ? (
              button.completeTitle
            ) : (
              <>
                افزودن {button?.title} <Plus size={16} />
              </>
            )}
          </span>
        </button>
      </div>
      <div className="border-b-4 pt-3 border-primary-400"></div>
    </div>
  );
}
