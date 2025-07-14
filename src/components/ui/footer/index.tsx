import { FaRegCopyright } from "react-icons/fa";
import { appUrl } from "../../../utils/env";
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
        href={appUrl}
        className="flex dark:!text-[#fed00d] flex-row-reverse text-xl items-center gap-2"
      >
        <FaRegCopyright /> dadekavweb
      </a>
    </footer>
  );
}
