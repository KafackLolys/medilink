"use client";

import { StatusBadge, type Status } from "@/components/custum/status-badge";
import { usePatientNeed } from "@/hooks/use-patient-need";
import type { NeedStatus } from "@/services/need-service";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  MapPin,
  Paperclip,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<NeedStatus, Status> = {
  draft: "Brouillon",
  published: "Publiée",
  awaiting_proposals: "En attente de propositions",
  proposals_received: "Propositions reçues",
  appointment_confirmed: "Rendez-vous confirmé",
  closed: "Clôturée",
  cancelled: "Annulée",
};
const EDITABLE_STATUSES: NeedStatus[] = [
  "draft",
  "published",
  "awaiting_proposals",
  "proposals_received",
];

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function PatientRequestDetail({ id }: { id: string }) {
  const { need, loading, error } = usePatientNeed(id);

  if (loading) {
    return <p role="status" className="rounded-3xl bg-white p-8 text-center text-muted">Chargement de la demande…</p>;
  }
  if (error || !need) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Link href="/patient/demandes" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden />Mes demandes
        </Link>
        <p role="alert" className="rounded-2xl bg-danger/10 p-4 text-danger">
          {error ?? "Cette demande est introuvable."}
        </p>
      </div>
    );
  }

  const editable = EDITABLE_STATUSES.includes(need.status);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/patient/demandes" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" aria-hidden />Mes demandes
      </Link>
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Détail de la demande</h1>
        <p className="mt-2 text-lg text-muted">Suivez son statut et les médecins intéressés.</p>
      </header>

      <article className="space-y-6 rounded-3xl bg-white p-6 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
              <Stethoscope className="size-4" aria-hidden />{need.specialty}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-ink">{need.title}</h2>
          </div>
          <StatusBadge status={STATUS_LABEL[need.status]} />
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface p-4">
            <dt className="flex items-center gap-2 text-sm font-semibold text-muted"><CalendarDays className="size-4 text-primary" aria-hidden />Publication</dt>
            <dd className="mt-2 font-bold text-ink">{formatDate(need.createdAt)}</dd>
          </div>
          <div className="rounded-2xl bg-surface p-4">
            <dt className="flex items-center gap-2 text-sm font-semibold text-muted"><MapPin className="size-4 text-primary" aria-hidden />Consultation</dt>
            <dd className="mt-2 font-bold text-ink">{need.mode === "domicile" ? "À domicile" : "Téléconsultation"}</dd>
            <dd className="mt-1 text-sm text-muted">{need.district}, {need.city}</dd>
          </div>
        </dl>

        <section>
          <h3 className="font-bold text-ink">Description</h3>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-muted">{need.description}</p>
        </section>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface p-4">
            <dt className="text-sm font-semibold text-muted">Symptômes</dt>
            <dd className="mt-2 text-ink">{need.symptoms.length ? need.symptoms.join(", ") : "Non précisés"}</dd>
          </div>
          <div className="rounded-2xl bg-surface p-4">
            <dt className="text-sm font-semibold text-muted">Durée et priorité</dt>
            <dd className="mt-2 text-ink">{need.durationDescription || "Durée non précisée"} · {need.priority === "rapide" ? "Prise en charge rapide" : "Consultation normale"}</dd>
          </div>
          {need.privateAddress && (
            <div className="rounded-2xl bg-surface p-4 sm:col-span-2">
              <dt className="text-sm font-semibold text-muted">Adresse communiquée</dt>
              <dd className="mt-2 text-ink">{need.privateAddress}</dd>
            </div>
          )}
        </dl>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary/10 text-secondary"><FileText className="size-5" aria-hidden /></span>
          <div>
            <p className="font-bold text-ink">{need.interested} {need.interested === 1 ? "médecin intéressé" : "médecins intéressés"}</p>
            <p className="mt-0.5 text-sm text-muted">{need.interested ? "Les propositions reçues sont liées à votre demande." : "Vous serez informé lorsqu’un médecin répondra."}</p>
          </div>
        </div>

        {need.attachments.length > 0 && (
          <section>
            <h3 className="font-bold text-ink">Documents joints</h3>
            <ul className="mt-3 space-y-2">
              {need.attachments.map((attachment) => (
                <li key={attachment.id}>
                  <a
                    href={attachment.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 font-medium text-primary hover:bg-surface"
                  >
                    <Paperclip className="size-4 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1 truncate">{attachment.fileName}</span>
                    <span className="shrink-0 text-xs text-muted">{Math.ceil(attachment.sizeBytes / 1024)} Ko</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">Les liens de téléchargement expirent après 15 minutes.</p>
          </section>
        )}
      </article>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/patient/medecins" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-white">Trouver un médecin</Link>
        {editable && <Link href={`/patient/demandes/${need.id}/modifier`} className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 font-semibold text-ink shadow-sm">Modifier la demande</Link>}
        <Link href="/patient/demandes" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 font-semibold text-ink shadow-sm">Retour à mes demandes</Link>
      </div>
    </div>
  );
}
