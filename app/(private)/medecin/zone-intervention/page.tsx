"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { integrationService, type DoctorZoneSettings } from "@/services/integration-service";

const empty: DoctorZoneSettings = {city:"",districts:[],radiusKm:10,maxDistanceKm:25};
const card = "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm";
export default function DoctorZonePage() {
  const [zone,setZone]=useState<DoctorZoneSettings>(empty);
  const [district,setDistrict]=useState("");
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [success,setSuccess]=useState(false);
  const [refresh,setRefresh]=useState(0);
  useEffect(()=>{
    let live=true;setLoading(true);setError(null);
    integrationService.getDoctorZone().then(v=>{if(live)setZone(v)}).catch(e=>{if(live)setError(e instanceof Error?e.message:"Impossible de charger les zones.")}).finally(()=>{if(live)setLoading(false)});
    return ()=>{live=false};
  },[refresh]);
  function addDistrict(){const value=district.trim();if(!value || zone.districts.some(d=>d.toLowerCase()===value.toLowerCase()))return;setZone(z=>({...z,districts:[...z.districts,value]}));setDistrict("");setSuccess(false)}
  async function submit(event:FormEvent){event.preventDefault();setSaving(true);setSuccess(false);setError(null);
    try{const updated=await integrationService.saveDoctorZone(zone);setZone(updated);setSuccess(true)}
    catch(e){setError(e instanceof Error?e.message:"Impossible d'enregistrer la zone.")}finally{setSaving(false)}
  }
  return <div className="space-y-5"><header><h1 className="flex items-center gap-2 text-3xl font-extrabold text-night"><MapPin className="size-7 text-primary"/> Zone d’intervention</h1><p className="mt-2 text-muted">Définissez les zones dans lesquelles vous intervenez. Les modifications sont enregistrées sur le serveur.</p></header>
    {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error} <button type="button" className="font-bold underline" onClick={()=>setRefresh(v=>v+1)}>Réessayer</button></p>}
    {loading ? <p role="status" className={card}>Chargement des zones…</p> : <form onSubmit={submit} className={`${card} space-y-5`}>
      {success && <p role="status" className="rounded-lg bg-emerald-50 p-3 font-semibold text-emerald-700">Zone enregistrée sur le serveur.</p>}
      <label className="block text-sm font-bold">Ville<input maxLength={100} required value={zone.city} onChange={e=>{setZone(z=>({...z,city:e.target.value}));setSuccess(false)}} placeholder="Ex. Yaoundé" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"/></label>
      <section><h2 className="font-bold">Quartiers couverts</h2><div className="mt-2 flex gap-2"><input value={district} maxLength={100} onChange={e=>setDistrict(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addDistrict()}}} placeholder="Ajouter un quartier" className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3"/><button type="button" onClick={addDistrict} className="rounded-xl bg-blue-50 px-4 font-bold text-primary"><Plus className="size-5" aria-label="Ajouter"/></button></div><ul className="mt-3 flex flex-wrap gap-2">{zone.districts.map(d=><li key={d} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm">{d}<button type="button" aria-label={`Retirer ${d}`} onClick={()=>{setZone(z=>({...z,districts:z.districts.filter(x=>x!==d)}));setSuccess(false)}}><Trash2 className="size-4 text-rose-600"/></button></li>)}</ul></section>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">Rayon d’intervention (km)<input type="number" min={1} max={250} required value={zone.radiusKm} onChange={e=>{setZone(z=>({...z,radiusKm:Number(e.target.value)}));setSuccess(false)}} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"/></label><label className="text-sm font-bold">Distance maximale (km)<input type="number" min={1} max={500} required value={zone.maxDistanceKm} onChange={e=>{setZone(z=>({...z,maxDistanceKm:Number(e.target.value)}));setSuccess(false)}} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3"/></label></div>
      <button disabled={saving} type="submit" className="h-11 rounded-xl bg-primary px-6 font-bold text-white disabled:opacity-50">{saving?"Enregistrement…":"Enregistrer la zone"}</button>
    </form>}
  </div>;
}
