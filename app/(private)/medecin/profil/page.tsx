"use client";

import { doctorCard, DoctorPageHeading, SectionTitle } from "../../components/doctor-ui";
import { useMyDoctorProfile } from "@/hooks/use-my-doctor-profile";
import { ArrowRight, BadgeCheck, BriefcaseMedical, FileCheck2, MapPin, ShieldCheck, Star, UserRound } from "lucide-react";
import Link from "next/link";

const fieldClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-ink";
const verificationLabels = {
  pending: "En attente de vérification",
  verified: "Vérifié",
  rejected: "Vérification refusée",
  suspended: "Compte suspendu",
} as const;
const documentLabels: Record<string, string> = {
  medical_license: "Inscription à l’Ordre des médecins",
  medical_degree: "Diplôme médical",
  identity_document: "Pièce d’identité",
  other: "Autre document",
};
const documentStatusLabels: Record<string, string> = {
  pending: "En attente",
  approved: "Vérifié",
  rejected: "Refusé",
};

function ReadonlyField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <label className="text-sm font-semibold text-ink">
      {label}
      {multiline ? (
        <textarea readOnly value={value || "Non renseigné"} className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-normal text-ink" />
      ) : (
        <input readOnly value={value || "Non renseigné"} className={fieldClass} />
      )}
    </label>
  );
}

export default function DoctorProfilePage() {
  const { profile, loading, error, reload } = useMyDoctorProfile();

  if (loading) {
    return (
      <div className="space-y-5">
        <DoctorPageHeading title="Profil professionnel" description="Chargement des informations de votre compte médecin." />
        <div role="status" className={`${doctorCard} p-8 text-center text-muted`}>Chargement du profil…</div>
      </div>
    );
  }

  if (!profile || error) {
    return (
      <div className="space-y-5">
        <DoctorPageHeading title="Profil professionnel" description="Présentez votre expérience et les informations utiles aux patients." />
        <div className={`${doctorCard} space-y-3 p-6`}>
          <p role="alert" className="text-sm font-semibold text-rose-700">
            {error ?? "Aucun profil médecin n’est associé à ce compte."}
          </p>
          <button type="button" onClick={reload} className="h-10 rounded-xl bg-primary px-4 text-sm font-bold text-white">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const verificationStatus = verificationLabels[profile.verificationStatus];

  return (
    <div className="space-y-5">
      <DoctorPageHeading
        title="Profil professionnel"
        description="Informations récupérées depuis votre compte et votre dossier professionnel."
      />

      <div className={`${doctorCard} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5`}>
        <span className="grid size-16 shrink-0 place-items-center self-center rounded-2xl bg-blue-50 text-primary sm:size-20 sm:self-auto">
          <UserRound className="size-10" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2 className="text-xl font-extrabold text-night">{profile.name}</h2>
          <p className="mt-1 text-sm text-muted">{profile.specialty} · {profile.yearsOfExperience} ans d’expérience</p>
        </div>
        <span className={`inline-flex items-center gap-2 self-center rounded-full px-4 py-2 text-sm font-bold ${profile.verificationStatus === "verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
          <ShieldCheck className="size-4" aria-hidden />{verificationStatus}
        </span>
      </div>

      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle><><UserRound className="mr-2 inline size-5 text-primary" aria-hidden />Informations personnelles et professionnelles</></SectionTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ReadonlyField label="Nom complet" value={profile.name} />
          <ReadonlyField label="Téléphone" value={profile.phone} />
          <ReadonlyField label="Adresse e-mail" value={profile.email} />
          <ReadonlyField label="Spécialité principale" value={profile.specialty} />
          <ReadonlyField label="Spécialités secondaires" value={profile.secondarySpecialties.join(", ")} />
          <ReadonlyField label="Années d’expérience" value={String(profile.yearsOfExperience)} />
          <ReadonlyField label="N° d’inscription professionnelle" value={profile.registrationNumber} />
          <ReadonlyField label="Diplômes" value={profile.degrees.join("\n")} multiline />
          <div className="sm:col-span-2">
            <ReadonlyField label="Présentation professionnelle" value={profile.bio} multiline />
            <p className="mt-1 text-right text-xs text-muted">{profile.bio.length}/600 caractères</p>
          </div>
        </div>
      </section>

      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle><><BriefcaseMedical className="mr-2 inline size-5 text-primary" aria-hidden />Consultation et zone d’intervention</></SectionTitle>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ReadonlyField label={`Tarif de consultation (${profile.currency})`} value={profile.consultationFee.toLocaleString("fr-FR")} />
          <ReadonlyField label="Adresse professionnelle" value={profile.professionalAddress ?? ""} />
          <ReadonlyField label="Modes de consultation" value={profile.modes.map((mode) => mode === "home" ? "À domicile" : "Téléconsultation").join(", ")} />
        </div>
        <Link href="/medecin/zone-intervention" className="mt-4 inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-xl bg-blue-50 px-4 text-sm font-bold text-primary hover:bg-blue-100 sm:w-auto sm:min-w-72">
          <span className="inline-flex items-center gap-2"><MapPin className="size-4" aria-hidden />Gérer les zones couvertes</span>
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>

      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle><><FileCheck2 className="mr-2 inline size-5 text-primary" aria-hidden />Documents justificatifs</></SectionTitle>
        {profile.documents.length > 0 ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {profile.documents.map((document) => {
              const isApproved = document.status === "approved";
              return (
                <li key={document.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <FileCheck2 className={`size-5 shrink-0 ${isApproved ? "text-emerald-600" : "text-primary"}`} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-ink">{documentLabels[document.name] ?? document.name}</span>
                    <span className="block truncate text-xs text-muted">{document.filename}</span>
                  </span>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                    {documentStatusLabels[document.status] ?? document.status}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-muted">Aucun document justificatif n’est associé à votre dossier.</p>
        )}
        <p className="mt-2 text-xs text-muted">La vérification des documents est réalisée par l’équipe MedLink.</p>
      </section>

      <section className={`${doctorCard} p-4 sm:p-5`}>
        <SectionTitle><><BadgeCheck className="mr-2 inline size-5 text-primary" aria-hidden />Historique et réputation</></SectionTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-2xl font-extrabold text-night">{profile.rating === null ? "—" : `${profile.rating.toFixed(1).replace(".", ",")}/5`}</p>
            <p className="text-xs text-muted">Note moyenne · {profile.reviewsCount} avis</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-2xl font-extrabold text-night">{profile.completedConsultations}</p>
            <p className="text-xs text-muted">Consultations terminées</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-2xl font-extrabold text-night">{profile.yearsOfExperience} ans</p>
            <p className="text-xs text-muted">Expérience professionnelle</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4">
          <Link href="/medecin/historique" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Historique des consultations <ArrowRight className="size-4" aria-hidden /></Link>
          <Link href="/medecin/avis" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"><Star className="size-4" aria-hidden />Avis des patients</Link>
        </div>
      </section>
    </div>
  );
}
