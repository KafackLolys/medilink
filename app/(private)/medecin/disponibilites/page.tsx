"use client";

import { doctorCard, DoctorPageHeading, SectionTitle } from "../../components/doctor-ui";
import { DOCTOR_BLOCKED_DATES, DOCTOR_BOOKED_APPOINTMENTS, DOCTOR_SCHEDULE } from "@/lib/doctor-portal-data";
import { CalendarDays, Check, Clock3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type ScheduleDay = { id: string; day: string; enabled: boolean; start: string; end: string };
type BlockedDate = { id: string; date: string; label: string; reason: string };

export default function DoctorAvailabilityPage() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>(DOCTOR_SCHEDULE.map((day) => ({ ...day })));
  const [duration, setDuration] = useState("30");
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(DOCTOR_BLOCKED_DATES.map((date) => ({ ...date })));
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [saved, setSaved] = useState(false);

  function updateDay(id: string, patch: Partial<ScheduleDay>) {
    setSchedule((days) => days.map((day) => day.id === id ? { ...day, ...patch } : day));
    setSaved(false);
  }

  function addBlockedDate() {
    if (!blockDate) return;
    const date = new Date(`${blockDate}T12:00:00`);
    const label = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(date);
    setBlockedDates((dates) => [...dates, { id: `${blockDate}-${Date.now()}`, date: blockDate, label, reason: blockReason.trim() || "Indisponibilité" }]);
    setBlockDate("");
    setBlockReason("");
    setSaved(false);
  }

  return (
    <div className="space-y-5">
      <DoctorPageHeading title="Mes disponibilités" description="Configurez vos horaires, la durée de vos consultations et vos indisponibilités." />
      {saved && <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><Check className="size-4" aria-hidden />Vos disponibilités ont été enregistrées.</p>}
      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle><><Clock3 className="mr-2 inline size-5 text-primary" aria-hidden />Horaires hebdomadaires</></SectionTitle>
        <div className="mt-4 divide-y divide-slate-100">
          {schedule.map((day) => (
            <div key={day.id} className="grid gap-3 py-3 sm:grid-cols-[minmax(130px,1fr)_1fr_1fr_1fr] sm:items-center">
              <label className="flex items-center gap-3 text-sm font-semibold text-ink">
                <input type="checkbox" checked={day.enabled} onChange={(event) => updateDay(day.id, { enabled: event.target.checked })} className="size-4 accent-primary" />
                {day.day}
              </label>
              <label className="flex items-center gap-2 text-xs text-muted">Début<input aria-label={`${day.day}, heure de début`} type="time" disabled={!day.enabled} value={day.start} onChange={(event) => updateDay(day.id, { start: event.target.value })} className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-2 text-sm text-ink disabled:bg-slate-50" /></label>
              <label className="flex items-center gap-2 text-xs text-muted">Fin<input aria-label={`${day.day}, heure de fin`} type="time" disabled={!day.enabled} value={day.end} onChange={(event) => updateDay(day.id, { end: event.target.value })} className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-2 text-sm text-ink disabled:bg-slate-50" /></label>
              <span className={`text-xs font-semibold sm:text-right ${day.enabled ? "text-emerald-700" : "text-muted"}`}>{day.enabled ? "Disponible" : "Indisponible"}</span>
            </div>
          ))}
        </div>
        <label className="mt-4 block max-w-sm text-sm font-semibold text-ink">Durée d’une consultation
          <select value={duration} onChange={(event) => { setDuration(event.target.value); setSaved(false); }} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3">
            {[15, 20, 30, 45, 60].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}
          </select>
        </label>
      </section>

      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle><><CalendarDays className="mr-2 inline size-5 text-primary" aria-hidden />Dates bloquées</></SectionTitle>
        <p className="mt-1 text-sm text-muted">Ajoutez une date pendant laquelle vous ne prenez pas de rendez-vous.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-xs font-semibold text-muted">Date<input type="date" value={blockDate} onChange={(event) => setBlockDate(event.target.value)} className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-ink" /></label>
          <label className="text-xs font-semibold text-muted">Motif (facultatif)<input value={blockReason} onChange={(event) => setBlockReason(event.target.value)} placeholder="Indisponibilité personnelle" className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-ink" /></label>
          <button type="button" onClick={addBlockedDate} disabled={!blockDate} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 text-sm font-bold text-primary disabled:opacity-50"><Plus className="size-4" aria-hidden />Bloquer</button>
        </div>
        {blockedDates.length > 0 && <ul className="mt-4 space-y-2">{blockedDates.map((date) => <li key={date.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5"><CalendarDays className="size-4 shrink-0 text-primary" aria-hidden /><span className="flex-1 text-sm"><strong className="capitalize text-ink">{date.label}</strong><span className="ml-2 text-muted">{date.reason}</span></span><button type="button" aria-label={`Supprimer ${date.label}`} onClick={() => { setBlockedDates((dates) => dates.filter((item) => item.id !== date.id)); setSaved(false); }} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-700"><Trash2 className="size-4" aria-hidden /></button></li>)}</ul>}
      </section>

      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle>Prochains rendez-vous confirmés</SectionTitle>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {DOCTOR_BOOKED_APPOINTMENTS.filter((appointment) => appointment.status !== "Terminé").slice(0, 4).map((appointment) => (
            <li key={appointment.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-xs font-extrabold text-primary">{appointment.time}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-ink">{appointment.patient}</span><span className="block text-xs text-muted">{appointment.date} · {appointment.district}</span></span>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">{appointment.status}</span>
            </li>
          ))}
        </ul>
      </section>
      <div className="flex justify-end"><button type="button" onClick={() => setSaved(true)} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-white hover:bg-blue-700 sm:w-auto"><Check className="size-4" aria-hidden />Enregistrer les disponibilités</button></div>
    </div>
  );
}
