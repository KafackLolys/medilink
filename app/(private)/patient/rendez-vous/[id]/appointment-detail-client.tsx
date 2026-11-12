"use client";

import { StatusBadge } from "@/components/custum/status-badge";
import { usePatientAppointment } from "@/hooks/use-patient-appointment";
import { ArrowLeft, CalendarDays, Clock, House, MessageCircle, Video } from "lucide-react";
import Link from "next/link";
import type { AppointmentStatus } from "@/services/appointment-service";

const labels: Record<AppointmentStatus, Parameters<typeof StatusBadge>[0]["status"]> = {
  pending_confirmation: "En attente de confirmation",
  confirmed: "Confirmé",
  completed: "Terminé",
  cancelled: "Annulé",
  rejected: "Refusé",
  no_show: "Absent",
};

export default function AppointmentDetailClient({ id }: { id: string }) {
  const { appointment, loading, error } = usePatientAppointment(id);

  if (loading) {
    return <div role="status" className="rounded-3xl bg-white p-8 text-center text-muted">Chargement du rendez-vous…</div>;
  }
  if (!appointment || error) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-night">{error ?? "Ce rendez-vous est introuvable."}</h1>
        <Link href="/patient/rendez-vous" className="mt-4 inline-flex text-primary hover:underline">Retour à mes rendez-vous</Link>
      </div>
    );
  }

  const scheduledAt = new Date(appointment.scheduledAt);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/patient/rendez-vous" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Mes rendez-vous
      </Link>
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Détail du rendez-vous</h1>
        <p className="mt-2 text-lg text-muted">Retrouvez les informations de votre demande de consultation.</p>
      </header>

      <article className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-xl font-extrabold text-primary">
            {appointment.doctor.name.replace(/^Dr\.?\s*/i, "").split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-xl font-bold text-ink">{appointment.doctor.name}</h2><p className="mt-1 text-muted">{appointment.doctor.specialty}</p></div>
              <StatusBadge status={labels[appointment.status]} />
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface p-4">
                <dt className="flex items-center gap-2 text-sm font-semibold text-muted"><CalendarDays className="size-4 text-primary" aria-hidden />Date</dt>
                <dd className="mt-2 font-bold capitalize text-ink">{scheduledAt.toLocaleDateString("fr-FR", { dateStyle: "full" })}</dd>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <dt className="flex items-center gap-2 text-sm font-semibold text-muted"><Clock className="size-4 text-primary" aria-hidden />Heure et durée</dt>
                <dd className="mt-2 font-bold text-ink">{scheduledAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} · {appointment.durationMinutes} min</dd>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <dt className="text-sm font-semibold text-muted">Type de consultation</dt>
                <dd className="mt-2 flex items-center gap-2 font-bold text-ink">
                  {appointment.consultationMode === "home" ? <House className="size-4 text-primary" aria-hidden /> : <Video className="size-4 text-primary" aria-hidden />}
                  {appointment.consultationMode === "home" ? "Consultation à domicile" : "Téléconsultation"}
                </dd>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <dt className="text-sm font-semibold text-muted">Tarif proposé</dt>
                <dd className="mt-2 font-bold text-ink">{appointment.fee.toLocaleString("fr-FR")} {appointment.currency}</dd>
              </div>
              {appointment.reason && (
                <div className="rounded-2xl bg-surface p-4 sm:col-span-2">
                  <dt className="text-sm font-semibold text-muted">Motif communiqué</dt>
                  <dd className="mt-2 whitespace-pre-wrap text-ink">{appointment.reason}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </article>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/patient/profil?activeContent=messages&tab=messages" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-white"><MessageCircle className="size-4" aria-hidden />Contacter le médecin</Link>
        <Link href="/patient/rendez-vous" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 font-semibold text-ink shadow-sm">Retour à mes rendez-vous</Link>
      </div>
    </div>
  );
}
