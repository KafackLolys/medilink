"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { DOCTOR_PATIENT_REVIEWS } from "@/lib/doctor-portal-data";
import { MessageSquareText, Star } from "lucide-react";
import { useState } from "react";

export default function DoctorReviewsPage() {
  const [filter, setFilter] = useState("all");
  const reviews = DOCTOR_PATIENT_REVIEWS.filter((review) => filter === "all" || review.rating === Number(filter));
  return (
    <div className="space-y-5">
      <DoctorPageHeading title="Avis des patients" description="Consultez les retours des patients après leurs consultations." />
      <section className={`${doctorCard} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5`}>
        <div className="text-center sm:min-w-36"><p className="text-4xl font-extrabold text-night">4,9</p><div className="mt-1 flex justify-center text-amber-400">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="size-4 fill-current" aria-hidden />)}</div><p className="mt-1 text-xs text-muted">38 avis au total</p></div>
        <div className="h-px bg-slate-100 sm:h-16 sm:w-px" />
        <div className="flex-1 space-y-2">{[5, 4, 3, 2, 1].map((rating) => <div key={rating} className="flex items-center gap-2 text-xs"><span className="w-6 text-right text-muted">{rating} ★</span><span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-amber-400" style={{ width: `${rating === 5 ? 78 : rating === 4 ? 18 : 4}%` }} /></span><span className="w-8 text-muted">{rating === 5 ? 30 : rating === 4 ? 7 : 1}</span></div>)}</div>
      </section>
      <label className="block max-w-xs text-sm font-semibold text-ink">Filtrer les avis
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3"><option value="all">Toutes les notes</option>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} étoiles</option>)}</select>
      </label>
      <ul className="space-y-3">
        {reviews.map((review) => <li key={review.id} className={`${doctorCard} p-4 sm:p-5`}>
          <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="text-sm font-bold text-night">{review.patient}</h2><p className="mt-1 text-xs text-muted">{review.date}</p></div><span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">{review.rating}<Star className="size-4 fill-current" aria-hidden /></span></div>
          <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted"><MessageSquareText className="mt-1 size-4 shrink-0 text-primary" aria-hidden />{review.comment}</p>
        </li>)}
      </ul>
    </div>
  );
}
