import type { ReactNode } from 'react';

type ModalProps = {
  children: ReactNode;
  onClose?: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-overlay flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
