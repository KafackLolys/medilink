"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { CalendarDays, Clock3, House, Video } from "lucide-react";
import { useState } from "react";
import { useDoctorHistory } from "@/hooks/use-doctor-history";

type AppointmentStatus =
  | "pending_confirmation"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected"
  | "no_show";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending_confirmation: "À confirmer",
  confirmed: "Confirmé",
  completed: "Terminée",
  cancelled: "Annulée",
  rejected: "Refusée",
  no_show: "Absent",
};

const TONE: Record<AppointmentStatus, string> = {
  pending_confirmation: "bg-blue-100 text-blue-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-slate-100 text-slate-600",
  rejected: "bg-rose-100 text-rose-700",
  no_show: "bg-slate-100 text-slate-600",
};

export default function DoctorHistoryPage() {
  const { appointments, loading, error, period, setPeriod, rating, reviewsCount, honoredRate } =
    useDoctorHistory();

  if (loading) {
    return (
      <div className="space-y-5">
        <DoctorPageHeading
          title="Historique des consultations"
          description="Chargement de l'historique…"
        />
        <p className="text-sm text-muted">Chargement en cours…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <DoctorPageHeading
          title="Historique des consultations"
          description="Une erreur est survenue lors du chargement."
        />
        <p className="text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  const completedCount = appointments.length;

  return (
    <div className="space-y-5">
      <DoctorPageHeading title="Historique des consultations" description="Retrouvez les consultations terminées et leurs informations essentielles." />
      <label className="block max-w-xs text-sm font-semibold text-ink">Période
        <select value={period} onChange={(event) => setPeriod(event.target.value as "all" | "month" | "year")} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3">
          <option value="all">Toutes les dates</option><option value="month">Ce mois-ci</option><option value="year">Cette année</option>
        </select>
      </label>
      <ul className="space-y-3">
        {appointments.map((appointment) => <li key={appointment.id} className={`${doctorCard} flex flex-wrap items-center gap-3 p-4 sm:p-5`}>
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-muted"><CalendarDays className="size-5" aria-hidden /></span>
          <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-bold text-night">{appointment.patient}</h2><p className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted"><span>{appointment.date}</span><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" aria-hidden />{appointment.time}</span><span className="inline-flex items-center gap-1">{appointment.mode === "À domicile" ? <House className="size-3.5" aria-hidden /> : <Video className="size-3.5" aria-hidden />}{appointment.mode}</span></p></div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{STATUS_LABEL[appointment.status]}</span>
        </li>)}
      </ul>
      {appointments.length === 0 && <div className={`${doctorCard} p-10 text-center text-muted`}>Aucune consultation terminée pour le moment.</div>}
      <div className={`${doctorCard} grid grid-cols-2 gap-3 p-4 sm:grid-cols-3`}>
        <div><p className="text-2xl font-extrabold text-night">{completedCount}</p><p className="text-xs text-muted">Consultations terminées</p></div>
        <div><p className="text-2xl font-extrabold text-night">{rating === null ? "—" : `${rating.toFixed(1).replace(".", ",")}/5`}</p><p className="text-xs text-muted">Note moyenne · {reviewsCount} avis</p></div>
        <div className="col-span-2 sm:col-span-1"><p className="text-2xl font-extrabold text-night">{honoredRate === null ? "—" : `${honoredRate} %`}</p><p className="text-xs text-muted">Rendez-vous honorés</p></div>
      </div>
    </div>
  );
}

