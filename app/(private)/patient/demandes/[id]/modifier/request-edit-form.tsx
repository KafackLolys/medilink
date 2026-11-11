"use client";

import { Button } from "@/components/custum/button";
import { SelectField, TextAreaField, TextField } from "@/components/custum/field";
import { usePatientNeed } from "@/hooks/use-patient-need";
import { SPECIALTIES } from "@/lib/doctors";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

const EDITABLE_STATUSES = [
  "draft",
  "published",
  "awaiting_proposals",
  "proposals_received",
] as const;

export default function RequestEditForm({ id }: { id: string }) {
  const { need, loading, updating, error, update } = usePatientNeed(id);

  if (loading) {
    return <p role="status" className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center text-muted">Chargement de la demande…</p>;
  }
  if (error || !need) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <Link href="/patient/demandes" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden />Mes demandes
        </Link>
        <p role="alert" className="rounded-2xl bg-danger/10 p-4 text-danger">
          {error ?? "Cette demande est introuvable."}
        </p>
      </div>
    );
  }
  if (!EDITABLE_STATUSES.includes(need.status as (typeof EDITABLE_STATUSES)[number])) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <Link href={`/patient/demandes/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden />Détail de la demande
        </Link>
        <p role="alert" className="rounded-2xl bg-surface p-4 text-muted">Cette demande ne peut plus être modifiée.</p>
      </div>
    );
  }

  return (
    <RequestEditFields
      key={need.id}
      need={need}
      updating={updating}
      error={error}
      onSave={update}
    />
  );
}

function RequestEditFields({
  need,
  updating,
  error,
  onSave,
}: {
  need: NonNullable<ReturnType<typeof usePatientNeed>["need"]>;
  updating: boolean;
  error: string | null;
  onSave: (data: {
    title: string;
    specialty: string;
    description: string;
    mode: "domicile" | "tele";
  }) => Promise<unknown>;
}) {
  const [title, setTitle] = useState(need.title);
  const [specialty, setSpecialty] = useState(need.specialty);
  const [mode, setMode] = useState(
    need.mode === "domicile" ? "À domicile" : "Téléconsultation",
  );
  const [description, setDescription] = useState(need.description);
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);
    try {
      await onSave({
        title,
        specialty,
        description,
        mode: mode === "Téléconsultation" ? "tele" : "domicile",
      });
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href={`/patient/demandes/${need.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden />Détail de la demande</Link>
      <header><h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Modifier ma demande</h1><p className="mt-2 text-lg text-muted">Mettez à jour les informations de votre besoin médical.</p></header>
      {saved && <p role="status" className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700"><CheckCircle2 className="size-5 shrink-0" aria-hidden />Modifications enregistrées.</p>}
      {error && <p role="alert" className="rounded-2xl bg-danger/10 p-4 text-danger">{error}</p>}
      <form onSubmit={submit} className="space-y-5 rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-7">
        <TextField name="title" label="Titre de la demande" value={title} onChange={(event) => { setTitle(event.target.value); setSaved(false); }} required />
        <SelectField name="specialty" label="Spécialité" options={SPECIALTIES} value={specialty} onChange={(event) => { setSpecialty(event.target.value); setSaved(false); }} placeholder="Choisir une spécialité" />
        <SelectField name="mode" label="Type de consultation" options={["À domicile", "Téléconsultation"]} value={mode} onChange={(event) => { setMode(event.target.value); setSaved(false); }} />
        <TextAreaField name="description" label="Description de votre situation" value={description} onChange={(event) => { setDescription(event.target.value); setSaved(false); }} hint="Ajoutez les précisions utiles aux médecins." rows={5} />
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link href={`/patient/demandes/${need.id}`} className="inline-flex h-12 items-center justify-center rounded-full bg-surface px-6 font-semibold text-ink">Annuler</Link>
          <Button type="submit" loading={updating}>Enregistrer les modifications</Button>
        </div>
      </form>
    </div>
  );
}
