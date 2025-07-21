import React from "react";
import { cn } from "../../../utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export const Button = ({
  className,
  variant = "default",
  ...props
}: ButtonProps) => {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition-all border border-transparent";
  const variants = {
    default: "bg-primary-main text-white hover:bg-primary-600",
    outline:
      "border-gray-300 text-gray-700 hover:bg-gray-100 bg-background dark:text-white dark:hover:bg-gray-500",
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
};
