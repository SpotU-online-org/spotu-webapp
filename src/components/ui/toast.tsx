"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

type ToastItem = { id: string; variant: ToastVariant; message: string };
type ToastContextValue = { toast: (message: string, variant?: ToastVariant) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const CONFIG: Record<ToastVariant, { Icon: React.ElementType; cls: string; iconCls: string }> = {
  success: {
    Icon: CheckCircle2,
    cls: "border-emerald-200 bg-emerald-50 text-emerald-800",
    iconCls: "text-emerald-600",
  },
  error: {
    Icon: AlertCircle,
    cls: "border-red-200 bg-red-50 text-red-800",
    iconCls: "text-red-500",
  },
  warning: {
    Icon: AlertTriangle,
    cls: "border-amber-200 bg-amber-50 text-amber-800",
    iconCls: "text-amber-500",
  },
  info: {
    Icon: Info,
    cls: "border-primary/20 bg-primary/5 text-primary",
    iconCls: "text-primary",
  },
};

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const { Icon, cls, iconCls } = CONFIG[item.variant];

  useEffect(() => {
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg",
        "animate-in slide-in-from-bottom-3 fade-in duration-250",
        cls
      )}
    >
      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", iconCls)} />
      <p className="text-sm font-medium flex-1 leading-snug">{item.message}</p>
      <button
        onClick={onDismiss}
        aria-label="Cerrar"
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity mt-0.5"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { id, variant, message }]);
  }, []);

  const dismiss = useCallback(
    (id: string) => setToasts((p) => p.filter((t) => t.id !== id)),
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <Toast key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
