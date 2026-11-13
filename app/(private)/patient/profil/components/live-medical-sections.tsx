"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, CalendarDays, ClipboardList, Folder, HeartPulse, ArrowRight, Stethoscope } from "lucide-react";
import { patientHealthService, type PatientHealthCondition } from "@/services/patient-health-service";
import { appointmentService, type PatientAppointment } from "@/services/appointment-service";
import { needService, type PatientNeed } from "@/services/need-service";

const card = "rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:rounded-3xl sm:p-5";
const statusText: Record<string, string> = {
  draft: "Brouillon", published: "Publiée", awaiting_proposals: "En attente de propositions",
  proposals_received: "Propositions reçues", appointment_confirmed: "Rendez-vous confirmé",
  closed: "Clôturée", cancelled: "Annulée", pending_confirmation: "À confirmer",
  confirmed: "Confirmé", completed: "Terminé", rejected: "Refusé", no_show: "Absent",
  active: "Active", controlled: "Contrôlée", inactive: "Inactive",
};

export function LiveMedicalSections({ openDocuments }: { openDocuments: () => void }) {
  const [conditions, setConditions] = useState<PatientHealthCondition[]>([]);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [needs, setNeeds] = useState<PatientNeed[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => { if (active) { setLoading(true); setErrors([]); } });
    Promise.allSettled([patientHealthService.list(), appointmentService.listMine(), needService.list()])
      .then(([health, rdv, requests]) => {
        if (!active) return;
        const issues: string[] = [];
        if (health.status === "fulfilled") setConditions(health.value);
        else issues.push("Impossible de charger les informations de santé.");
        if (rdv.status === "fulfilled") setAppointments(rdv.value);
        else issues.push("Impossible de charger les rendez-vous.");
        if (requests.status === "fulfilled") setNeeds(requests.value);
        else issues.push("Impossible de charger les demandes.");
        setErrors(issues);
      }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh]);
  const recentAppointments = [...appointments].sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()).slice(0, 3);
  const recentNeeds = [...needs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
  return <>
    {errors.length > 0 && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errors.join(" ")} <button type="button" className="font-bold underline" onClick={() => setRefresh(v => v + 1)}>Réessayer</button></div>}
    <section id="health-record" className={card} aria-labelledby="health-title">
      <h2 id="health-title" className="flex items-center gap-2 text-lg font-extrabold text-night"><HeartPulse className="size-6 text-primary" /> Mon état de santé</h2>
      {loading ? <p role="status" className="mt-3 text-muted">Chargement…</p> : conditions.length === 0 ? <p className="mt-3 text-sm text-muted">Aucune information de santé enregistrée.</p> : <ul className="mt-3 grid gap-2 sm:grid-cols-3">{conditions.map(condition => <li key={condition.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><Activity className="size-5 text-primary" /><h3 className="mt-2 font-bold text-ink">{condition.name}</h3><p className="text-sm text-muted">{statusText[condition.status] ?? condition.status}</p>{condition.description && <p className="mt-1 text-xs text-muted">{condition.description}</p>}</li>)}</ul>}
    </section>
    <section className={card} aria-labelledby="appointments-title">
      <div className="flex justify-between gap-2"><h2 id="appointments-title" className="flex items-center gap-2 text-lg font-extrabold text-night"><CalendarDays className="size-5 text-primary" /> Derniers rendez-vous</h2><Link href="/patient/rendez-vous" className="text-sm font-bold text-primary">Voir tout <ArrowRight className="inline size-4" /></Link></div>
      {loading ? <p className="mt-3 text-muted">Chargement…</p> : recentAppointments.length === 0 ? <p className="mt-3 text-sm text-muted">Aucun rendez-vous enregistré.</p> : <ul className="mt-3 space-y-2">{recentAppointments.map(item => <li key={item.id}><Link href={`/patient/rendez-vous/${encodeURIComponent(item.id)}`} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:bg-blue-50"><CalendarDays className="size-5 text-primary" /><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-night">{item.doctor.name}</strong><small className="text-muted">{item.doctor.specialty} · {new Date(item.scheduledAt).toLocaleString("fr-FR")}</small></span><span className="text-xs text-primary">{statusText[item.status] ?? item.status}</span></Link></li>)}</ul>}
    </section>
  </>;
}
