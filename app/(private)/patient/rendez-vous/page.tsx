"use client";
import { StatusBadge } from "@/components/custum/status-badge";
import { Tabs } from "@/components/custum/tabs";
import { Appointment, APPOINTMENTS } from "@/lib/mock-data";
import { CalendarDays, Clock, House, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Tab = "all" | Appointment["status"];
const EMPTY: Record<Tab, string> = {
  all: "Aucun rendez-vous pour le moment.", "En attente de confirmation": "Aucun rendez-vous en attente.",
  Confirmé: "Aucun rendez-vous confirmé pour le moment.", Terminé: "Aucune consultation terminée.", Annulé: "Aucun rendez-vous annulé.",
};
const card = "rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]";
const ghost = "inline-flex h-11 items-center rounded-full bg-surface px-6 font-semibold text-ink";

function Actions({ a }: { a: Appointment }) {
  if (a.status === "En attente de confirmation")
    return <><Link href={`/patient/rendez-vous/${a.id}`} className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-white">Voir le détail</Link><button className={ghost}>Modifier</button><button className="h-11 px-4 font-semibold text-muted hover:text-danger">Annuler</button></>;
  if (a.status === "Confirmé")
    return <><Link href={`/patient/rendez-vous/${a.id}`} className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-white">Voir le détail</Link><Link href="/patient/messages" className={ghost}>Écrire au médecin</Link><button className="h-11 px-4 font-semibold text-muted hover:text-danger">Annuler</button></>;
  if (a.status === "Terminé")
    return <><button className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-white">Laisser un avis</button><Link href="/patient/medecins" className={ghost}>Reprendre rendez-vous</Link></>;
  return <Link href="/patient/medecins" className={ghost}>Reprendre rendez-vous</Link>;
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const count = (t: Tab) => APPOINTMENTS.filter((a) => t === "all" || a.status === t).length;
  const list = APPOINTMENTS.filter((a) => tab === "all" || a.status === tab);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Rendez-vous</h1>
        <p className="mt-2 text-lg text-muted">Consultez, modifiez ou annulez vos rendez-vous.</p>
      </div>

      <Tabs label="Filtrer mes rendez-vous" value={tab} onChange={setTab}
        items={[{ id: "all", label: "Tous", count: count("all") }, { id: "En attente de confirmation", label: "En attente", count: count("En attente de confirmation") }, { id: "Confirmé", label: "Confirmés", count: count("Confirmé") }, { id: "Terminé", label: "Terminés", count: count("Terminé") }, { id: "Annulé", label: "Annulés", count: count("Annulé") }]} />

      {list.length === 0 ? (
        <div className={`${card} grid place-items-center gap-3 p-12 text-center`}>
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/[.08] text-primary"><CalendarDays className="size-7" aria-hidden /></span>
          <p className="text-lg font-semibold text-ink">{EMPTY[tab]}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((a) => {
            const past = a.status === "Terminé" || a.status === "Annulé";
            return (
              <li key={a.id} className={`${card} p-5 sm:p-6`}>
                <div className="flex gap-4 sm:gap-5">
                  <div className={`grid size-16 shrink-0 place-items-center rounded-2xl sm:size-20 ${past ? "bg-slate-100 text-muted" : "bg-primary/[.08] text-primary"}`}>
                    <span className="text-center leading-none"><span className="block text-2xl font-extrabold sm:text-3xl">{a.day}</span><span className="mt-1 block text-sm font-semibold">{a.month}</span></span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-ink">{a.doctor.name}</h2>
                        <p className="text-[15px] text-muted">{a.doctor.specialty}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-muted">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden />{a.dateLabel}</span>
                      <span className="inline-flex items-center gap-1.5"><Clock className="size-4" aria-hidden />{a.time}</span>
                      <span className="inline-flex items-center gap-1.5">{a.mode === "domicile" ? <House className="size-4" aria-hidden /> : <Video className="size-4" aria-hidden />}{a.mode === "domicile" ? "À votre domicile" : "Téléconsultation"}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4"><Actions a={a} /></div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
