"use client";

export type TabItem<T extends string> = { id: T; label: string; count?: number };

export function Tabs<T extends string>({ items, value, onChange, label }: { items: TabItem<T>[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none]">
      {items.map((t) => {
        const on = t.id === value;
        return (
          <button key={t.id} role="tab" aria-selected={on} onClick={() => onChange(t.id)}
            className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 ${on ? "bg-primary text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)]" : "bg-white text-muted hover:text-ink"}`}>
            {t.label}
            {t.count !== undefined && (
              <span className={`rounded-full px-2 py-0.5 text-xs ${on ? "bg-white/25 text-white" : "bg-slate-100 text-muted"}`}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}