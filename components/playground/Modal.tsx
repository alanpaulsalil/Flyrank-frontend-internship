"use client";

import { useEffect, useRef, type ReactNode, type KeyboardEvent } from "react";

/**
 * Modal Dialog — W3C ARIA "Dialog (Modal)" pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ isOpen, onClose, titleId, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) triggerRef.current = document.activeElement as HTMLElement | null;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const dialogEl = dialogRef.current;
    dialogEl?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const siblings = Array.from(document.body.children).filter(
      (el) => el !== dialogEl?.closest("[data-modal-root]")
    );
    siblings.forEach((el) => el.setAttribute("aria-hidden", "true"));

    return () => {
      siblings.forEach((el) => el.removeAttribute("aria-hidden"));
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab") return;

    const dialogEl = dialogRef.current;
    if (!dialogEl) return;
    const focusables = Array.from(dialogEl.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!isOpen) return null;

  return (
    <div data-modal-root className="modal-overlay" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="modal-panel"
        onKeyDown={handleKeyDown}
        onMouseDown={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <h2 id={titleId} className="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        <button type="button" onClick={onClose} className="modal-close">
          Close
        </button>
      </div>
    </div>
  );
}