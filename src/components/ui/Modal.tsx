"use client";

import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-100/70" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 text-gray-700">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">{footer}</div>}
      </div>
    </div>
  );
}
