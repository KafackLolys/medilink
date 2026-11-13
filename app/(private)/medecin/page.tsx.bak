"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, ShieldCheck, Users } from "lucide-react";
import { doctorService, type DoctorOwnProfile } from "@/services/doctor-service";
import { needService, type DoctorNeedListItem } from "@/services/need-service";
import { appointmentService, type DoctorAppointment } from "@/services/appointment-service";

const card = "rounded-3xl border border-slate-200/70 bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)]";
const dayTime = (value: DoctorAppointment) => `${value.date}T${value.time}:00`;
const ACTIVE = new Set(["pending_confirmation", "confirmed"]);

export default function DoctorDashboard() {
  const [profile, setProfile] = useState<DoctorOwnProfile | null>(null);
  const [needs, setNeeds] = useState<DoctorNeedListItem[]>([]);
  const [needsTotal, setNeedsTotal] = useState(0);
  const [proposalsTotal, setProposalsTotal] = useState(0);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let live = true;
    setLoading(true);
    Promise.allSettled([
      doctorService.myProfile(), needService.listForDoctor({},1,5),
      needService.listProposalsForDoctor("",1,10), appointmentService.listDoctor(),
    ]).then(([p,n,pr,a])=>{
      if(!live) return;
      const issues:string[]=[];
      if(p.status==="fulfilled") setProfile(p.value); else {setProfile(null);issues.push("profil");}
      if(n.status==="fulfilled") {setNeeds(n.value.items);setNeedsTotal(n.value.total);} else {setNeeds([]);setNeedsTotal(0);issues.push("demandes");}
      if(pr.status==="fulfilled") {setProposalsTotal(pr.value.total);} else {setProposalsTotal(0);issues.push("propositions");}
      if(a.status==="fulfilled") setAppointments(a.value); else {setAppointments([]);issues.push("rendez-vous");}
      setErrors(issues);
    }).finally(()=>{if(live)setLoading(false)});
    return ()=>{live=false};
  },[refresh]);

  const now = new Date();
  const today = new Intl.DateTimeFormat("en-CA",{timeZone:"Africa/Douala",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
  const upcoming = appointments.filter(a=>ACTIVE.has(a.status) && new Date(dayTime(a)).getTime() >= now.getTime());
  const todayAppointments = appointments.filter(a=>a.date===today && ACTIVE.has(a.status));
  // No fabricated response-rate: this metric requires a server-side business definition.
  const metrics = [["Demandes disponibles",needsTotal,"/medecin/besoins"],["Propositions envoyées",proposalsTotal,"/medecin/propositions"],["Rendez-vous à venir",upcoming.length,"/medecin/rendez-vous"]] as const;

  return <div className="space-y-6">
    <header className="rounded-3xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6"><div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-extrabold text-night">Bonjour Docteur 👋</h1>{profile?.verificationStatus==="verified" && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"><ShieldCheck className="size-4"/> Médecin vérifié</span>}</div><p className="mt-2 text-muted">Suivez vos demandes, propositions et consultations à partir des données MediLink.</p></header>
    {errors.length>0 && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">Chargement impossible : {errors.join(", ")}. <button className="font-bold underline" onClick={()=>setRefresh(v=>v+1)}>Réessayer</button></p>}
    {loading ? <div className={card} role="status">Chargement du tableau de bord…</div> : <>
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Résumé">{metrics.map(([label,count,href])=><Link key={label} href={href} className={card}><p className="text-sm font-bold text-muted">{label}</p><p className="mt-2 text-3xl font-extrabold text-primary">{count}</p></Link>)}</section>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section className={card}><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl font-extrabold"><Users className="size-5 text-primary"/> Demandes récentes</h2><Link href="/medecin/besoins" className="text-sm font-bold text-primary">Tout voir</Link></div>
          <ul className="mt-4 space-y-3">{needs.map(n=><li key={n.id} className="rounded-xl border border-slate-100 p-3"><h3 className="font-bold">{n.title}</h3><p className="mt-1 line-clamp-2 text-sm text-muted">{n.summary}</p><p className="mt-1 text-xs text-muted">{n.specialty} · {n.city}, {n.district}</p><Link href={`/medecin/besoins/${encodeURIComponent(n.id)}`} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary">Consulter <ArrowRight className="size-4"/></Link></li>)}</ul>{needs.length===0 && <p className="mt-3 text-muted">Aucune demande disponible actuellement.</p>}
        </section>
        <div className="space-y-5"><section className={card}><h2 className="flex items-center gap-2 text-xl font-extrabold"><CalendarDays className="size-5 text-primary"/> Rendez-vous du jour</h2><ul className="mt-4 space-y-3">{todayAppointments.map(a=><li key={a.id} className="rounded-xl bg-slate-50 p-3"><p className="font-bold">{a.time} · {a.patient}</p><p className="text-sm text-muted">{a.mode} · {a.status=== "confirmed" ? "Confirmé" : "À confirmer"}</p></li>)}</ul>{todayAppointments.length===0 && <p className="mt-3 text-sm text-muted">Aucun rendez-vous aujourd’hui.</p>}<Link href="/medecin/rendez-vous" className="mt-3 inline-block text-sm font-bold text-primary">Voir l'agenda</Link></section>
          <section className={card}><h2 className="text-xl font-extrabold">Actions rapides</h2><div className="mt-3 grid gap-2">{[["Voir les besoins","/medecin/besoins"],["Gérer mes disponibilités","/medecin/disponibilites"],["Modifier mon profil","/medecin/profil"],["Gérer mes zones","/medecin/zone-intervention"]].map(([label,href])=><Link key={href} href={href} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-primary">{label}</Link>)}</div></section></div>
      </div>
      <section className={card}><h2 className="flex items-center gap-2 text-lg font-extrabold"><MapPin className="size-5 text-primary"/> Informations professionnelles</h2>{profile ? <p className="mt-2 text-sm text-muted">{profile.name} · {profile.specialty} · {profile.professionalAddress ?? "Adresse non renseignée"}</p> : <p className="mt-2 text-sm text-muted">Profil indisponible.</p>}</section>
    </>}
  </div>;
}
