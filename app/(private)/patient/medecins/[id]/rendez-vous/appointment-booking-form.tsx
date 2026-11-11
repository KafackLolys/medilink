"use client";

import { Button } from "@/components/custum/button";
import type { DoctorListing } from "@/lib/doctors";
import { ArrowLeft, CalendarDays, CheckCircle2, House, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

export default function AppointmentBookingForm({ doctor }: { doctor: DoctorListing }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState(doctor.modes[0] ?? "À domicile");
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);
  const [minimumDate, setMinimumDate] = useState("");

  useEffect(() => {
    setMinimumDate(new Date().toLocaleDateString("en-CA"));
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-7 text-center shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-8" aria-hidden /></span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-night">Demande de rendez-vous prête</h1>
        <p className="mt-3 text-muted">Votre demande pour {doctor.name} le {new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", { dateStyle: "long" })} à {time} ({mode.toLowerCase()}) est prise en compte.</p>
        <p className="mt-3 text-sm text-muted">Vous pourrez suivre la confirmation depuis votre espace rendez-vous.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/patient/rendez-vous" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-white">Mes rendez-vous</Link>
          <Link href={`/patient/medecins/${doctor.id}`} className="inline-flex h-12 items-center justify-center rounded-full bg-surface px-6 font-semibold text-ink">Retour au profil</Link>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href={`/patient/medecins/${doctor.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden />Profil du médecin</Link>
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Prendre rendez-vous</h1>
        <p className="mt-2 text-lg text-muted">Choisissez une date et un créneau avec {doctor.name}.</p>
      </header>
      <form onSubmit={submit} className="space-y-5 rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-7">
        <div className="flex items-center gap-4 rounded-2xl bg-surface p-4"><span className={`grid size-14 place-items-center rounded-2xl text-lg font-bold ${doctor.color}`}>{doctor.initials}</span><div><p className="font-bold text-ink">{doctor.name}</p><p className="text-sm text-muted">{doctor.specialty} · {doctor.area}</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-ink">Date souhaitée
            <span className="relative mt-1.5 block"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden /><input type="date" required min={minimumDate || undefined} value={date} onChange={(event) => setDate(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></span>
          </label>
          <label className="block text-sm font-semibold text-ink">Heure souhaitée
            <input type="time" required value={time} onChange={(event) => setTime(event.target.value)} className="mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
        </div>
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Type de consultation</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {doctor.modes.map((item) => {
              const isHome = item === "À domicile";
              const Icon = isHome ? House : Video;
              return <button key={item} type="button" onClick={() => setMode(item)} aria-pressed={mode === item} className={`flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${mode === item ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/15" : "border-slate-200 text-ink hover:border-slate-300"}`}><Icon className="size-4" aria-hidden />{item}</button>;
            })}
          </div>
        </fieldset>
        <label className="block text-sm font-semibold text-ink">Motif de consultation <span className="font-normal text-muted">(facultatif)</span>
          <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} maxLength={500} placeholder="Décrivez brièvement le motif de votre rendez-vous…" className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
        </label>
        <p className="rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-ink">Le rendez-vous sera confirmé après réponse du médecin. En cas d’urgence, contactez immédiatement les services d’urgence.</p>
        <Button type="submit">Envoyer la demande</Button>
      </form>
    </div>
  );
}
