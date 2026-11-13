"use client";

import { doctorCard, DoctorPageHeading, SectionTitle } from "../../components/doctor-ui";
import { CalendarDays, Check, Clock3, House, Plus, Trash2, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useDoctorAvailability } from "@/hooks/use-doctor-availability";
import type { ConsultationMode, Weekday } from "@/services/availability-service";

type ScheduleDay = { id: string; day: string; enabled: boolean; start: string; end: string };

const DAYS: { id: string; day: string; weekday: Weekday }[] = [
  { id: "monday", day: "Lundi", weekday: "monday" },
  { id: "tuesday", day: "Mardi", weekday: "tuesday" },
  { id: "wednesday", day: "Mercredi", weekday: "wednesday" },
  { id: "thursday", day: "Jeudi", weekday: "thursday" },
  { id: "friday", day: "Vendredi", weekday: "friday" },
  { id: "saturday", day: "Samedi", weekday: "saturday" },
  { id: "sunday", day: "Dimanche", weekday: "sunday" },
];

export default function DoctorAvailabilityPage() {
  const {
    weekly,
    modes,
    durationMinutes,
    blockedDates,
    appointments,
    loading,
    error,
    saveWeekly,
    saveDuration,
    saveModes,
    addBlockedDate,
    removeBlockedDate,
  } = useDoctorAvailability();

  const [duration, setDuration] = useState(30);
  const [selectedModes, setSelectedModes] = useState<ConsultationMode[]>([]);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [saved, setSaved] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  useEffect(() => {
    if (loading || error) return;
    void Promise.resolve().then(() => setSchedule(DAYS.map(({ day, weekday }) => {
      const found = weekly.find((item) => item.weekday === weekday);
      return { id: weekday, day, enabled: found?.isAvailable ?? false,
        start: found?.startTime ?? "09:00", end: found?.endTime ?? "17:00" };
    })));
    void Promise.resolve().then(() => setDuration(durationMinutes));
    void Promise.resolve().then(() => setSelectedModes(modes));
  }, [loading, error, weekly, durationMinutes, modes]);

  if (loading) {
    return (
      <div className="space-y-5">
        <DoctorPageHeading
          title="Mes disponibilités"
          description="Chargement des disponibilités…"
        />
        <p className="text-sm text-muted">Chargement en cours…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <DoctorPageHeading
          title="Mes disponibilités"
          description="Une erreur est survenue lors du chargement."
        />
        <p className="text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  function updateDay(id: string, patch: Partial<ScheduleDay>) {
    setSchedule((days) =>
      days.map((day) => (day.id === id ? { ...day, ...patch } : day)),
    );
    setSaved(false);
  }

  async function handleAddBlockedDate() {
    if (!blockDate) return;
    try {
      await addBlockedDate({ date: blockDate, reason: blockReason });
      setBlockDate("");
      setBlockReason("");
      setSaved(false);
    } catch {
      setActionError("Impossible de bloquer cette date. Vérifiez votre connexion.");
    }
  }

  async function handleRemoveBlockedDate(id: string) {
    try {
      await removeBlockedDate(id);
      // Le hook maintient la liste canonique.
      setSaved(false);
    } catch {
      setActionError("Impossible de retirer cette date bloquée.");
    }
  }

  async function handleSave() {
    const payload = schedule.map((day) => ({
      weekday: (DAYS.find((d) => d.day === day.day)?.weekday ||
        day.day) as Weekday,
      isAvailable: day.enabled,
      startTime: day.start,
      endTime: day.end,
    }));
    setSaving(true);
    setActionError(null);
    try {
      await saveWeekly(payload);
      await saveDuration(duration);
      if (selectedModes.length === 0) {
        throw new Error("Sélectionnez au moins un mode de consultation.");
      }
      await saveModes(selectedModes);
      setSaved(true);
    } catch (cause) {
      setSaved(false);
      setActionError(cause instanceof Error ? cause.message : "Enregistrement incomplet. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <DoctorPageHeading
        title="Mes disponibilités"
        description="Configurez vos modes de consultation, vos horaires et vos indisponibilités."
      />
      {saved && (
        <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
          <Check className="size-4" aria-hidden />
          Vos disponibilités ont été enregistrées.
        </p>
      )}
      {actionError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{actionError}</p>}
      {error && (
        <p className="text-sm text-rose-600">
          Impossible d&apos;enregistrer les disponibilités. Veuillez réessayer.
        </p>
      )}
      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle>Modes de consultation</SectionTitle>
        <p className="mt-1 text-sm text-muted">Choisissez un mode ou les deux. Le choix détermine les types de rendez-vous acceptés.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3" role="group" aria-label="Modes de consultation acceptés">
          {([
            { value: "home", label: "À domicile", Icon: House, modes: ["home"] },
            { value: "teleconsultation", label: "Téléconsultation", Icon: Video, modes: ["teleconsultation"] },
            { value: "both", label: "Les deux", Icon: Check, modes: ["home", "teleconsultation"] },
          ] as const).map(({ value, label, Icon, modes: values }) => {
            const active = value === "both"
              ? selectedModes.length === 2
              : selectedModes.length === 1 && selectedModes[0] === value;
            return <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => { setSelectedModes([...values] as ConsultationMode[]); setSaved(false); }}
              className={`flex min-h-16 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${active
                ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/15"
                : "border-slate-200 bg-white text-ink hover:border-primary/40 hover:bg-slate-50"}`}
            ><Icon className="size-5" aria-hidden />{label}</button>;
          })}
        </div>
        <p className="mt-3 text-xs text-muted" aria-live="polite">
          {selectedModes.length === 2 ? "Consultations à domicile et téléconsultations acceptées."
            : selectedModes[0] === "home" ? "Consultations à domicile acceptées."
            : selectedModes[0] === "teleconsultation" ? "Téléconsultations acceptées."
            : "Aucun mode configuré : choisissez une option avant d’enregistrer."}
        </p>
      </section>

      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle>
          <>
            <Clock3 className="mr-2 inline size-5 text-primary" aria-hidden />
            Horaires hebdomadaires
          </>
        </SectionTitle>
        <div className="mt-4 divide-y divide-slate-100">
          {schedule.map((day) => (
            <div
              key={day.id}
              className="grid gap-3 py-3 sm:grid-cols-[minmax(130px,1fr)_1fr_1fr_1fr] sm:items-center"
            >
              <label className="flex items-center gap-3 text-sm font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={(event) => updateDay(day.id, { enabled: event.target.checked })}
                  className="size-4 accent-primary"
                />
                {day.day}
              </label>
              <label className="flex items-center gap-2 text-xs text-muted">
                Début
                <input
                  aria-label={`${day.day}, heure de début`}
                  type="time"
                  disabled={!day.enabled}
                  value={day.start}
                  onChange={(event) => updateDay(day.id, { start: event.target.value })}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-2 text-sm text-ink disabled:bg-slate-50"
                />
              </label>
              <label className="flex items-center gap-2 text-xs text-muted">
                Fin
                <input
                  aria-label={`${day.day}, heure de fin`}
                  type="time"
                  disabled={!day.enabled}
                  value={day.end}
                  onChange={(event) => updateDay(day.id, { end: event.target.value })}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-2 text-sm text-ink disabled:bg-slate-50"
                />
              </label>
              <span
                className={`text-xs font-semibold sm:text-right ${day.enabled ? "text-emerald-700" : "text-muted"}`}
              >
                {day.enabled ? "Disponible" : "Indisponible"}
              </span>
            </div>
          ))}
        </div>
        <label className="mt-4 block max-w-sm text-sm font-semibold text-ink">
          Durée d&apos;une consultation
          <select
            value={String(duration)}
            onChange={(event) => {
              setDuration(Number(event.target.value));
              setSaved(false);
            }}
            className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3"
          >
            {[15, 20, 30, 45, 60].map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
          <span className="text-xs text-muted block mt-1">Cette durée sera utilisée pour les prochains rendez-vous.</span>
        </label>
      </section>

      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle>
          <>
            <CalendarDays className="mr-2 inline size-5 text-primary" aria-hidden />
            Dates bloquées
          </>
        </SectionTitle>
        <p className="mt-1 text-sm text-muted">
          Ajoutez une date pendant laquelle vous ne prenez pas de rendez-vous.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-xs font-semibold text-muted">
            Date
            <input
              type="date"
              value={blockDate}
              onChange={(event) => setBlockDate(event.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-ink"
            />
          </label>
          <label className="text-xs font-semibold text-muted">
            Motif (facultatif)
            <input
              value={blockReason}
              onChange={(event) => setBlockReason(event.target.value)}
              placeholder="Indisponibilité personnelle"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-ink"
            />
          </label>
          <button
            type="button"
            onClick={handleAddBlockedDate}
            disabled={!blockDate}
            className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 text-sm font-bold text-primary disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden />
            Bloquer
          </button>
        </div>
        {blockedDates.length > 0 && (
          <ul className="mt-4 space-y-2">
            {blockedDates.map((date) => (
              <li
                key={date.id}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
              >
                <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden />
                <span className="flex-1 text-sm">
                  <strong className="capitalize text-ink">{date.label}</strong>{" "}
                  <span className="ml-2 text-muted">{date.reason}</span>
                </span>
                <button
                  type="button"
                  aria-label={`Supprimer ${date.label}`}
                  onClick={() => handleRemoveBlockedDate(date.id)}
                  className="grid size-8 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-700"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle>Prochains rendez-vous confirmés</SectionTitle>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {appointments
            .filter((appointment) => appointment.status === "confirmed")
            .slice(0, 4)
            .map((appointment) => (
              <li
                key={appointment.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-xs font-extrabold text-primary">
                  {appointment.time}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-ink">
                    {appointment.patient}
                  </span>
                  <span className="block text-xs text-muted">
                    {appointment.date} · {appointment.district}
                  </span>
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                  {appointment.status}
                </span>
              </li>
            ))}
        </ul>
      </section>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || schedule.length !== 7 || selectedModes.length === 0}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-white hover:bg-blue-700 sm:w-auto"
        >
          <Check className="size-4" aria-hidden />
          {saving ? "Enregistrement…" : "Enregistrer les disponibilités"}
        </button>
      </div>
    </div>
  );
}
