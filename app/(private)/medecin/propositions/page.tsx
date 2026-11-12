"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { useDoctorProposals } from "@/hooks/use-doctor-proposals";
import type { ProposalStatus } from "@/services/need-service";
import { ApiError } from "@/services/http";
import { ArrowRight, CalendarDays, Clock3, MapPin, Send, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const STATUSES: Array<{ value: ProposalStatus | ""; label: string }> = [
  { value: "", label: "Toutes" },
  { value: "sent", label: "Envoyée" },
  { value: "pending", label: "En attente" },
  { value: "accepted", label: "Acceptée" },
  { value: "rejected", label: "Refusée" },
  { value: "expired", label: "Expirée" },
  { value: "cancelled", label: "Annulée" },
];

const STATUS_TONE: Record<ProposalStatus, string> = {
  sent: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  expired: "bg-slate-100 text-slate-600",
  cancelled: "bg-slate-100 text-slate-600",
};

const STATUS_LABEL: Record<ProposalStatus, string> = {
  sent: "Envoyée",
  pending: "En attente",
  accepted: "Acceptée",
  rejected: "Refusée",
  expired: "Expirée",
  cancelled: "Annulée",
};

function formatDate(value: string | null, withTime = false): string {
  if (!value) return "Non précisée";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Non précisée";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" as const } : {}),
  }).format(date);
}

function messageFrom(error: unknown): string {
  if (error instanceof ApiError || error instanceof Error) return error.message;
  return "Une erreur est survenue. Veuillez réessayer.";
}

export default function DoctorProposalsPage() {
  const {
    items,
    counts,
    total,
    page,
    totalPages,
    loading,
    error,
    status: filter,
    filterByStatus,
    goToPage,
    cancel,
  } = useDoctorProposals();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function cancelProposal(id: string) {
    setCancellingId(id);
    setActionError(null);
    try {
      await cancel(id);
    } catch (cause) {
      setActionError(messageFrom(cause));
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <DoctorPageHeading
        title="Mes propositions"
        description="Retrouvez les besoins de patients auxquels vous avez répondu et suivez le statut de chaque proposition."
      />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Résumé des propositions">
        {STATUSES.slice(1).map(({ value, label }) => {
          if (!value) return null;
          return (
            <button
              key={value}
              type="button"
              onClick={() => filterByStatus(value)}
              aria-pressed={filter === value}
              className={`${doctorCard} p-3 text-left transition hover:border-primary/40 ${filter === value ? "ring-2 ring-primary/40" : ""}`}
            >
              <p className="text-xl font-extrabold text-night">{counts[value]}</p>
              <p className="mt-1 text-xs text-muted">{label}</p>
            </button>
          );
        })}
      </section>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Filtrer les propositions">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value || "all"}
            type="button"
            onClick={() => filterByStatus(value)}
            aria-pressed={filter === value}
            className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold ${filter === value ? "bg-primary text-white" : "bg-white text-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {(error || actionError) && (
        <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {actionError ?? error}
        </p>
      )}

      {loading ? (
        <div className={`${doctorCard} p-10 text-center text-muted`} role="status">
          Chargement de vos propositions…
        </div>
      ) : items.length === 0 ? (
        <div className={`${doctorCard} p-10 text-center text-muted`}>
          Aucun besoin de patient correspondant à ce filtre.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((proposal) => (
            <li key={proposal.id} className={`${doctorCard} p-4 sm:p-5`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-night sm:text-lg">{proposal.needTitle}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {proposal.specialty} · Patient · proposition envoyée le {formatDate(proposal.proposedAt, true)}
                  </p>
                </div>
                <span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${STATUS_TONE[proposal.status]}`}>
                  {STATUS_LABEL[proposal.status]}
                </span>
              </div>

              <div className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3 text-sm text-muted sm:grid-cols-3">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden />
                  {formatDate(proposal.proposedAppointmentAt, true)}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
                  {proposal.city}{proposal.district ? ` · ${proposal.district}` : ""}
                  {" · "}
                  {proposal.consultationMode === "home" ? "À domicile" : "Téléconsultation"}
                </p>
                <p className="flex items-center gap-2">
                  <Clock3 className="size-4 shrink-0 text-primary" aria-hidden />
                  {proposal.fee.toLocaleString("fr-FR")} {proposal.currency}
                </p>
              </div>

              <p className="mt-3 whitespace-pre-line rounded-xl bg-blue-50 px-3 py-2 text-sm text-ink">
                {proposal.message}
              </p>
              {proposal.patientResponse && (
                <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-ink">
                  Réponse du patient : {proposal.patientResponse}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/medecin/besoins/${proposal.needId}`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white"
                >
                  Voir le besoin <ArrowRight className="size-4" aria-hidden />
                </Link>
                {proposal.status === "accepted" && (
                  <Link
                    href="/medecin/messages"
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-50 px-4 text-sm font-bold text-primary"
                  >
                    Contacter le patient
                  </Link>
                )}
                {["pending", "sent"].includes(proposal.status) && (
                  <button
                    type="button"
                    onClick={() => void cancelProposal(proposal.id)}
                    disabled={cancellingId === proposal.id}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-muted hover:text-rose-700 disabled:opacity-60"
                  >
                    <X className="size-4" aria-hidden />
                    {cancellingId === proposal.id ? "Annulation…" : "Annuler"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <nav className="flex items-center justify-between" aria-label="Pagination des propositions">
        <p className="text-sm text-muted">
          {total} proposition{total === 1 ? "" : "s"} · Page {page}{totalPages ? ` sur ${totalPages}` : ""}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || loading}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages || loading}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </nav>

      <p className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-muted">
        <Send className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        Les informations d’identité du patient restent protégées. Les réponses et le statut de chaque proposition sont chargés depuis votre compte.
      </p>
    </div>
  );
}
