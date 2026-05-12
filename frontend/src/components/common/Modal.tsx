import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  bodyClassName?: string;
  children: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

function Modal({
  bodyClassName = '',
  children,
  footer,
  headerAction,
  isOpen,
  onClose,
  title
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const portalTarget = useMemo(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    return document.body;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !portalTarget || !isOpen) {
    return null;
  }

  return createPortal(
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-md animate-[fadeIn_180ms_ease-out]"
    onClick={onClose}
    role="presentation"
  >
    <div
      aria-modal="true"
      className="w-full max-w-[560px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
      onClick={(event) => event.stopPropagation()}
      role="dialog"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Dashboard Module
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {title}
            </h2>
          </div>

          {headerAction}
        </div>

        {/* Close */}
        <button
          aria-label="Close modal"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-[#F8FAFC] text-lg leading-none text-slate-600 transition hover:bg-[#EEF4FF] hover:text-slate-950"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div
        className={[
          'max-h-[75vh] overflow-y-auto bg-white px-6 py-5 text-slate-950',
          bodyClassName
        ].join(' ')}
      >
        {children}
      </div>

      {/* Footer */}
      {footer ? (
        <div className="border-t border-slate-200 bg-[#F8FAFC] px-6 py-5">
          {footer}
        </div>
      ) : null}
    </div>
  </div>,
  portalTarget
);
}

export default Modal;
