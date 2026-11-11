import { StatusBadge } from "@/components/custum/status-badge";
import { APPOINTMENTS } from "@/lib/mock-data";
import { ArrowLeft, CalendarDays, Clock, House, MessageCircle, Video } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return APPOINTMENTS.map(({ id }) => ({ id }));
}

export default async function AppointmentDetailPage({ params }: PageProps<"/patient/rendez-vous/[id]">) {
  const { id } = await params;
  const appointment = APPOINTMENTS.find((item) => item.id === id);
  if (!appointment) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/patient/rendez-vous" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> Mes rendez-vous
      </Link>
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Détail du rendez-vous</h1>
        <p className="mt-2 text-lg text-muted">Retrouvez les informations utiles à votre consultation.</p>
      </header>

      <article className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-xl font-extrabold text-primary">{appointment.doctor.initials}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-xl font-bold text-ink">{appointment.doctor.name}</h2><p className="mt-1 text-muted">{appointment.doctor.specialty}</p></div>
              <StatusBadge status={appointment.status} />
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface p-4"><dt className="flex items-center gap-2 text-sm font-semibold text-muted"><CalendarDays className="size-4 text-primary" aria-hidden />Date</dt><dd className="mt-2 font-bold text-ink">{appointment.dateLabel}</dd></div>
              <div className="rounded-2xl bg-surface p-4"><dt className="flex items-center gap-2 text-sm font-semibold text-muted"><Clock className="size-4 text-primary" aria-hidden />Heure</dt><dd className="mt-2 font-bold text-ink">{appointment.time}</dd></div>
              <div className="rounded-2xl bg-surface p-4 sm:col-span-2"><dt className="text-sm font-semibold text-muted">Type de consultation</dt><dd className="mt-2 flex items-center gap-2 font-bold text-ink">{appointment.mode === "domicile" ? <House className="size-4 text-primary" aria-hidden /> : <Video className="size-4 text-primary" aria-hidden />}{appointment.mode === "domicile" ? "Consultation à domicile" : "Téléconsultation"}</dd></div>
            </dl>
          </div>
        </div>
      </article>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/patient/messages" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-white"><MessageCircle className="size-4" aria-hidden />Contacter le médecin</Link>
        <Link href="/patient/rendez-vous" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 font-semibold text-ink shadow-sm">Retour à mes rendez-vous</Link>
      </div>
    </div>
  );
}
