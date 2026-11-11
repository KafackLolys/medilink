"use client";

import { Clock, FileText, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Status, StatusBadge } from "@/components/custum/status-badge";
import { Tabs } from "@/components/custum/tabs";
import { usePatientNeeds } from "@/hooks/use-patient-needs";
import type { NeedStatus, PatientNeed } from "@/services/need-service";

type Tab = "all" | "active" | "confirmed" | "draft" | "closed";
const ACTIVE: Status[] = [
  "Publiée",
  "En attente de propositions",
  "Propositions reçues",
];
const STATUS_LABEL: Record<NeedStatus, Status> = {
  draft: "Brouillon",
  published: "Publiée",
  awaiting_proposals: "En attente de propositions",
  proposals_received: "Propositions reçues",
  appointment_confirmed: "Rendez-vous confirmé",
  closed: "Clôturée",
  cancelled: "Annulée",
};
const FILTERS: Record<Tab, Status[] | null> = {
  all: null,
  active: ACTIVE,
  confirmed: ["Rendez-vous confirmé"],
  draft: ["Brouillon"],
  closed: ["Clôturée", "Annulée"],
};
const EMPTY: Record<Tab, string> = {
  all: "Vous n’avez pas encore publié de demande.",
  active: "Aucune demande en cours.",
  confirmed: "Aucun rendez-vous confirmé pour le moment.",
  draft: "Aucun brouillon enregistré.",
  closed: "Aucune demande clôturée.",
};
const card = "rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]";

function isActive(need: PatientNeed): boolean {
  return ACTIVE.includes(STATUS_LABEL[need.status]);
}

function publishedDate(date: string): string {
  return `Publiée le ${new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))}`;
}

export default function RequestsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [actionId, setActionId] = useState<string | null>(null);
  const { needs, loading, error, setError, close, remove } = usePatientNeeds();
  const count = (selectedTab: Tab) =>
    needs.filter(
      (need) =>
        !FILTERS[selectedTab] ||
        FILTERS[selectedTab]!.includes(STATUS_LABEL[need.status]),
    ).length;
  const list = needs.filter(
    (need) => !FILTERS[tab] || FILTERS[tab]!.includes(STATUS_LABEL[need.status]),
  );
  const proposals = needs
    .filter(isActive)
    .reduce((total, need) => total + need.interested, 0);

  async function closeNeed(id: string) {
    setActionId(id);
    setError(null);
    try {
      await close(id);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Impossible de clôturer la demande.",
      );
    } finally {
      setActionId(null);
    }
  }

  async function deleteNeed(id: string) {
    if (!window.confirm("Supprimer définitivement ce brouillon ?")) return;
    setActionId(id);
    setError(null);
    try {
      await remove(id);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Impossible de supprimer le brouillon.",
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Mes demandes</h1>
          <p className="mt-2 text-lg text-muted">Suivez vos besoins médicaux et les propositions des médecins.</p>
        </div>
        <Link href="/patient/besoins/nouveau" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,.6)]">
          <Plus className="size-5" aria-hidden /> Publier un besoin
        </Link>
      </div>

      {error && <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["En cours", count("active"), "text-primary"],
          ["Propositions reçues", proposals, "text-secondary"],
          ["Rendez-vous confirmés", count("confirmed"), "text-success"],
          ["Clôturées", count("closed"), "text-muted"],
        ].map(([label, total, color]) => (
          <div key={label as string} className={`${card} p-5`}>
            <p className={`text-3xl font-extrabold ${color}`}>{loading ? "…" : total}</p>
            <p className="mt-1 text-sm font-medium text-muted">{label}</p>
          </div>
        ))}
      </div>

      <Tabs
        label="Filtrer mes demandes"
        value={tab}
        onChange={setTab}
        items={[
          { id: "all", label: "Toutes", count: count("all") },
          { id: "active", label: "En cours", count: count("active") },
          { id: "confirmed", label: "Confirmées", count: count("confirmed") },
          { id: "draft", label: "Brouillons", count: count("draft") },
          { id: "closed", label: "Clôturées", count: count("closed") },
        ]}
      />

      {loading ? (
        <div className={`${card} p-12 text-center text-muted`} role="status">Chargement de vos demandes…</div>
      ) : list.length === 0 ? (
        <div className={`${card} grid place-items-center gap-3 p-12 text-center`}>
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/[.08] text-primary"><FileText className="size-7" aria-hidden /></span>
          <p className="text-lg font-semibold text-ink">{EMPTY[tab]}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((need) => {
            const status = STATUS_LABEL[need.status];
            return (
              <li key={need.id} className={`${card} p-5 sm:p-6`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-ink">{need.title}</h2>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                      <span className="rounded-full bg-primary/[.08] px-3 py-1 font-semibold text-primary">{need.specialty}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock className="size-4" aria-hidden />{publishedDate(need.createdAt)}</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" aria-hidden />{need.mode === "domicile" ? "À domicile" : "Téléconsultation"}</span>
                    </p>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[15px] text-muted"><strong className="text-ink">{need.interested}</strong> {need.interested > 1 ? "médecins intéressés" : "médecin intéressé"}</p>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/patient/demandes/${need.id}`} className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-white">Consulter</Link>
                    {status === "Brouillon" && <Link href={`/patient/demandes/${need.id}/modifier`} className="inline-flex h-11 items-center rounded-full bg-surface px-6 font-semibold text-ink">Modifier</Link>}
                    {isActive(need) && <button type="button" disabled={actionId === need.id} onClick={() => void closeNeed(need.id)} className="inline-flex h-11 items-center rounded-full px-4 font-semibold text-muted hover:text-danger disabled:opacity-50">Clôturer</button>}
                    {status === "Brouillon" && <button type="button" disabled={actionId === need.id} onClick={() => void deleteNeed(need.id)} className="inline-flex h-11 items-center rounded-full px-4 font-semibold text-muted hover:text-danger disabled:opacity-50">Supprimer</button>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
