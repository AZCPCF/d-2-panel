import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export default function Portal({
  children,
  id = "modal",
}: {
  children: ReactNode;
  id?: string;
}) {
  return createPortal(children, document.getElementById(id)!);
}
