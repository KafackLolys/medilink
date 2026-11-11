"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { DOCTOR_BOOKED_APPOINTMENTS } from "@/lib/doctor-portal-data";
import { CalendarDays, Clock3, House, Video } from "lucide-react";
import { useState } from "react";

export default function DoctorHistoryPage() {
  const [period, setPeriod] = useState("all");
  const history = DOCTOR_BOOKED_APPOINTMENTS.filter((appointment) => appointment.status === "Terminé");
  return (
    <div className="space-y-5">
      <DoctorPageHeading title="Historique des consultations" description="Retrouvez les consultations terminées et leurs informations essentielles." />
      <label className="block max-w-xs text-sm font-semibold text-ink">Période
        <select value={period} onChange={(event) => setPeriod(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3">
          <option value="all">Toutes les dates</option><option value="month">Ce mois-ci</option><option value="year">Cette année</option>
        </select>
      </label>
      <ul className="space-y-3">
        {history.map((appointment) => <li key={appointment.id} className={`${doctorCard} flex flex-wrap items-center gap-3 p-4 sm:p-5`}>
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-muted"><CalendarDays className="size-5" aria-hidden /></span>
          <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-bold text-night">{appointment.patient}</h2><p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted"><span>{appointment.date}</span><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" aria-hidden />{appointment.time}</span><span className="inline-flex items-center gap-1">{appointment.mode === "À domicile" ? <House className="size-3.5" aria-hidden /> : <Video className="size-3.5" aria-hidden />}{appointment.mode}</span></p></div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Terminée</span>
        </li>)}
      </ul>
      {history.length === 0 && <div className={`${doctorCard} p-10 text-center text-muted`}>Aucune consultation terminée pour le moment.</div>}
      <div className={`${doctorCard} grid grid-cols-2 gap-3 p-4 sm:grid-cols-3`}>
        <div><p className="text-2xl font-extrabold text-night">38</p><p className="text-xs text-muted">Consultations terminées</p></div>
        <div><p className="text-2xl font-extrabold text-night">4,9/5</p><p className="text-xs text-muted">Note moyenne</p></div>
        <div className="col-span-2 sm:col-span-1"><p className="text-2xl font-extrabold text-night">96 %</p><p className="text-xs text-muted">Rendez-vous honorés</p></div>
      </div>
    </div>
  );
}
