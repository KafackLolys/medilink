"use client";
import { Clock, FileText, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ACTIVE, REQUESTS } from "@/lib/mock-data";
import { Status, StatusBadge } from "@/components/custum/status-badge";
import { Tabs } from "@/components/custum/tabs";

type Tab = "all" | "active" | "confirmed" | "draft" | "closed";
const FILTERS: Record<Tab, Status[] | null> = {
  all: null, active: ACTIVE, confirmed: ["Rendez-vous confirmé"], draft: ["Brouillon"], closed: ["Clôturée", "Annulée"],
};
const EMPTY: Record<Tab, string> = {
  all: "Vous n’avez pas encore publié de demande.", active: "Aucune demande en cours.", confirmed: "Aucun rendez-vous confirmé pour le moment.",
  draft: "Aucun brouillon enregistré.", closed: "Aucune demande clôturée.",
};
const card = "rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]";

export default function RequestsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const count = (t: Tab) => REQUESTS.filter((r) => !FILTERS[t] || FILTERS[t]!.includes(r.status)).length;
  const list = REQUESTS.filter((r) => !FILTERS[tab] || FILTERS[tab]!.includes(r.status));
  const proposals = REQUESTS.filter((r) => ACTIVE.includes(r.status)).reduce((n, r) => n + r.interested, 0);

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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["En cours", count("active"), "text-primary"], ["Propositions reçues", proposals, "text-secondary"], ["Rendez-vous confirmés", count("confirmed"), "text-success"], ["Clôturées", count("closed"), "text-muted"]].map(([l, n, c]) => (
          <div key={l as string} className={`${card} p-5`}><p className={`text-3xl font-extrabold ${c}`}>{n}</p><p className="mt-1 text-sm font-medium text-muted">{l}</p></div>
        ))}
      </div>

      <Tabs label="Filtrer mes demandes" value={tab} onChange={setTab}
        items={[{ id: "all", label: "Toutes", count: count("all") }, { id: "active", label: "En cours", count: count("active") }, { id: "confirmed", label: "Confirmées", count: count("confirmed") }, { id: "draft", label: "Brouillons", count: count("draft") }, { id: "closed", label: "Clôturées", count: count("closed") }]} />

      {list.length === 0 ? (
        <div className={`${card} grid place-items-center gap-3 p-12 text-center`}>
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/[.08] text-primary"><FileText className="size-7" aria-hidden /></span>
          <p className="text-lg font-semibold text-ink">{EMPTY[tab]}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((r) => (
            <li key={r.id} className={`${card} p-5 sm:p-6`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-ink">{r.title}</h2>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                    <span className="rounded-full bg-primary/[.08] px-3 py-1 font-semibold text-primary">{r.specialty}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="size-4" aria-hidden />{r.publishedOn}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" aria-hidden />{r.mode}</span>
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[15px] text-muted"><strong className="text-ink">{r.interested}</strong> {r.interested > 1 ? "médecins intéressés" : "médecin intéressé"}</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/patient/demandes/${r.id}`} className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-white">Consulter</Link>
                  {(r.status === "Brouillon" || ACTIVE.includes(r.status)) && <Link href={`/patient/demandes/${r.id}/modifier`} className="inline-flex h-11 items-center rounded-full bg-surface px-6 font-semibold text-ink">Modifier</Link>}
                  {ACTIVE.includes(r.status) && <button className="inline-flex h-11 items-center rounded-full px-4 font-semibold text-muted hover:text-danger">Clôturer</button>}
                  {r.status === "Brouillon" && <button className="inline-flex h-11 items-center rounded-full px-4 font-semibold text-muted hover:text-danger">Supprimer</button>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
