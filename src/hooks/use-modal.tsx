import { useCallback, useState, type ReactNode } from "react";
import Modal from "../components/ui/modal";

type ModalState = {
  open: boolean;
  content?: ReactNode;
};

export default function useModal() {
  const [{ open, content }, setModalState] = useState<ModalState>({
    open: false,
    content: undefined,
  });

  const modalCloser = useCallback(() => {
    setModalState((prev) => ({ ...prev, open: false }));
  }, []);

  const modalOpener = useCallback((content: ReactNode) => {
    setModalState({ open: true, content });
  }, []);

  return {
    Modal: ({ className }: { className?: string }) => (
      <Modal
        className={className}
        content={content}
        open={open}
        closer={modalCloser}
      />
    ),
    modalOpener,
    modalCloser,
  };
}
