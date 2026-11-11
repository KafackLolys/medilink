"use client";
import { Logo } from "@/components/custum/auth-shell";
import { Bell, CalendarDays, FileText, House, Plus, Stethoscope } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/patient", label: "Tableau de bord", short: "Accueil", exact: true, Icon: House },
  { href: "/patient/medecins", label: "Trouver un médecin", short: "Médecins", Icon: Stethoscope },
  { href: "/patient/besoins/nouveau", label: "Publier un besoin", short: "Publier", Icon: Plus },
  { href: "/patient/demandes", label: "Mes demandes", short: "Demandes", Icon: FileText },
  { href: "/patient/rendez-vous", label: "Rendez-vous", short: "Rendez-vous", Icon: CalendarDays },
];

function useActive() {
  const path = usePathname();
  return (l: { href: string; exact?: boolean }) => (l.exact ? path === l.href : path.startsWith(l.href));
}

export function Header() {
  const isActive = useActive();
  return (
    <header className="sticky top-0 z-30 px-5 pt-4 sm:px-8">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between rounded-full border border-white bg-white/85 py-2.5 pl-5 pr-2.5 shadow-[0_8px_30px_-12px_rgba(30,41,59,.14)] backdrop-blur">
        <div className="flex items-center gap-6">
          <Link href="/patient" aria-label="MedLink, tableau de bord"><Logo /></Link>
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={isActive(l) ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] transition ${isActive(l) ? "bg-primary/10 font-bold text-primary" : "font-medium text-muted hover:text-ink"}`}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <button aria-label="Notifications (3 nouvelles)" className="relative grid size-11 place-items-center rounded-full text-ink hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25">
            <Bell className="size-5" aria-hidden />
            <span className="absolute right-3 top-3 size-2.5 rounded-full border-2 border-white bg-danger" aria-hidden />
          </button>
          <Link href="/patient/profil" className="flex items-center gap-2.5 rounded-full bg-surface py-1 pl-1 pr-4 hover:bg-slate-100">
            <span className="grid size-9 place-items-center rounded-full bg-secondary text-sm font-bold text-white">PN</span>
            <span className="hidden text-[15px] font-semibold sm:block">Profil</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PatientBottomNav() {
  const isActive = useActive();
  return (
    <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5 items-end px-2">
        {LINKS.map((l) => {
          const on = isActive(l);
          const center = l.short === "Publier";
          return (
            <li key={l.href}>
              <Link href={l.href} aria-current={on ? "page" : undefined} className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold whitespace-nowrap">
                {center ? (
                  <span className="-mt-7 grid size-14 place-items-center rounded-full bg-primary text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,.7)] ring-4 ring-white"><l.Icon className="size-6" strokeWidth={2.5} aria-hidden /></span>
                ) : (
                  <l.Icon className={`size-6 ${on ? "text-primary" : "text-muted"}`} aria-hidden />
                )}
                <span className={on ? "text-primary" : "text-muted"}>{l.short}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
