"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { DOCTOR_PROPOSALS, DoctorProposalStatus } from "@/lib/doctor-portal-data";
import { ArrowRight, CalendarDays, Clock3, MapPin, Send, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const STATUSES: (DoctorProposalStatus | "Toutes")[] = ["Toutes", "Envoyée", "En attente", "Acceptée", "Refusée", "Expirée", "Annulée"];
const STATUS_TONE: Record<DoctorProposalStatus, string> = {
  Envoyée: "bg-blue-100 text-blue-700",
  "En attente": "bg-amber-100 text-amber-700",
  Acceptée: "bg-emerald-100 text-emerald-700",
  Refusée: "bg-rose-100 text-rose-700",
  Expirée: "bg-slate-100 text-slate-600",
  Annulée: "bg-slate-100 text-slate-600",
};

export default function DoctorProposalsPage() {
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("Toutes");
  const [cancelled, setCancelled] = useState<string[]>([]);
  const proposals = useMemo(() => DOCTOR_PROPOSALS.filter((proposal) => {
    const status = cancelled.includes(proposal.id) ? "Annulée" : proposal.status;
    return filter === "Toutes" || status === filter;
  }), [filter, cancelled]);

  return (
    <div className="space-y-5">
      <DoctorPageHeading title="Mes propositions" description="Suivez les réponses des patients et gérez les services que vous avez proposés." />
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Résumé des propositions">
        {STATUSES.slice(1).map((status) => {
          const count = DOCTOR_PROPOSALS.filter((proposal) => proposal.status === status).length;
          return <button key={status} type="button" onClick={() => setFilter(status)} className={`${doctorCard} p-3 text-left transition hover:border-primary/40 ${filter === status ? "ring-2 ring-primary/40" : ""}`}>
            <p className="text-xl font-extrabold text-night">{status === "Annulée" ? cancelled.length : count}</p><p className="mt-1 text-xs text-muted">{status}</p>
          </button>;
        })}
      </section>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Filtrer les propositions">
        {STATUSES.map((status) => <button key={status} type="button" onClick={() => setFilter(status)} aria-pressed={filter === status} className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold ${filter === status ? "bg-primary text-white" : "bg-white text-muted"}`}>{status}</button>)}
      </div>
      {proposals.length === 0 ? <div className={`${doctorCard} p-10 text-center text-muted`}>Aucune proposition dans cette catégorie.</div> : (
        <ul className="space-y-3">
          {proposals.map((proposal) => {
            const status = cancelled.includes(proposal.id) ? "Annulée" : proposal.status;
            return <li key={proposal.id} className={`${doctorCard} p-4 sm:p-5`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-night sm:text-lg">{proposal.needTitle}</h2>
                  <p className="mt-1 text-sm text-muted">{proposal.patient} · envoyée {proposal.sentAt}</p>
                </div>
                <span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${STATUS_TONE[status]}`}>{status}</span>
              </div>
              <div className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3 text-sm text-muted sm:grid-cols-3">
                <p className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" aria-hidden />{proposal.appointment}</p>
                <p className="flex items-center gap-2"><MapPin className="size-4 text-primary" aria-hidden />{proposal.mode}</p>
                <p className="flex items-center gap-2"><Clock3 className="size-4 text-primary" aria-hidden />{proposal.fee.toLocaleString("fr-FR")} FCFA</p>
              </div>
              {proposal.response && <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-sm text-ink">{proposal.response}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/medecin/besoins/${proposal.needId}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white">Voir le besoin <ArrowRight className="size-4" aria-hidden /></Link>
                {status === "Acceptée" && <Link href="/medecin/messages" className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-50 px-4 text-sm font-bold text-primary">Contacter le patient</Link>}
                {["En attente", "Envoyée"].includes(status) && <button type="button" onClick={() => setCancelled((items) => [...items, proposal.id])} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-muted hover:text-rose-700"><X className="size-4" aria-hidden />Annuler</button>}
              </div>
            </li>;
          })}
        </ul>
      )}
      <p className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-muted"><Send className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />Les réponses du patient sont affichées dès qu’elles sont reçues. Une proposition acceptée permet de poursuivre l’organisation du rendez-vous.</p>
    </div>
  );
}
