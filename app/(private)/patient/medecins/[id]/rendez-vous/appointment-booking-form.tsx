"use client";

import { Button } from "@/components/custum/button";
import { useDoctor } from "@/hooks/use-doctor";
import { appointmentService } from "@/services/appointment-service";
import type { ConsultationMode } from "@/services/doctor-service";
import { ArrowLeft, CalendarDays, CheckCircle2, House, Video } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

const modeLabels: Record<ConsultationMode, string> = {
  home: "À domicile",
  teleconsultation: "Téléconsultation",
};

const weekdayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function AppointmentBookingForm({ doctorId }: { doctorId: string }) {
  const { doctor, loading, error: doctorError } = useDoctor(doctorId);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<ConsultationMode | "">("");
  const [reason, setReason] = useState("");
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date();
  const minimumDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");

  if (loading) {
    return <div role="status" className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center text-muted">Chargement du profil…</div>;
  }
  if (!doctor || doctorError) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-night">{doctorError ?? "Ce médecin est introuvable."}</h1>
        <Link href="/patient/medecins" className="mt-4 inline-flex text-primary hover:underline">Retour à la recherche</Link>
      </div>
    );
  }

  const selectedDate = date ? new Date(`${date}T12:00:00`) : null;
  const weekday = selectedDate
    ? weekdayNames[selectedDate.getDay()]
    : null;
  const blockedDates = new Set(doctor.blockedDates ?? []);
  const isBlockedDate = Boolean(date && blockedDates.has(date));
  const matchingSlots = doctor.availability.filter(
    (slot) => slot.isAvailable && slot.weekday === weekday && !isBlockedDate,
  );
  const durationMinutes = doctor.appointmentDurationMinutes ?? 30;
  const toMinutes = (value: string): number => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const isFutureDate = Boolean(date && date >= minimumDate);
  const isFutureTime = Boolean(date && time && new Date(`${date}T${time}`).getTime() > Date.now());
  const isSlotAvailable = Boolean(
    !isBlockedDate && isFutureDate && isFutureTime && time &&
    matchingSlots.some((slot) =>
      toMinutes(time) >= toMinutes(slot.startTime) &&
      toMinutes(time) + durationMinutes <= toMinutes(slot.endTime),
    ),
  );
  const initials = doctor.name
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!doctor || !mode || !isSlotAvailable) {
      setError("Choisissez une date et une heure correspondant aux disponibilités du médecin.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await appointmentService.create({
        doctorId: doctor.id,
        scheduledAt: new Date(`${date}T${time}`).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        consultationMode: mode,
        reason: reason.trim() || undefined,
      });
      setAppointmentId(result.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible d’envoyer la demande de rendez-vous.");
    } finally {
      setSubmitting(false);
    }
  }

  if (appointmentId) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-7 text-center shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-night">Demande envoyée</h1>
        <p className="mt-3 text-muted">
          Votre demande auprès de {doctor.name} est en attente de confirmation. Vous pourrez suivre son évolution depuis vos rendez-vous.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/patient/rendez-vous/${appointmentId}`} className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-white">Voir le rendez-vous</Link>
          <Link href="/patient/rendez-vous" className="inline-flex h-12 items-center justify-center rounded-full bg-surface px-6 font-semibold text-ink">Mes rendez-vous</Link>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href={`/patient/medecins/${doctor.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Profil du médecin
      </Link>
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Prendre rendez-vous</h1>
        <p className="mt-2 text-lg text-muted">Choisissez une plage horaire disponible avec {doctor.name}.</p>
      </header>
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      <form onSubmit={submit} className="space-y-5 rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-7">
        <div className="flex items-center gap-4 rounded-2xl bg-surface p-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">{initials}</span>
          <div>
            <p className="font-bold text-ink">{doctor.name}</p>
            <p className="text-sm text-muted">{doctor.specialty} · {doctor.professionalAddress ?? "Secteur non renseigné"}</p>
          </div>
        </div>

        {!doctor.availability.some((slot) => slot.isAvailable) || doctor.modes.length === 0 ? (
          <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
            Ce médecin n’a pas encore activé de plages horaires ou de mode de consultation. Vous pouvez consulter son profil, mais aucun rendez-vous ne peut être demandé tant que ces informations ne sont pas configurées.
          </p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-ink">Date souhaitée
                <span className="relative mt-1.5 block">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
                  <input type="date" required min={minimumDate} value={date} onChange={(event) => setDate(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
                </span>
              </label>
              <label className="block text-sm font-semibold text-ink">Heure souhaitée
                <input type="time" required value={time} onChange={(event) => setTime(event.target.value)} className="mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
              </label>
            </div>
            {date && (
              <p aria-live="polite" className={`text-sm ${matchingSlots.length > 0 ? "text-muted" : "text-amber-700"}`}>
                {isBlockedDate
                  ? "Le médecin a bloqué cette date : aucun rendez-vous possible."
                  : matchingSlots.length > 0
                    ? `Plages proposées : ${matchingSlots.map((slot) => `${slot.startTime}–${slot.endTime}`).join(", ")} (durée : ${durationMinutes} min)`
                    : "Ce jour est indisponible : choisissez un jour activé dans les horaires hebdomadaires."}
              </p>
            )}
            {time && date && !isSlotAvailable && matchingSlots.length > 0 && (
              <p role="status" className="text-sm text-amber-700">L’heure choisie doit être future et permettre une consultation entière dans la plage disponible.</p>
            )}
            <fieldset>
              <legend className="text-sm font-semibold text-ink">Type de consultation</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {doctor.modes.map((item) => {
                  const Icon = item === "home" ? House : Video;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMode(item)}
                      aria-pressed={mode === item}
                      className={`flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${mode === item ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/15" : "border-slate-200 text-ink hover:border-slate-300"}`}
                    >
                      <Icon className="size-4" aria-hidden />{modeLabels[item]}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <label className="block text-sm font-semibold text-ink">Motif de consultation <span className="font-normal text-muted">(facultatif)</span>
              <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} maxLength={500} placeholder="Décrivez brièvement le motif de votre rendez-vous…" className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
            </label>
            <p className="rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-ink">Le rendez-vous sera en attente jusqu’à la réponse du médecin. Pour une urgence médicale, contactez immédiatement les services d’urgence.</p>
            <Button type="submit" disabled={submitting || !isSlotAvailable || !mode}>
              {submitting ? "Envoi en cours…" : "Envoyer la demande"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
