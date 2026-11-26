"use client";
import { useEffect, useState, type FormEvent } from "react";
import { apiRequest } from "@/services/http";
const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
type Review = { id: string; rating: number; comment: string | null };
export function PatientReviewForm({ appointmentId }: { appointmentId: string }) {
  const [review, setReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = `${API}/appointments/${encodeURIComponent(appointmentId)}/review`;
  useEffect(() => {
    let active = true;
    apiRequest<Review | null>(url).then(result => {if (active) setReview(result);})
      .catch(cause => {if (active) setError(cause instanceof Error ? cause.message : "Avis indisponible.");})
      .finally(() => {if (active) setLoading(false);});
    return () => {active=false;};
  }, [url]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(null);
    try {
      const created = await apiRequest<Review>(url, {method:"POST",body:JSON.stringify({rating,comment:comment.trim() || null})});
      setReview(created);
    } catch (cause) {setError(cause instanceof Error ? cause.message : "Impossible de déposer l'avis.");}
    finally {setSaving(false);}
  }
  return <section id="avis" className="scroll-mt-24 rounded-3xl bg-white p-6 shadow-sm" aria-label="Mon avis après consultation">
    <h2 className="text-lg font-extrabold text-night">Évaluez votre médecin</h2>
    <p className="mt-1 text-sm text-muted">Votre retour aide les autres patients à choisir leur médecin. Ne partagez aucune information médicale personnelle dans le commentaire.</p>
    {loading ? <p className="mt-3 text-muted">Chargement de votre avis…</p> : review ? <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800"><p className="font-semibold">Votre avis a bien été enregistré.</p><p className="mt-1">Note : {review.rating}/5 {review.comment ? `— ${review.comment}` : ""}</p></div> : <form onSubmit={submit} className="mt-4 space-y-4">
      <label className="block text-sm font-semibold text-ink">Votre note
        <select value={rating} onChange={e=>setRating(Number(e.target.value))} className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3">
          {[5,4,3,2,1].map(n=><option key={n} value={n}>{n}/5 {n===5?"— Excellent":n===4?"— Très bien":n===3?"— Bien":n===2?"— Moyen":"— Décevant"}</option>)}
        </select>
      </label>
      <label className="block text-sm font-semibold text-ink">Votre commentaire <span className="font-normal text-muted">(facultatif)</span>
        <textarea maxLength={2000} rows={4} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Décrivez votre expérience avec ce médecin…" className="mt-1 w-full rounded-xl border border-slate-200 p-3 font-normal" />
      </label>
      <button type="submit" disabled={saving} className="rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Publication…" : "Publier mon avis"}</button>
    </form>}
    {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
  </section>;
}
