"use client";

import { doctorCard, DoctorPageHeading } from "../../../components/doctor-ui";
import { DOCTOR_NEEDS, NeedMode } from "@/lib/doctor-portal-data";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, FileText, MapPin, ShieldCheck, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function DoctorNeedDetailPage({ id }: { id: string }) {
  const need = DOCTOR_NEEDS.find((item) => item.id === id);
  const [form, setForm] = useState({ message: "", date: "", time: "", mode: "À domicile" as NeedMode, fee: "", details: "" });
  const [step, setStep] = useState<"details" | "review" | "sent">("details");

  if (!need) {
    return <div className={`${doctorCard} p-8 text-center`}><h1 className="text-xl font-bold text-night">Cette demande est introuvable.</h1><Link href="/medecin/besoins" className="mt-4 inline-flex text-primary hover:underline">Retour aux besoins</Link></div>;
  }

  function reviewProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep("review");
  }

  if (step === "sent") {
    return (
      <div className={`${doctorCard} mx-auto max-w-xl p-8 text-center`}>
        <CheckCircle2 className="mx-auto size-12 text-emerald-600" aria-hidden />
        <h1 className="mt-4 text-2xl font-extrabold text-night">Proposition envoyée</h1>
        <p className="mt-2 text-muted">Le patient pourra consulter votre message et répondre depuis son espace.</p>
        <Link href="/medecin/propositions" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 font-bold text-white">Voir mes propositions <ArrowRight className="size-4" aria-hidden /></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href="/medecin/besoins" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden /> Retour aux besoins</Link>
      <DoctorPageHeading title={need.title} description={`Publié ${need.publishedAt} · ${need.specialty}`} />
      <article className={`${doctorCard} space-y-5 p-4 sm:p-6`}>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-primary">{need.specialty}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-muted">{need.mode}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-muted">Priorité {need.priority.toLowerCase()}</span>
        </div>
        <section>
          <h2 className="text-base font-bold text-night">Description du besoin</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{need.summary}</p>
        </section>
        <section>
          <h2 className="text-base font-bold text-night">Symptômes déclarés</h2>
          <ul className="mt-2 flex flex-wrap gap-2">{need.symptoms.map((symptom) => <li key={symptom} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">{symptom}</li>)}</ul>
          <p className="mt-2 text-sm text-muted">Durée : {need.duration}</p>
        </section>
        <div className="grid gap-3 sm:grid-cols-2">
          <p className="flex items-center gap-2 text-sm text-ink"><MapPin className="size-4 text-primary" aria-hidden />{need.city} · {need.district} <span className="text-muted">({need.distanceKm} km env.)</span></p>
          <p className="flex items-center gap-2 text-sm text-ink"><CalendarDays className="size-4 text-primary" aria-hidden />Disponible : {need.availableFrom}</p>
          <p className="flex items-center gap-2 text-sm text-ink"><Clock3 className="size-4 text-primary" aria-hidden />Publié {need.publishedAt}</p>
        </div>
        {need.documents.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-night">Documents partagés par le patient</h2>
            <ul className="mt-2 space-y-2">{need.documents.map((document) => <li key={document} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-muted"><FileText className="size-4 text-primary" aria-hidden />{document}<span className="ml-auto text-xs">Document autorisé</span></li>)}</ul>
          </section>
        )}
        <p className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />L’identité et l’adresse exacte du patient ne sont partagées qu’après confirmation de la prise en charge.
        </p>
      </article>

      {step === "details" ? (
        <form onSubmit={reviewProposal} className={`${doctorCard} space-y-4 p-4 sm:p-6`}>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-night"><Stethoscope className="size-5 text-primary" aria-hidden />Proposer mes services</h2>
          <label className="block text-sm font-semibold text-ink">Message au patient
            <textarea required minLength={10} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Présentez brièvement votre approche et répondez au besoin…" className="mt-1.5 min-h-24 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold text-ink">Date proposée
              <input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal" />
            </label>
            <label className="text-sm font-semibold text-ink">Heure proposée
              <input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal" />
            </label>
            <label className="text-sm font-semibold text-ink">Type de consultation
              <select value={form.mode} onChange={(event) => setForm({ ...form, mode: event.target.value as NeedMode })} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal">
                <option>À domicile</option><option>Téléconsultation</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-ink">Tarif proposé (FCFA)
              <input required min="0" type="number" value={form.fee} onChange={(event) => setForm({ ...form, fee: event.target.value })} placeholder="Ex. 15 000" className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal" />
            </label>
          </div>
          <label className="block text-sm font-semibold text-ink">Informations complémentaires <span className="font-normal text-muted">(facultatif)</span>
            <textarea value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} placeholder="Préparation, durée estimée, éléments à prévoir…" className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-white hover:bg-blue-700 sm:w-auto">Vérifier ma proposition <ArrowRight className="size-4" aria-hidden /></button>
        </form>
      ) : (
        <section className={`${doctorCard} space-y-4 p-4 sm:p-6`}>
          <h2 className="text-lg font-extrabold text-night">Récapitulatif de votre proposition</h2>
          <p className="text-sm leading-6 text-muted">{form.message}</p>
          <div className="grid gap-2 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <p><strong>Date :</strong> {form.date} à {form.time}</p><p><strong>Consultation :</strong> {form.mode}</p><p><strong>Tarif :</strong> {Number(form.fee).toLocaleString("fr-FR")} FCFA</p>
            {form.details && <p className="sm:col-span-2"><strong>Complément :</strong> {form.details}</p>}
          </div>
          <p className="text-xs text-muted">Le patient verra cette proposition et pourra l’accepter ou la refuser. Vous pourrez suivre sa réponse dans « Mes propositions ».</p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setStep("details")} className="h-11 rounded-xl bg-slate-100 px-5 font-semibold text-ink">Modifier</button>
            <button type="button" onClick={() => setStep("sent")} className="h-11 rounded-xl bg-primary px-5 font-bold text-white">Envoyer la proposition</button>
          </div>
        </section>
      )}
    </div>
  );
}
