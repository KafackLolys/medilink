import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
  loading?: boolean;
  compact?: boolean;
};

export function Button({ variant = "primary", loading, disabled, compact, className = "", children, ...rest }: Props) {
  const styles =
    variant === "primary"
      ? "bg-primary text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,.6)] hover:bg-blue-700"
      : "border border-slate-200 bg-white text-ink hover:bg-slate-50";
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "md:h-8 md:rounded-lg md:text-xs" : ""} ${styles} ${className}`}
    >
      {loading && <Loader2 className="size-5 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
