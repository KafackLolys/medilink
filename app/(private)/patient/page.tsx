"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CalendarDays, FileText, Stethoscope } from "lucide-react";
import { needService, type PatientNeed } from "@/services/need-service";
import { appointmentService, type PatientAppointment } from "@/services/appointment-service";
import { notificationService, type UserNotification } from "@/services/notification-service";

const card = "rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]";
const ACTIVE = new Set(["published", "awaiting_proposals", "proposals_received"]);
const UPCOMING = new Set(["pending_confirmation", "confirmed"]);
const dateLabel = (value: string) => new Intl.DateTimeFormat("fr-FR", {dateStyle:"medium",timeStyle:"short",timeZone:"Africa/Douala"}).format(new Date(value));
const needStatus: Record<string,string> = {draft:"Brouillon",published:"Publiée",awaiting_proposals:"En attente de propositions",proposals_received:"Propositions reçues",appointment_confirmed:"Rendez-vous confirmé",closed:"Clôturée",cancelled:"Annulée"};

export default function PatientDashboard() {
  const [needs, setNeeds] = useState<PatientNeed[]>([]);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setErrors([]);
    Promise.allSettled([needService.list(), appointmentService.listMine(), notificationService.list(1, 5)])
      .then(([n, a, notif]) => {
        if (!live) return;
        const issues: string[] = [];
        if (n.status === "fulfilled") setNeeds(n.value); else { setNeeds([]); issues.push("demandes"); }
        if (a.status === "fulfilled") setAppointments(a.value); else { setAppointments([]); issues.push("rendez-vous"); }
        if (notif.status === "fulfilled") setNotifications(notif.value.items); else { setNotifications([]); issues.push("notifications"); }
        setErrors(issues);
      })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [refresh]);

  const active = needs.filter(n => ACTIVE.has(n.status));
  const upcoming = appointments.filter(a => UPCOMING.has(a.status) && new Date(a.scheduledAt).getTime() >= Date.now())
    .sort((a,b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const next = upcoming[0];
  const proposals = active.reduce((sum, need) => sum + need.interested, 0);

  return <div className="space-y-8">
    <header><h1 className="text-3xl font-extrabold text-night">Bonjour, bienvenue 👋</h1><p className="mt-2 text-muted">Vos démarches médicales et vos rendez-vous, en temps réel.</p></header>
    <div className="grid gap-4 sm:grid-cols-2">
      <Link href="/patient/medecins" className="rounded-3xl bg-primary/10 p-6"><Stethoscope className="size-7 text-primary"/><h2 className="mt-3 text-xl font-bold">Trouver un médecin</h2><span className="mt-2 inline-flex items-center gap-2 font-semibold">Rechercher <ArrowRight className="size-4"/></span></Link>
      <Link href="/patient/besoins/nouveau" className="rounded-3xl bg-secondary/10 p-6"><FileText className="size-7 text-secondary"/><h2 className="mt-3 text-xl font-bold">Publier un besoin</h2><span className="mt-2 inline-flex items-center gap-2 font-semibold">Créer une demande <ArrowRight className="size-4"/></span></Link>
    </div>
    {errors.length > 0 && <div role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">Impossible de charger : {errors.join(", ")}. <button className="font-bold underline" onClick={()=>setRefresh(v=>v+1)}>Réessayer</button></div>}
    {loading ? <p role="status" className={card}>Chargement de votre activité…</p> : <>
      <section aria-labelledby="next"><h2 id="next" className="mb-3 text-2xl font-extrabold">Votre prochain rendez-vous</h2>
        {next ? <Link href={`/patient/rendez-vous/${encodeURIComponent(next.id)}`} className={`${card} flex items-center justify-between gap-4`}><div><h3 className="font-bold">{next.doctor.name}</h3><p className="text-sm text-muted">{next.doctor.specialty} · {dateLabel(next.scheduledAt)}</p><p className="text-xs text-muted">{next.consultationMode === "home" ? "À domicile" : "Téléconsultation"}</p></div><ArrowRight className="size-5 text-primary"/></Link> : <p className={card}>Aucun rendez-vous à venir.</p>}
      </section>
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Résumé">
        {[["Demandes actives",active.length,"/patient/demandes"],["Propositions reçues",proposals,"/patient/demandes"],["Rendez-vous à venir",upcoming.length,"/patient/rendez-vous"]].map(([title,value,url])=><Link key={String(title)} href={String(url)} className={card}><p className="text-sm font-bold">{title}</p><p className="mt-2 text-3xl font-extrabold text-primary">{value}</p></Link>)}
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        <section><div className="flex items-center justify-between"><h2 className="text-xl font-extrabold">Demandes en cours</h2><Link href="/patient/demandes" className="text-sm font-bold text-primary">Tout voir</Link></div>
          <ul className="mt-3 space-y-2">{active.slice(0,4).map(n=><li key={n.id}><Link href={`/patient/demandes/${encodeURIComponent(n.id)}`} className={`${card} block`}><p className="font-bold">{n.title}</p><p className="mt-1 text-sm text-muted">{n.specialty} · {needStatus[n.status] ?? n.status}</p></Link></li>)}</ul>{active.length===0 && <p className={`${card} mt-3 text-muted`}>Aucune demande active.</p>}
        </section>
        <section><h2 className="flex items-center gap-2 text-xl font-extrabold"><Bell className="size-5 text-primary"/> Notifications</h2><ul className="mt-3 space-y-2">{notifications.map(n=><li key={n.id}><Link href={n.targetUrl?.startsWith("/") ? n.targetUrl : "/patient"} className={`${card} block`}><p className="font-semibold">{n.title}</p><p className="text-sm text-muted">{n.body}</p><p className="mt-1 text-xs text-muted">{dateLabel(n.createdAt)}</p></Link></li>)}</ul>{notifications.length===0 && <p className={`${card} mt-3 text-muted`}>Aucune notification.</p>}</section>
      </div>
    </>}
  </div>;
}
