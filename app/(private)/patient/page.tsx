import { ArrowRight, Bell, CalendarDays, Clock, FileText, House, MessageCircle, Stethoscope, Video } from "lucide-react";
import Link from "next/link";
import { ACTIVE, APPOINTMENTS, NOTIFICATIONS, REQUESTS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/custum/status-badge";

const card = "rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]";

export default function PatientDashboard() {
  const upcoming = APPOINTMENTS.filter((a) => a.status === "En attente de confirmation" || a.status === "Confirmé");
  const next = upcoming[0];
  const active = REQUESTS.filter((r) => ACTIVE.includes(r.status));
  const proposals = active.reduce((n, r) => n + r.interested, 0);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Bonjour, bienvenue 👋</h1>
        <p className="mt-2 text-lg text-muted">Retrouvez vos démarches et vos rendez-vous au même endroit.</p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <Link href="/patient/medecins" className="group rounded-3xl bg-primary/[.08] p-6 transition hover:bg-primary/[.12]">
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-primary shadow-sm"><Stethoscope className="size-6" aria-hidden /></span>
            <h2 className="mt-4 text-xl font-bold text-primary">Trouver un médecin</h2>
            <p className="mt-1 text-[15px] text-muted">Rechercher par spécialité et localisation</p>
            <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-ink">Ouvrir <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden /></span>
          </Link>
          <Link href="/patient/besoins/nouveau" className="group rounded-3xl bg-secondary/[.09] p-6 transition hover:bg-secondary/[.14]">
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-secondary shadow-sm"><FileText className="size-6" aria-hidden /></span>
            <h2 className="mt-4 text-xl font-bold text-secondary">Publier un besoin</h2>
            <p className="mt-1 text-[15px] text-muted">Décrire votre situation médicale</p>
            <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-ink">Ouvrir <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden /></span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="next-rdv">
        <h2 id="next-rdv" className="text-2xl font-extrabold tracking-tight text-night">Votre prochain rendez-vous</h2>
        {next ? (
          <div className={`${card} mt-5 flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6`}>
            <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-primary/[.08] text-primary">
              <span className="text-center leading-none"><span className="block text-3xl font-extrabold">{next.day}</span><span className="mt-1 block text-sm font-semibold">{next.month}</span></span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-ink">{next.doctor.name} <span className="font-medium text-muted">· {next.doctor.specialty}</span></h3>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-muted">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden />{next.dateLabel}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="size-4" aria-hidden />{next.time}</span>
                <span className="inline-flex items-center gap-1.5">{next.mode === "domicile" ? <House className="size-4" aria-hidden /> : <Video className="size-4" aria-hidden />}{next.mode === "domicile" ? "Consultation à domicile" : "Téléconsultation"}</span>
              </p>
              <div className="mt-3"><StatusBadge status={next.status} /></div>
            </div>
            <div className="flex gap-3 sm:flex-col">
              <Link href="/patient/rendez-vous" className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-primary px-6 sm:w-44 sm:flex-none font-semibold text-white">Voir le détail</Link>
              <Link href="/patient/messages" className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-surface px-6 sm:w-44 sm:flex-none font-semibold text-ink"><MessageCircle className="size-4" aria-hidden />Écrire</Link>
            </div>
          </div>
        ) : (
          <p className={`${card} mt-5 p-6 text-muted`}>Aucun rendez-vous à venir. Trouvez un médecin ou publiez un besoin pour en prendre un.</p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Résumé">
        {[
          { href: "/patient/demandes", t: "Mes demandes", n: active.length, d: active.length > 1 ? "demandes publiées" : "demande publiée", c: "text-primary" },
          { href: "/patient/demandes", t: "Propositions reçues", n: proposals, d: "médecins intéressés", c: "text-secondary" },
          { href: "/patient/rendez-vous", t: "Mes rendez-vous", n: upcoming.length, d: upcoming.length > 1 ? "rendez-vous à venir" : "rendez-vous à venir", c: "text-ink" },
        ].map((s) => (
          <Link key={s.t} href={s.href} className={`${card} p-6 transition hover:-translate-y-0.5`}>
            <p className="font-bold text-ink">{s.t}</p>
            <p className="mt-3 flex items-baseline gap-2"><span className={`text-4xl font-extrabold ${s.c}`}>{s.n}</span><span className="text-[15px] text-muted">{s.d}</span></p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-night">Demandes en cours</h2>
            <Link href="/patient/demandes" className="text-[15px] font-semibold text-primary hover:underline">Tout voir</Link>
          </div>
          <ul className="mt-5 space-y-3">
            {active.map((r) => (
              <li key={r.id} className={`${card} flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between`}>
                <div><p className="font-bold text-ink">{r.title}</p><p className="mt-0.5 text-sm text-muted">{r.specialty} · {r.publishedOn}</p></div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-night"><Bell className="size-5 text-primary" aria-hidden />Notifications</h2>
          <ul className={`${card} mt-5 divide-y divide-slate-100`}>
            {NOTIFICATIONS.map((n) => (
              <li key={n.id} className="p-5"><p className="text-[15px] text-ink">{n.text}</p><p className="mt-1 text-sm text-muted">{n.when}</p></li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
