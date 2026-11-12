"use client";

import { useEffect, useState } from "react";
import { MessageSquareText, Star } from "lucide-react";
import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { doctorReviewService, type DoctorReviewSummary } from "@/services/doctor-review-service";

export default function DoctorReviewsPage() {
  const [data, setData] = useState<DoctorReviewSummary | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  useEffect(() => {
    let active = true;
    doctorReviewService.listMine().then((result) => {
      if (active) setData(result);
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : "Impossible de charger les avis.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [key]);
  const shown = (data?.items ?? []).filter((item) => filter === "all" || item.rating === Number(filter));
  return (
    <div className="space-y-5">
      <DoctorPageHeading title="Avis des patients" description="Avis réels laissés après les consultations terminées." />
      {loading && <p role="status" className={`${doctorCard} p-5 text-muted`}>Chargement des avis…</p>}
      {error && <div className={`${doctorCard} p-5`} role="alert"><p className="text-rose-700">{error}</p><button className="mt-2 font-bold text-primary" onClick={() => {setLoading(true);setError(null);setKey(v=>v+1);}}>Réessayer</button></div>}
      {!loading && !error && data && <>
        <section className={`${doctorCard} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5`}>
          <div className="text-center sm:min-w-36"><p className="text-4xl font-extrabold text-night">{data.rating === null ? "—" : data.rating.toFixed(1).replace(".", ",")}</p><div className="mt-1 flex justify-center text-amber-400">{[1, 2, 3, 4, 5].map(i => <Star key={i} className={`size-4 ${data.rating !== null && i <= Math.round(data.rating) ? "fill-current" : ""}`} aria-hidden />)}</div><p className="mt-1 text-xs text-muted">{data.total} avis</p></div>
          <div className="h-px bg-slate-100 sm:h-16 sm:w-px" />
          <div className="flex-1 space-y-2">{([5,4,3,2,1] as const).map(rating => <div key={rating} className="flex items-center gap-2 text-xs"><span className="w-6 text-right text-muted">{rating} ★</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-amber-400" style={{width: `${data.total ? data.distribution[rating]/data.total*100 : 0}%`}} /></div><span className="w-8 text-muted">{data.distribution[rating]}</span></div>)}</div>
        </section>
        <label className="block max-w-xs text-sm font-semibold text-ink">Filtrer les avis<select value={filter} onChange={e=>setFilter(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3"><option value="all">Toutes les notes</option>{[5,4,3,2,1].map(v=><option key={v} value={v}>{v} étoiles</option>)}</select></label>
        {shown.length === 0 && <div className={`${doctorCard} p-8 text-center text-muted`}>Aucun avis correspondant.</div>}
        <ul className="space-y-3">{shown.map(review=><li key={review.id} className={`${doctorCard} p-4 sm:p-5`}><div className="flex items-start justify-between gap-2"><div><h2 className="text-sm font-bold text-night">{review.patientLabel}</h2><p className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString("fr-FR")}</p></div><span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">{review.rating}<Star className="size-4 fill-current" aria-hidden /></span></div>{review.comment && <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted"><MessageSquareText className="mt-1 size-4 shrink-0 text-primary" aria-hidden />{review.comment}</p>}</li>)}</ul>
      </>}
    </div>
  );
}
