"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { DOCTOR_BOOKED_APPOINTMENTS } from "@/lib/doctor-portal-data";
import { CalendarDays, Check, Clock3, House, Video, X } from "lucide-react";
import { useMemo, useState } from "react";

type AppointmentStatus = "Confirmé" | "En attente" | "À confirmer" | "Terminé" | "Refusé" | "Annulé";

const TONE: Record<AppointmentStatus, string> = {
  Confirmé: "bg-emerald-100 text-emerald-700",
  "En attente": "bg-amber-100 text-amber-700",
  "À confirmer": "bg-blue-100 text-blue-700",
  Terminé: "bg-slate-100 text-slate-600",
  Refusé: "bg-rose-100 text-rose-700",
  Annulé: "bg-slate-100 text-slate-600",
};

export default function DoctorAppointmentsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [statuses, setStatuses] = useState<Record<string, AppointmentStatus>>({});
  const appointments = useMemo(() => DOCTOR_BOOKED_APPOINTMENTS.map((appointment) => ({ ...appointment, status: statuses[appointment.id] ?? appointment.status as AppointmentStatus })), [statuses]);
  function setStatus(id: string, status: AppointmentStatus) {
    setStatuses((current) => ({ ...current, [id]: status }));
  }

  return (
    <div className="space-y-5">
      <DoctorPageHeading title="Rendez-vous" description="Consultez votre agenda, répondez aux demandes et suivez vos consultations." action={<a href="/medecin/disponibilites" className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-primary px-4 text-sm font-bold text-white">Gérer mes disponibilités</a>} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Résumé des rendez-vous">
        {[
          ["À confirmer", appointments.filter((item) => item.status === "À confirmer" || item.status === "En attente").length],
          ["Confirmés", appointments.filter((item) => item.status === "Confirmé").length],
          ["Terminés", appointments.filter((item) => item.status === "Terminé").length],
          ["Cette semaine", appointments.filter((item) => !["Terminé", "Annulé", "Refusé"].includes(item.status)).length],
        ].map(([label, count]) => <div key={label} className={`${doctorCard} p-3 sm:p-4`}><p className="text-2xl font-extrabold text-primary">{count}</p><p className="text-xs text-muted">{label}</p></div>)}
      </div>
      <div role="group" aria-label="Mode d’affichage des rendez-vous" className="inline-flex rounded-xl bg-white p-1 shadow-sm">
        {(["list", "calendar"] as const).map((item) => <button key={item} type="button" onClick={() => setView(item)} aria-pressed={view === item} className={`h-10 rounded-lg px-4 text-sm font-semibold ${view === item ? "bg-primary text-white" : "text-muted"}`}>{item === "list" ? "Liste" : "Calendrier"}</button>)}
      </div>
      {view === "calendar" && (
        <section className={`${doctorCard} p-4 sm:p-5`}>
          <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-night">Semaine du 9 au 15 novembre 2026</h2><CalendarDays className="size-5 text-primary" aria-hidden /></div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {appointments.filter((item) => !["Annulé", "Refusé"].includes(item.status)).map((item) => <article key={item.id} className="rounded-xl border border-slate-100 p-3"><p className="text-xs font-bold text-primary">{item.date} · {item.time}</p><p className="mt-1 truncate text-sm font-bold text-ink">{item.patient}</p><p className="text-xs text-muted">{item.district} · {item.mode}</p><span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${TONE[item.status]}`}>{item.status}</span></article>)}
          </div>
        </section>
      )}
      {view === "list" && (
        <ul className="space-y-3">
          {appointments.map((appointment) => {
            const pending = ["En attente", "À confirmer"].includes(appointment.status);
            return <li key={appointment.id} className={`${doctorCard} p-4 sm:p-5`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-primary"><CalendarDays className="size-6" aria-hidden /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-bold text-night">{appointment.patient}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${TONE[appointment.status]}`}>{appointment.status}</span></div>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted"><span className="inline-flex items-center gap-1"><CalendarDays className="size-4" aria-hidden />{appointment.date} · {appointment.time}</span><span className="inline-flex items-center gap-1">{appointment.mode === "À domicile" ? <House className="size-4" aria-hidden /> : <Video className="size-4" aria-hidden />}{appointment.mode}</span><span>{appointment.district}</span></p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pending && <><button type="button" onClick={() => setStatus(appointment.id, "Confirmé")} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white"><Check className="size-4" aria-hidden />Confirmer</button><button type="button" onClick={() => setStatus(appointment.id, "Refusé")} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-slate-100 px-3 text-sm font-semibold text-ink"><X className="size-4" aria-hidden />Refuser</button></>}
                  {appointment.status === "Confirmé" && <button type="button" onClick={() => setStatus(appointment.id, "Terminé")} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-blue-50 px-3 text-sm font-bold text-primary"><Check className="size-4" aria-hidden />Terminer la consultation</button>}
                </div>
              </div>
              {pending && <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><Clock3 className="size-3.5" aria-hidden />Les informations personnelles complètes seront disponibles après confirmation.</p>}
            </li>;
          })}
        </ul>
      )}
    </div>
  );
}
