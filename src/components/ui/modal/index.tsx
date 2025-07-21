import { XIcon } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "../../../utils/cn";
import Portal from "../portal";

type ModalProps = {
  open: boolean;
  content: ReactNode;
  closer: () => void;
  className?: string;
};

export default function Modal({
  open,
  content,
  closer,
  className,
}: ModalProps) {
  if (!open) return null;

  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    // Optional: if modal should close when clicking outside
    if (e.target === e.currentTarget) {
      closer();
    }
  };

  return (
    <Portal>
      <div
        className="back fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm modal"
        onClick={handleOutsideClick}
      >
        <div
          className={cn(
            "bg-background dark:text-white p-2 rounded-lg shadow-md max-w-xl min-w-xl max-sm:min-w-lg max-[520px]:!min-w-[350px]",
            className
          )}
        >
          <div className="ml-auto w-full flex justify-end mb-4 !cursor-auto">
            <XIcon
              role="button"
              onClick={closer}
              className="hover:text-red-500 duration-100 cursor-pointer"
            />
          </div>
          {content}
        </div>
      </div>
    </Portal>
  );
}
