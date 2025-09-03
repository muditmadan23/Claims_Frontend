"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ToastType = "success" | "error" | "info";

export interface ToastOptions {
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number; // ms
}

interface Toast extends Required<Omit<ToastOptions, "duration" | "type">> {
  id: string;
  type: ToastType;
  duration: number;
}

interface ToastContextValue {
  show: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const typeStyles: Record<ToastType, { ring: string; icon: React.ReactNode; bg: string }> = {
    success: {
      ring: "ring-green-500",
      bg: "bg-green-50",
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      ring: "ring-red-500",
      bg: "bg-red-50",
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    info: {
      ring: "ring-blue-500",
      bg: "bg-blue-50",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 110-18 9 9 0 010 18z" />
        </svg>
      ),
    },
  };

  return (
    <div className={`pointer-events-auto w-80 rounded-lg shadow ring-1 ${typeStyles[toast.type].ring} ${typeStyles[toast.type].bg} border border-gray-200/60`}>
      <div className="p-3 flex gap-3 items-start">
        <div className="shrink-0 mt-0.5">{typeStyles[toast.type].icon}</div>
        <div className="flex-1 min-w-0">
          {toast.title && <div className="text-sm font-semibold text-gray-900">{toast.title}</div>}
          <div className="text-sm text-gray-700 leading-snug">{toast.message}</div>
        </div>
        <button aria-label="Close" onClick={() => onClose(toast.id)} className="text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const show = useCallback(
    (opts: ToastOptions) => {
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random()}`;
      const toast: Toast = {
        id,
        title: opts.title ?? "",
        message: opts.message,
        type: opts.type ?? "info",
        duration: opts.duration ?? 3500,
      };
      setToasts((prev) => [toast, ...prev]);
      timers.current[id] = setTimeout(() => dismiss(id), toast.duration);
      return id;
    },
    [dismiss]
  );

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
