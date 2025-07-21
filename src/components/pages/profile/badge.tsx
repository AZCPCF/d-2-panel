import { cn } from "../../../utils/cn";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "outline" | "destructive";
};

export function Badge({ children, className, variant = "outline" }: BadgeProps) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";

  const variants = {
    outline: "border border-gray-300 text-gray-700 bg-white",
    destructive: "bg-red-100 text-red-700 border border-red-300",
  };

  return <span className={cn(base, variants[variant], className)}>{children}</span>;
}
