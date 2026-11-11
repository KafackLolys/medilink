import {
  DOCTOR_APPOINTMENTS,
  DOCTOR_METRICS,
  DOCTOR_PROFILE,
  DOCTOR_QUICK_ACTIONS,
  DOCTOR_REQUESTS,
  DOCTOR_WEEK,
} from "@/lib/doctor-dashboard-data";
import {
  Activity,
  ArrowRight,
  Baby,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  Clock3,
  HeartPulse,
  House,
  MapPin,
  Send,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";

const card = "rounded-2xl border border-slate-200/70 bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:rounded-3xl";

const metricIcons = {
  users: Users,
  send: Send,
  calendar: CalendarDays,
  chart: ChartNoAxesColumnIncreasing,
} as const;

const requestIcons = {
  stethoscope: Stethoscope,
  activity: Activity,
  baby: Baby,
  heart: HeartPulse,
} as const;

const actionIcons = {
  users: Users,
  calendar: CalendarDays,
  user: UserRound,
} as const;

const priorityStyles = {
  Élevée: "bg-rose-100 text-rose-700",
  Moyenne: "bg-amber-100 text-amber-700",
  Faible: "bg-emerald-100 text-emerald-700",
} as const;

export default function DoctorDashboard() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 px-5 py-5 sm:px-7 sm:py-6">
        <Stethoscope className="absolute -right-2 -top-7 size-36 rotate-[-18deg] text-sky-900/10 sm:right-6 sm:size-44" aria-hidden />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-night sm:text-3xl">Bonjour Docteur 👋</h1>
            {DOCTOR_PROFILE.verified && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                <ShieldCheck className="size-4" aria-hidden /> Médecin vérifié
              </span>
            )}
          </div>
          <p className="mt-1.5 max-w-xl text-sm text-muted sm:text-base">
            Suivez les demandes des patients, vos propositions et vos prochains rendez-vous.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Résumé de l’activité">
        {DOCTOR_METRICS.map((metric) => {
          const Icon = metricIcons[metric.icon];
          const green = metric.tone === "green";
          return (
            <article key={metric.id} className={`${card} min-w-0 p-3.5 sm:p-4`}>
              <div className="flex items-start gap-2.5 sm:gap-4">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl sm:size-11 ${green ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-primary"}`}>
                  <Icon className="size-5 sm:size-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted sm:text-sm">{metric.label}</p>
                  <p className={`mt-0.5 text-2xl font-extrabold leading-tight sm:text-3xl ${green ? "text-emerald-600" : "text-primary"}`}>{metric.value}</p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted sm:text-xs">
                    <span className={`rounded-full px-1.5 py-0.5 font-bold ${green ? "bg-emerald-100 text-emerald-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {metric.id !== "appointments" && "↗ "}{metric.change}
                    </span>
                    {"period" in metric && metric.period}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className={`${card} min-w-0 p-3.5 sm:p-5 lg:col-span-8`} aria-labelledby="requests-title">
          <div className="flex items-center justify-between gap-2">
            <h2 id="requests-title" className="flex items-center gap-2 text-base font-extrabold text-night sm:text-xl">
              <Users className="size-5 text-primary" aria-hidden /> Demandes récentes des patients
            </h2>
            <Link href="/medecin/besoins" className="shrink-0 text-xs font-bold text-primary hover:underline sm:text-sm">
              Tout voir <ArrowRight className="inline size-3.5" aria-hidden />
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {DOCTOR_REQUESTS.map((request) => {
              const Icon = requestIcons[request.icon];
              return (
                <li key={request.id} className="grid gap-2 rounded-2xl border border-slate-100 p-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,.9fr)_auto] sm:items-center sm:gap-3">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${request.icon === "activity" || request.icon === "heart" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-primary"}`}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-night sm:text-[15px]">{request.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted sm:text-xs">
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-primary">{request.specialty}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="size-3" aria-hidden />{request.location}</span>
                        <span className="hidden text-slate-300 sm:inline">·</span>
                        <span>{request.published}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-start gap-2 pl-11 sm:block sm:pl-0">
                    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityStyles[request.priority]}`}>
                      <span className="size-1.5 rounded-full bg-current" aria-hidden /> Priorité {request.priority.toLowerCase()}
                    </span>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-muted">{request.summary}</p>
                  </div>
                  <Link href={`/medecin/besoins/${request.id}`} className="ml-11 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-white transition hover:bg-blue-700 sm:ml-0 sm:h-10 sm:px-3">
                    Consulter le besoin <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          <section className={`${card} p-4 sm:p-5`} aria-labelledby="today-title">
            <div className="flex items-center justify-between gap-2">
              <h2 id="today-title" className="flex items-center gap-2 text-lg font-extrabold text-night">
                <CalendarDays className="size-5 text-primary" aria-hidden /> Aujourd’hui
              </h2>
              <Link href="/medecin/rendez-vous" className="shrink-0 text-xs font-bold text-primary hover:underline">
                Voir l’agenda <ArrowRight className="inline size-3.5" aria-hidden />
              </Link>
            </div>
            <p className="mt-1 text-xs text-muted">Vos rendez-vous du jour ({DOCTOR_APPOINTMENTS.length})</p>
            <ul className="mt-3 space-y-2">
              {DOCTOR_APPOINTMENTS.map((appointment) => (
                <li key={appointment.id} className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-100 p-2">
                  <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-extrabold text-primary">{appointment.time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-night">{appointment.patient}</p>
                    <p className="flex items-center gap-1 truncate text-[10px] text-muted">
                      {appointment.mode === "Domicile" ? <House className="size-3 shrink-0" aria-hidden /> : <Video className="size-3 shrink-0" aria-hidden />}
                      {appointment.mode === "Domicile" ? `${appointment.mode} · ${appointment.location}` : appointment.mode}
                    </p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${appointment.status === "Confirmé" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {appointment.status === "Confirmé" ? <Check className="size-3" aria-hidden /> : <Clock3 className="size-3" aria-hidden />}
                    {appointment.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${card} p-4 sm:p-5`} aria-labelledby="quick-actions-title">
            <h2 id="quick-actions-title" className="flex items-center gap-2 text-lg font-extrabold text-night">
              <Zap className="size-5 text-primary" aria-hidden /> Actions rapides
            </h2>
            <ul className="mt-3 space-y-2">
              {DOCTOR_QUICK_ACTIONS.map((action) => {
                const Icon = actionIcons[action.icon];
                return (
                  <li key={action.id}>
                    <Link href={action.href} className="group flex min-h-10 items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-ink transition hover:border-blue-200 hover:bg-blue-50">
                      <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                      <span className="flex-1">{action.label}</span>
                      <ArrowRight className="size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className={`${card} grid gap-4 p-4 sm:grid-cols-[1fr_1.1fr] sm:items-center sm:p-5 lg:col-span-4`} aria-labelledby="zone-title">
          <div>
            <h2 id="zone-title" className="flex items-center gap-2 text-lg font-extrabold text-night">
              <MapPin className="size-5 text-primary" aria-hidden /> Zone d’intervention
            </h2>
            <p className="mt-3 font-bold text-ink">{DOCTOR_PROFILE.city}</p>
            <p className="mt-1 text-xs leading-5 text-muted">{DOCTOR_PROFILE.coveredAreas}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
              <Check className="size-3.5" aria-hidden /> Zone active
            </span>
          </div>
          <div className="relative grid h-36 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-100 sm:h-32" aria-label={`Carte de la zone de ${DOCTOR_PROFILE.city}`}>
            <div className="absolute inset-3 border-2 border-dashed border-emerald-400/80" style={{ clipPath: "polygon(18% 0, 76% 5%, 100% 38%, 82% 86%, 48% 100%, 8% 75%, 0 32%)" }} />
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(35deg, transparent 48%, #94a3b8 49%, #94a3b8 50%, transparent 51%), linear-gradient(125deg, transparent 48%, #94a3b8 49%, #94a3b8 50%, transparent 51%)", backgroundSize: "48px 42px" }} />
            <span className="relative grid size-9 place-items-center rounded-full bg-primary text-white shadow-lg"><MapPin className="size-5" aria-hidden /></span>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-night">{DOCTOR_PROFILE.city}</span>
          </div>
        </section>

        <section className={`${card} min-w-0 p-4 sm:p-5 lg:col-span-8`} aria-labelledby="week-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="week-title" className="flex items-center gap-2 text-lg font-extrabold text-night">
              <CalendarDays className="size-5 text-primary" aria-hidden /> Mon agenda <span className="text-sm font-medium text-muted">(cette semaine)</span>
            </h2>
            <Link href="/medecin/rendez-vous" className="text-xs font-bold text-primary hover:underline">Voir tous les rendez-vous <ArrowRight className="inline size-3.5" aria-hidden /></Link>
          </div>
          <p className="mt-1 text-xs text-muted">Lun. 20 – Dim. 26 janv.</p>
          <div className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2">
            {DOCTOR_WEEK.map((day) => (
              <div key={day.id} className={`min-w-0 rounded-xl border p-1.5 text-center sm:p-2 ${day.selected ? "border-primary bg-primary text-white shadow-md" : "border-slate-200 bg-white text-ink"}`}>
                <p className={`truncate text-[9px] sm:text-[11px] ${day.selected ? "text-blue-100" : "text-muted"}`}>{day.day}</p>
                <p className="my-1 text-sm font-extrabold sm:text-base">{day.date}</p>
                <span className={`inline-block rounded-full px-1 py-0.5 text-[8px] font-bold sm:text-[10px] ${day.selected ? "bg-white/20 text-white" : day.appointments > 0 ? "bg-sky-100 text-primary" : "bg-slate-100 text-muted"}`}>
                  {day.appointments} rdv
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <p className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-night sm:text-sm">
        <Clock3 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        En cas d’urgence médicale, le patient doit contacter immédiatement les services d’urgence (112) ou se rendre au service d’urgence le plus proche.
      </p>
    </div>
  );
}
