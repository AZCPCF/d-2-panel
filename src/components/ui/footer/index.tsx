import { Copyright } from "lucide-react";
import { useAuth } from "../../../context/auth-context";
import { cn } from "../../../utils/cn";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  return (
    <footer
      className={cn(
        "w-full flex justify-center relative",
        !isAuthenticated && "hidden"
      )}
    >
      <a
        target="_blank"
        href={"https://www.dadekavweb.ir"}
        className="flex dark:!text-[#fed00d] flex-row-reverse text-xl items-center gap-2"
      >
        <Copyright /> dadekavweb
      </a>
    </footer>
  );
}
