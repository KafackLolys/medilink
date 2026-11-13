import { BadgeCheck, CalendarCheck, HeartPulse, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { GoogleAuthButton } from "./google-auth-button";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`grid size-10 place-items-center rounded-xl ${light ? "bg-white text-primary" : "bg-primary text-white"}`}>
        <HeartPulse className="size-5" aria-hidden />
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-night"}`}>Medihome</span>
    </div>
  );
}

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-night p-8 text-white md:flex md:flex-col md:justify-between md:p-10 xl:p-12">
      <div aria-hidden className="absolute -left-24 top-1/3 size-96 rounded-full bg-primary/40 blur-3xl" />
      <div aria-hidden className="absolute -right-24 bottom-0 size-80 rounded-full bg-secondary/35 blur-3xl" />
      <div className="relative"><Logo light /></div>

      <div className="relative mx-auto w-full max-w-xs pb-12 md:max-w-64 lg:max-w-[20.5rem]">
        <div className="rounded-3xl bg-white p-3 text-ink shadow-2xl motion-safe:animate-float md:p-3 lg:p-4">
          <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-muted md:text-[10px] lg:text-sm">Visite à domicile</p>
          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success md:px-2 md:py-0.5 md:text-[9px] lg:px-3 lg:py-1 lg:text-xs">Confirmée</span>
          </div>
        <div className="mt-3 flex items-center gap-3 md:mt-2 md:gap-2 lg:mt-3 lg:gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-secondary/15 text-lg font-bold text-secondary md:size-9 md:text-sm lg:size-12 lg:text-lg">SM</span>
            <div>
            <p className="font-bold md:text-xs lg:text-base">Dr Sarah Mbarga</p>
            <p className="text-sm text-muted md:text-[10px] lg:text-sm">Médecine générale</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-success md:text-[9px] lg:text-xs">
              <BadgeCheck className="size-4 md:size-3 lg:size-4" aria-hidden /> Médecin vérifié
              </p>
            </div>
          </div>
        <ul className="mt-3 space-y-2 rounded-2xl bg-surface p-2.5 text-sm md:mt-2 md:space-y-1 md:p-2 md:text-[10px] lg:mt-3 lg:space-y-2 lg:p-2.5 lg:text-sm">
          <li className="flex items-center gap-2"><CalendarCheck className="size-4 text-primary md:size-3 lg:size-4" aria-hidden /> Demain, 10 h 30</li>
          <li className="flex items-center gap-2"><MapPin className="size-4 text-primary md:size-3 lg:size-4" aria-hidden /> À 1,2 km de chez vous</li>
          </ul>
        </div>

        <div
        className="absolute -bottom-0 -right-6 w-52 rounded-2xl border border-white/25 bg-white/15 p-3 backdrop-blur-md motion-safe:animate-float md:w-40 md:p-2 lg:w-52 lg:p-3"
          style={{ animationDelay: "-3s" }}
        >
          <div className="mb-2 flex -space-x-2 md:mb-1" aria-hidden>
            {["bg-primary", "bg-secondary", "bg-warn"].map((c) => (
              <span key={c} className={`size-7 rounded-full border-2 border-night md:size-5 lg:size-7 ${c}`} />
            ))}
          </div>
          <p className="text-sm font-bold md:text-[10px] lg:text-sm">3 propositions reçues</p>
          <p className="text-xs text-blue-100/80 md:text-[8px] lg:text-xs">pour votre demande de cardiologie</p>
        </div>
      </div>

      <div className="relative">
        <h2 className="max-w-md text-2xl font-extrabold leading-tight tracking-tight lg:text-3xl">Votre santé, nos médecins à vos côtés</h2>
        <p className="mt-4 max-w-md text-sm text-blue-100/80 lg:text-base">
          Trouvez un médecin vérifié près de chez vous et recevez-le à domicile.
        </p>
      </div>
    </aside>
  );
}

export function AuthShell({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[1.05fr_1fr]">
      <BrandPanel />
      <main className="flex min-h-dvh flex-col bg-surface px-5 py-8 sm:px-10 md:px-8 lg:px-16">
        <div className="md:hidden"><Logo /></div>
        <div className={`m-auto w-full max-w-md py-8 md:py-2 ${compact ? "md:max-w-[18.25rem]" : "md:max-w-xs lg:max-w-sm"}`}>{children}</div>
        <p className="text-center text-sm text-muted md:text-xs lg:text-sm">
          Medihome ne remplace pas une consultation. En cas d’urgence médicale, contactez immédiatement les services d’urgence.
        </p>
      </main>
    </div>
  );
}

export function GoogleButton({ label }: { label: string }) {
  return <GoogleAuthButton label={label} />;
}

export function OrDivider({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 flex items-center gap-4 text-sm text-muted">
      <span className="h-px flex-1 bg-slate-200" /> {children} <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
