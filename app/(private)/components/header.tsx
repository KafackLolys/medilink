"use client";
import { Logo } from "@/components/custum/auth-shell";
import { ConfirmDialog } from "@/components/custum/confirm-dialog";
import { Bell, CalendarDays, CheckCircle2, FileText, House, LogOut, MessageCircle, Plus, Send, Stethoscope, User, Users } from "lucide-react";
import { DOCTOR_PROFILE } from "@/lib/doctor-dashboard-data";
import { PATIENT_PROFILE } from "@/lib/patient-profile-data";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuthSession } from "@/hooks/use-auth-session";
import { authStore } from "@/store/auth-store";
import { authService } from "@/services/auth-service";

const LINKS = [
  { href: "/patient", label: "Tableau de bord", short: "Accueil", exact: true, Icon: House },
  { href: "/patient/medecins", label: "Trouver un médecin", short: "Médecins", Icon: Stethoscope },
  { href: "/patient/besoins/nouveau", label: "Publier un besoin", short: "Publier", Icon: Plus },
  { href: "/patient/demandes", label: "Mes demandes", short: "Demandes", Icon: FileText },
  { href: "/patient/rendez-vous", label: "Rendez-vous", short: "Rendez-vous", Icon: CalendarDays },
];

const DOCTOR_LINKS = [
  { href: "/medecin", label: "Tableau de bord", short: "Accueil", exact: true, Icon: House },
  { href: "/medecin/besoins", label: "Besoins des patients", short: "Besoins", Icon: Users },
  { href: "/medecin/propositions", label: "Mes propositions", short: "Propositions", Icon: Send },
  { href: "/medecin/rendez-vous", label: "Rendez-vous", short: "Agenda", Icon: CalendarDays },
  { href: "/medecin/messages", label: "Messages", short: "Messages", Icon: MessageCircle },
];

function useActive() {
  const path = usePathname();
  return (l: { href: string; exact?: boolean }) => (l.exact ? path === l.href : path.startsWith(l.href));
}

export function Header() {
  const path = usePathname();
  const router = useRouter();
  const doctor = path.startsWith("/medecin");
  const links = doctor ? DOCTOR_LINKS : LINKS;
  const isActive = useActive();
  const session = useAuthSession();
  const user = session?.user;
  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : doctor ? "Espace médecin" : PATIENT_PROFILE.name;
  const initials = user
    ? [user.firstName, user.lastName].filter(Boolean).map((part) => part![0]).join("").slice(0, 2).toUpperCase() || (doctor ? DOCTOR_PROFILE.initials : PATIENT_PROFILE.initials)
    : doctor ? DOCTOR_PROFILE.initials : PATIENT_PROFILE.initials;

  async function logout() {
    await authService.logout();
    authStore.getState().clearSession();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 px-5 pt-4 sm:px-8">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between rounded-full border border-white bg-white/85 py-2.5 pl-5 pr-2.5 shadow-[0_8px_30px_-12px_rgba(30,41,59,.14)] backdrop-blur">
        <div className="flex items-center gap-6">
          <Link href={doctor ? "/medecin" : "/patient"} aria-label="MedLink, tableau de bord"><Logo /></Link>
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
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

          <Popover>
            <PopoverTrigger
              render={
                <button type="button" aria-label="Ouvrir le menu du compte" className="flex items-center gap-2.5 rounded-full bg-surface py-1 pl-1 pr-4 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25">
                  <span className={`grid size-9 place-items-center rounded-full text-sm font-bold ${doctor ? "bg-sky-100 text-primary" : "bg-secondary text-white"}`}>{initials}</span>
                  <span className="hidden text-[15px] font-semibold sm:block">Profil</span>
                  {doctor && <span className="hidden items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 xl:inline-flex"><CheckCircle2 className="size-5" aria-hidden /> </span>}
                </button>
              }
            />
            <PopoverContent align="end" className="w-80 rounded-2xl border border-slate-100 p-2.5 shadow-xl">
              <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
                <span className={`grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold ${doctor ? "bg-sky-100 text-primary" : "bg-secondary text-white"}`}>{initials}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{fullName}</p>
                  <p className="truncate text-xs text-muted">{user?.email ?? (doctor ? "Compte médecin" : "Compte patient")}</p>
                </div>
                {doctor && <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-label="Compte médecin vérifié" />}
              </div>
              <Link href={doctor ? "/medecin/profil" : "/patient/profil"} className="flex h-11 items-center gap-3 rounded-xl px-3 font-semibold text-ink transition hover:bg-slate-50 hover:text-primary">
                <User className="size-4 text-muted" aria-hidden />
                Gérer mon profil
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <ConfirmDialog
                trigger={
                  <button type="button" className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left font-semibold text-danger transition hover:bg-danger/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger/15">
                    <LogOut className="size-4" aria-hidden />
                    Se déconnecter
                  </button>
                }
                title="Confirmer la déconnexion"
                description="Vous allez être déconnecté de votre compte MedLink. Vous pourrez vous reconnecter à tout moment."
                confirmLabel="Se déconnecter"
                onConfirm={logout}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}

export function PatientBottomNav() {
  const path = usePathname();
  const doctor = path.startsWith("/medecin");
  const links = doctor ? [DOCTOR_LINKS[0], DOCTOR_LINKS[1], DOCTOR_LINKS[3], DOCTOR_LINKS[4]] : LINKS;
  const isActive = useActive();
  return (
    <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className={`mx-auto grid max-w-lg items-end px-2 ${doctor ? "grid-cols-4" : "grid-cols-5"}`}>
        {links.map((l) => {
          const on = isActive(l);
          const center = !doctor && l.short === "Publier";
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
