"use client";
import { CheckCircle2, FileUp, Home, Lock, ShieldAlert, Video, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { SPECIALTIES } from "@/lib/doctors";
import { SelectField, TextAreaField, TextField } from "@/components/custum/field";
import { Button } from "@/components/custum/button";
import { usePatientNeeds } from "@/hooks/use-patient-needs";

type Priority = "normal" | "rapide" | "urgence";
type Mode = "domicile" | "tele";
const SYMPTOMS = ["Fièvre", "Douleur", "Fatigue", "Toux", "Maux de tête", "Vertiges", "Nausées", "Éruption cutanée", "Difficulté à marcher", "Autre"];
const SINCE = ["Aujourd’hui", "2 à 3 jours", "Environ une semaine", "Plus d’une semaine", "Plus d’un mois"];
const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const PRIORITIES: { id: Priority; t: string; d: string }[] = [
  { id: "normal", t: "Consultation normale", d: "Dans les prochains jours" },
  { id: "rapide", t: "Prise en charge rapide", d: "Le plus tôt possible, sans garantie de délai" },
  { id: "urgence", t: "Urgence médicale", d: "Danger immédiat pour la santé" },
];
const card = "rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-7";

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className={card}>
      <h2 className="text-xl font-extrabold tracking-tight text-night">{title}</h2>
      {hint && <p className="mt-1 text-[15px] text-muted">{hint}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function Choice({ on, onClick, icon, title, desc, danger }: { on: boolean; onClick: () => void; icon?: ReactNode; title: string; desc: string; danger?: boolean }) {
  const tone = danger ? "border-danger bg-danger/5 ring-4 ring-danger/10" : "border-primary bg-primary/5 ring-4 ring-primary/10";
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 ${on ? tone : "border-slate-200 bg-white hover:border-slate-300"}`}>
      {icon && <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${on ? (danger ? "bg-danger text-white" : "bg-primary text-white") : "bg-slate-100 text-muted"}`}>{icon}</span>}
      <span><span className={`block font-bold ${danger ? "text-danger" : "text-ink"}`}>{title}</span><span className="block text-sm text-muted">{desc}</span></span>
    </button>
  );
}

export default function PublishNeedPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { create: createNeed, creating } = usePatientNeeds(false);
  const [f, setF] = useState({ title: "", specialty: "", description: "", since: "", city: "", district: "", address: "" });
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority>("normal");
  const [mode, setMode] = useState<Mode>("domicile");
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [view, setView] = useState<"form" | "preview" | "done">("form");
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));
  const urgent = priority === "urgence";

  function validate() {
    const n: Record<string, string> = {};
    if (f.title.trim().length < 5) n.title = "Donnez un titre court (5 caractères minimum).";
    if (!f.specialty) n.specialty = "Choisissez une spécialité, ou « Autre » si vous hésitez.";
    if (f.description.trim().length < 20) n.description = "Décrivez votre situation en quelques phrases (20 caractères minimum).";
    if (!f.city.trim()) n.city = "Indiquez votre ville.";
    if (!f.district.trim()) n.district = "Indiquez votre quartier.";
    if (!consent) n.consent = "Votre accord est nécessaire pour publier.";
    setErrors(n);
    return Object.keys(n).length === 0;
  }

  function preview(e: FormEvent) { e.preventDefault(); if (!urgent && validate()) { setView("preview"); window.scrollTo({ top: 0 }); } }
  async function publish() {
    setErrors({});
    try {
      await createNeed(
        {
          title: f.title.trim(),
          specialty: f.specialty,
          description: f.description.trim(),
          symptoms,
          since: f.since || undefined,
          city: f.city.trim(),
          district: f.district.trim(),
          address: f.address.trim() || undefined,
          priority,
          mode,
          consent,
        },
        files,
      );
      setView("done");
      window.scrollTo({ top: 0 });
    } catch (cause) {
      setErrors({
        form: cause instanceof Error ? cause.message : "Impossible de publier votre demande. Réessayez.",
      });
    }
  }

  function addFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;
    const incoming = Array.from(selectedFiles);
    if (files.length + incoming.length > MAX_FILES) {
      setErrors((current) => ({ ...current, file: `Vous pouvez joindre au maximum ${MAX_FILES} fichiers.` }));
      return;
    }
    const invalidFile = incoming.find(
      (file) =>
        !ALLOWED_FILE_TYPES.has(file.type) || file.size > MAX_FILE_SIZE,
    );
    if (invalidFile) {
      setErrors((current) => ({
        ...current,
        file: !ALLOWED_FILE_TYPES.has(invalidFile.type)
          ? "Seuls les fichiers PDF et les images JPEG, PNG, WebP, HEIC ou HEIF sont acceptés."
          : "Chaque fichier doit faire 10 Mo ou moins.",
      }));
      return;
    }
    setErrors((current) => {
      const next = { ...current };
      delete next.file;
      return next;
    });
    setFiles((current) => [...current, ...incoming]);
  }

  if (view === "done")
    return (
      <div className={`${card} mx-auto max-w-xl text-center`}>
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-success/10 text-success"><CheckCircle2 className="size-8" aria-hidden /></span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-night">Votre demande est publiée</h1>
        <p className="mt-3 text-base text-muted">Les médecins vérifiés de votre secteur peuvent la consulter. Vous serez notifié à chaque proposition, et c’est vous qui choisissez.</p>
        <p className="mt-4 rounded-2xl bg-warn/10 px-4 py-3 text-sm text-ink">Si votre état s’aggrave, n’attendez pas de réponse : contactez immédiatement les services d’urgence.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link href="/patient/demandes" className="inline-flex h-12 items-center justify-center rounded-full bg-primary font-semibold text-white">Voir mes demandes</Link>
          <Link href="/patient" className="inline-flex h-12 items-center justify-center rounded-full bg-surface font-semibold text-ink">Tableau de bord</Link>
        </div>
      </div>
    );

  if (view === "preview")
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Aperçu de votre demande</h1>
          <p className="mt-2 text-lg text-muted">Voici ce que verront les médecins vérifiés de votre secteur.</p>
        </div>
        <article className={card}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/[.08] px-3 py-1 text-xs font-bold text-primary">{f.specialty}</span>
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">{mode === "domicile" ? "À domicile" : "Téléconsultation"}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${priority === "rapide" ? "bg-warn/15 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{PRIORITIES.find((p) => p.id === priority)!.t}</span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-ink">{f.title}</h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink">{f.description}</p>
          <dl className="mt-5 grid gap-4 rounded-2xl bg-surface p-4 text-[15px] sm:grid-cols-2">
            <div><dt className="font-semibold text-muted">Symptômes</dt><dd className="mt-0.5">{symptoms.length ? symptoms.join(", ") : "Non précisés"}</dd></div>
            <div><dt className="font-semibold text-muted">Depuis</dt><dd className="mt-0.5">{f.since || "Non précisé"}</dd></div>
            <div><dt className="font-semibold text-muted">Localisation</dt><dd className="mt-0.5">{f.district}, {f.city}</dd></div>
            <div><dt className="font-semibold text-muted">Adresse exacte</dt><dd className="mt-0.5 flex items-center gap-1.5"><Lock className="size-4" aria-hidden /> Masquée</dd></div>
            <div><dt className="font-semibold text-muted">Documents</dt><dd className="mt-0.5">{files.length ? `${files.length} fichier(s), partagés après votre accord` : "Aucun"}</dd></div>
          </dl>
        </article>
        {errors.form && <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{errors.form}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={() => setView("form")}>Modifier</Button>
          <Button onClick={publish} loading={creating}>Publier ma demande</Button>
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Publier un besoin médical</h1>
        <p className="mt-2 text-lg text-muted">Décrivez votre situation avec vos mots. Les médecins vérifiés de votre secteur vous proposeront leurs services.</p>
      </div>

      <div role="note" className="flex gap-3 rounded-3xl bg-danger/[.07] p-5 text-[15px] text-ink">
        <ShieldAlert className="mt-0.5 size-6 shrink-0 text-danger" aria-hidden />
        <p><strong>En cas de symptômes graves</strong> (difficulté à respirer, douleur intense à la poitrine, perte de connaissance, saignement abondant…), contactez immédiatement les services d’urgence. Une publication ne remplace pas une consultation et n’offre aucune garantie de réponse rapide.</p>
      </div>
      {errors.form && <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{errors.form}</p>}

      <form onSubmit={preview} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Section title="Votre besoin" hint="Pas besoin de poser un diagnostic : dites simplement ce que vous ressentez.">
            <TextField label="Titre de la demande" placeholder="Ex. Maux de tête depuis plusieurs jours" value={f.title} onChange={set("title")} error={errors.title} />
            <SelectField label="Spécialité concernée" options={[...SPECIALTIES, "Je ne sais pas"]} value={f.specialty} onChange={set("specialty")} error={errors.specialty} />
            <TextAreaField label="Description de votre situation" maxLength={800} placeholder="Que ressentez-vous ? Depuis quand ? Qu’est-ce qui change quand vous bougez ou vous reposez ?"
              value={f.description} onChange={set("description")} error={errors.description} hint={`${f.description.length} / 800 caractères`} />
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-ink">Symptômes ressentis</legend>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map((s) => {
                  const on = symptoms.includes(s);
                  return (
                    <button key={s} type="button" aria-pressed={on} onClick={() => setSymptoms((x) => (on ? x.filter((y) => y !== s) : [...x, s]))}
                      className={`h-11 rounded-full border-2 px-4 text-[15px] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 ${on ? "border-primary bg-primary/10 text-primary" : "border-slate-200 bg-white text-ink hover:border-slate-300"}`}>{s}</button>
                  );
                })}
              </div>
            </fieldset>
            <SelectField label="Depuis quand ?" options={SINCE} value={f.since} onChange={set("since")} placeholder="Choisir une durée" />
          </Section>

          <Section title="Niveau de priorité" hint="Il vous appartient de l’indiquer. Les médecins le voient, mais ne sont pas tenus de répondre dans un délai précis.">
            <div role="radiogroup" aria-label="Niveau de priorité" className="grid gap-3 sm:grid-cols-3">
              {PRIORITIES.map((p) => <Choice key={p.id} on={priority === p.id} onClick={() => setPriority(p.id)} title={p.t} desc={p.d} danger={p.id === "urgence"} />)}
            </div>
            {urgent && (
              <p role="alert" className="rounded-2xl bg-danger px-5 py-4 text-base font-semibold text-white">
                Une urgence médicale ne doit pas attendre une publication. Appelez les services d’urgence maintenant ou rendez-vous au service d’urgence le plus proche.
              </p>
            )}
          </Section>

          <Section title="Type de consultation">
            <div role="radiogroup" aria-label="Type de consultation" className="grid gap-3 sm:grid-cols-2">
              <Choice on={mode === "domicile"} onClick={() => setMode("domicile")} icon={<Home className="size-5" />} title="À domicile" desc="Le médecin se déplace chez vous" />
              <Choice on={mode === "tele"} onClick={() => setMode("tele")} icon={<Video className="size-5" />} title="Téléconsultation" desc="Par appel vidéo" />
            </div>
          </Section>

          <Section title="Localisation" hint="Les médecins voient votre quartier, jamais votre adresse exacte.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Ville" autoComplete="address-level2" value={f.city} onChange={set("city")} error={errors.city} />
              <TextField label="Quartier" value={f.district} onChange={set("district")} error={errors.district} />
            </div>
            <TextField label="Adresse complète (confidentielle)" icon={<Lock />} autoComplete="street-address" value={f.address} onChange={set("address")}
              hint="Partagée uniquement avec le médecin que vous choisissez." />
          </Section>

          <Section title="Documents et images" hint="Facultatif : ordonnance, résultats d’analyses, photo d’une zone concernée.">
            <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf" className="sr-only" aria-label="Ajouter des documents"
              onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-surface px-4 py-8 text-center transition hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25">
              <FileUp className="size-7 text-primary" aria-hidden />
              <span className="font-semibold text-ink">Ajouter des fichiers</span>
              <span className="text-sm text-muted">PDF ou images (5 fichiers maximum, 10 Mo par fichier)</span>
            </button>
            {errors.file && <p role="alert" className="text-sm text-danger">{errors.file}</p>}
            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((file, i) => (
                  <li key={i} className="flex items-center justify-between rounded-xl bg-surface px-4 py-2.5 text-[15px]">
                    <span className="truncate">{file.name}</span>
                    <button type="button" aria-label={`Retirer ${file.name}`} onClick={() => setFiles((x) => x.filter((_, j) => j !== i))} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-white"><X className="size-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <div className={card}>
            <label className="flex cursor-pointer items-start gap-3 text-[15px]">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-5 shrink-0 rounded border-slate-300 accent-primary" />
              <span>J’accepte que les médecins vérifiés de mon secteur consultent cette demande, sans mon adresse exacte, afin de me proposer leurs services.</span>
            </label>
            {errors.consent && <p className="mt-2 text-sm text-danger">{errors.consent}</p>}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button type="submit" disabled={urgent}>Publier ma demande</Button>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-3xl bg-primary/[.07] p-6">
            <h2 className="text-lg font-bold text-primary">Pour bien décrire</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] text-ink">
              <li>Où cela fait-il mal, et depuis quand ?</li>
              <li>Prenez-vous un traitement ?</li>
              <li>Cela s’aggrave-t-il ou reste-t-il stable ?</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-secondary/[.09] p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-secondary"><Lock className="size-5" aria-hidden /> Votre confidentialité</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] text-ink">
              <li>Seuls les médecins vérifiés voient votre demande.</li>
              <li>Votre adresse reste masquée jusqu’à votre choix.</li>
              <li>Vous pouvez clôturer ou supprimer la demande à tout moment.</li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}
