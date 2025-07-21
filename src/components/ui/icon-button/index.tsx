import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../utils/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  "aria-label"?: string;
  className?: string;
}

export default function IconButton({
  icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted/40 transition",
        className
      )}
    >
      {icon}
    </button>
  );
}
