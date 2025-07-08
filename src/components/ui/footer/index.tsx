import { FaRegCopyright } from "react-icons/fa";
import { appUrl } from "../../../utils/env";

export default function Footer() {
  return (
    <footer className="w-full flex justify-center fixed bottom-4">
      <a
        target="_blank"
        href={appUrl}
        className="flex text-primary-main flex-row-reverse text-xl items-center gap-2"
      >
        <FaRegCopyright /> dadekavweb
      </a>
    </footer>
  );
}
