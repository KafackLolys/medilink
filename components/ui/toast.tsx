"use client";

import * as React from "react";
import { useToastStore } from "@/store/toast-store";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const ToastProvider = React.createContext<{
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
} | null>(null);

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

type ToastProps = Toast;

function ToastComponent({ id, title, description, variant = "default", duration = 4000 }: ToastProps) {
  const removeToast = useToastStore((state) => state.removeToast);

  const baseClasses = "flex items-center gap-3 rounded-xl border p-4 text-sm shadow-lg animate-in fade-in slide-in-from-right-2 duration-300";
  const variantClasses = {
    default: "bg-background text-foreground border-border",
    destructive: "bg-destructive text-destructive-foreground border-destructive",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant])}
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-col gap-1">
        {title && <h3 className="font-semibold">{title}</h3>}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <button
        onClick={() => removeToast(id)}
        className="absolute right-2 top-2 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Fermer la notification"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function Toast({ children, ...props }: ToastProps & { children?: React.ReactNode }) {
  return <ToastComponent {...props} />;
}

export function useToast() {
  const store = React.useContext(ToastProvider);
  if (!store) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  const { addToast, removeToast } = store;
  const toasts = useToastStore((state) => state.toasts);

  function toast(props: Omit<Toast, "id">) {
    return addToast(props);
  }

  return { toast, toasts };
}

export function ToastProviderComponent({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider.Provider value={{ addToast: useToastStore((state) => state.addToast), removeToast: useToastStore((state) => state.removeToast) }}>
      {children}
    </ToastProvider.Provider>
  );
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}

