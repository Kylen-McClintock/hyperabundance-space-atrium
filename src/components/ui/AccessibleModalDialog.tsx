"use client";

import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

interface AccessibleModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

export function AccessibleModalDialog({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidthClass = "max-w-4xl",
  children,
}: AccessibleModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Fallback for browsers without native <dialog closedby="any"> support (e.g. Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };
    dialog.addEventListener("close", handleClose);

    const handleBackdropClick = (event: MouseEvent) => {
      if ("closedBy" in HTMLDialogElement.prototype) return;
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (isDialogContent) return;
      dialog.close();
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as Record<string, string>)}
      aria-labelledby={titleId}
      className={`m-auto w-[94vw] ${maxWidthClass} rounded-2xl border border-white/15 bg-slate-950/95 p-0 text-slate-100 shadow-2xl backdrop:bg-black/65 backdrop:backdrop-blur-xs`}
    >
      <div className="flex max-h-[88vh] flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-slate-900/80 px-6 py-4">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-300">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={`Close ${title}`}
            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/15 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </dialog>
  );
}
