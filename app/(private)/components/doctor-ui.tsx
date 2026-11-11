import type { ReactNode } from "react";

export const doctorCard = "rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:rounded-3xl";

export function DoctorPageHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-night sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted sm:text-base">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function SectionTitle({ children, trailing }: { children: ReactNode; trailing?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-extrabold text-night">{children}</h2>
      {trailing}
    </div>
  );
}
