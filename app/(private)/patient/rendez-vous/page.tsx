"use client";

import { StatusBadge } from "@/components/custum/status-badge";
import { Tabs } from "@/components/custum/tabs";
import { usePatientAppointments } from "@/hooks/use-patient-appointments";
import type { AppointmentStatus, PatientAppointment } from "@/services/appointment-service";
import type { Status } from "@/components/custum/status-badge";
import { CalendarDays, Clock, House, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Tab = "all" | AppointmentStatus;
const labels: Record<AppointmentStatus, Status> = {
  pending_confirmation: "En attente de confirmation",
  confirmed: "Confirmé",
  completed: "Terminé",
  cancelled: "Annulé",
  rejected: "Refusé",
  no_show: "Absent",
};
const empty: Record<Tab, string> = {
  all: "Aucun rendez-vous pour le moment.",
  pending_confirmation: "Aucun rendez-vous en attente.",
  confirmed: "Aucun rendez-vous confirmé pour le moment.",
  completed: "Aucune consultation terminée.",
  cancelled: "Aucun rendez-vous annulé.",
  rejected: "Aucun rendez-vous refusé.",
  no_show: "Aucun rendez-vous marqué absent.",
};
const card = "rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]";

function formatAppointment(date: string) {
  const parsed = new Date(date);
  return {
    day: parsed.toLocaleDateString("fr-FR", { day: "2-digit" }),
    month: parsed.toLocaleDateString("fr-FR", { month: "short" }),
    date: parsed.toLocaleDateString("fr-FR", { dateStyle: "full" }),
    time: parsed.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
}

function AppointmentItem({ appointment }: { appointment: PatientAppointment }) {
  const date = formatAppointment(appointment.scheduledAt);
  return (
    <li className={`${card} p-5 sm:p-6`}>
      <div className="flex gap-4 sm:gap-5">
        <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/[.08] text-primary sm:size-20">
          <span className="text-center leading-none">
            <span className="block text-2xl font-extrabold sm:text-3xl">{date.day}</span>
            <span className="mt-1 block text-sm font-semibold">{date.month}</span>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">{appointment.doctor.name}</h2>
              <p className="text-[15px] text-muted">{appointment.doctor.specialty}</p>
            </div>
            <StatusBadge status={labels[appointment.status]} />
          </div>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-muted">
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden />{date.date}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="size-4" aria-hidden />{date.time}</span>
            <span className="inline-flex items-center gap-1.5">
              {appointment.consultationMode === "home" ? <House className="size-4" aria-hidden /> : <Video className="size-4" aria-hidden />}
              {appointment.consultationMode === "home" ? "À votre domicile" : "Téléconsultation"}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-5 border-t border-slate-100 pt-4">
        <Link href={`/patient/rendez-vous/${appointment.id}`} className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-white">Voir le détail</Link>
      </div>
    </li>
  );
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const { appointments, loading, error } = usePatientAppointments();
  const statuses: AppointmentStatus[] = [
    "pending_confirmation",
    "confirmed",
    "completed",
    "cancelled",
    "rejected",
    "no_show",
  ];
  const count = (status: Tab) =>
    appointments.filter((appointment) => status === "all" || appointment.status === status).length;
  const list = appointments.filter((appointment) => tab === "all" || appointment.status === tab);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Rendez-vous</h1>
        <p className="mt-2 text-lg text-muted">Consultez les demandes et rendez-vous enregistrés dans votre compte.</p>
      </header>

      <Tabs
        label="Filtrer mes rendez-vous"
        value={tab}
        onChange={setTab}
        items={[
          { id: "all", label: "Tous", count: count("all") },
          ...statuses.map((status) => ({
            id: status,
            label: labels[status].replace(" de confirmation", ""),
            count: count(status),
          })),
        ]}
      />

      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      {loading ? (
        <div role="status" className={`${card} p-12 text-center text-muted`}>Chargement de vos rendez-vous…</div>
      ) : list.length === 0 ? (
        <div className={`${card} grid place-items-center gap-3 p-12 text-center`}>
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/[.08] text-primary"><CalendarDays className="size-7" aria-hidden /></span>
          <p className="text-lg font-semibold text-ink">{empty[tab]}</p>
          <Link href="/patient/medecins" className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-white">Trouver un médecin</Link>
        </div>
      ) : (
        <ul className="space-y-4">{list.map((appointment) => <AppointmentItem key={appointment.id} appointment={appointment} />)}</ul>
      )}
    </div>
  );
}
