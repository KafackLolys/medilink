"use client";
import { ArrowLeft, BadgeCheck, Check, Lock, Mail, MailCheck, Phone, Stethoscope, User } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthShell, GoogleButton, OrDivider } from "@/components/custum/auth-shell";
import { PasswordField, SelectField, TextField } from "@/components/custum/field";
import { Button } from "@/components/custum/button";

type Role = "patient" | "doctor";
const ROLES = [
  { id: "patient" as Role, title: "Je suis patient", desc: "Trouver un médecin ou publier un besoin médical.", Icon: User },
  { id: "doctor" as Role, title: "Je suis médecin", desc: "Consulter les besoins des patients et proposer mes services.", Icon: Stethoscope },
];
const SPECIALTIES = ["Médecine générale", "Pédiatrie", "Cardiologie", "Dermatologie", "Gynécologie", "Neurologie", "Kinésithérapie", "Autre"];
const STRENGTH = [
  { label: "Très faible", color: "bg-danger" },
  { label: "Faible", color: "bg-danger" },
  { label: "Moyen", color: "bg-warn" },
  { label: "Bon", color: "bg-success" },
  { label: "Excellent", color: "bg-success" },
];

function strength(p: string) {
  return [p.length >= 8, /[a-z]/.test(p) && /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
}

export default function RegisterPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", specialty: "", licence: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));
  const score = strength(f.password);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const n: Record<string, string> = {};
    if (!f.firstName.trim()) n.firstName = "Entrez votre prénom.";
    if (!f.lastName.trim()) n.lastName = "Entrez votre nom.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) n.email = "Entrez une adresse e-mail valide.";
    if (f.phone.replace(/\D/g, "").length < 8) n.phone = "Entrez un numéro valide avec l’indicatif du pays.";
    if (score < 3) n.password = "Utilisez 8 caractères minimum, avec majuscule, chiffre ou symbole.";
    if (confirmPassword !== f.password) n.confirmPassword = "Les mots de passe ne correspondent pas.";
    if (role === "doctor" && !f.specialty) n.specialty = "Choisissez votre spécialité.";
    if (role === "doctor" && !f.licence.trim()) n.licence = "Entrez votre numéro d’inscription professionnelle.";
    if (!terms) n.terms = "Acceptez les conditions pour continuer.";
    setErrors(n);
    if (Object.keys(n).length) return;

    setLoading(true);
    // TODO : POST `${process.env.NEXT_PUBLIC_API_URL}/auth/register` (NestJS) avec { role, ...f }
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setDone(true);
  }

  if (done)
    return (
      <AuthShell compact>
        <div className="text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-success/10 text-success"><MailCheck className="size-8" aria-hidden /></span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-night">Vérifiez votre e-mail</h1>
          <p className="mt-3 text-base text-muted">
            Nous avons envoyé un lien de confirmation à <strong className="text-ink">{f.email}</strong>.
            {role === "doctor" && " Vous pourrez ensuite envoyer vos justificatifs pour faire vérifier votre compte professionnel."}
          </p>
          <Link href="/login" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50">
            Retour à la connexion
          </Link>
        </div>
      </AuthShell>
    );

  return (
    <AuthShell compact={step === 2}>
      <p className="text-sm font-semibold text-muted md:text-[10px]">Étape {step} sur 2</p>
      <div className="mt-2 grid grid-cols-2 gap-2" aria-hidden>
        <span className="h-1.5 rounded-full bg-primary md:h-1" />
        <span className={`h-1.5 rounded-full md:h-1 ${step === 2 ? "bg-primary" : "bg-slate-200"}`} />
      </div>

      {step === 1 ? (
        <>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Créer votre compte</h1>
          <p className="mt-2 text-base text-muted">Qui êtes-vous ? Votre espace s’adapte à votre profil.</p>

          <div role="radiogroup" aria-label="Type de compte" className="mt-8 space-y-3">
            {ROLES.map(({ id, title, desc, Icon }) => {
              const on = role === id;
              return (
                <button key={id} type="button" role="radio" aria-checked={on} onClick={() => setRole(id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 ${on ? "border-primary bg-primary/5" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                  <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${on ? "bg-primary text-white" : "bg-slate-100 text-muted"}`}>
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold text-ink">{title}</span>
                    <span className="block text-sm text-muted">{desc}</span>
                  </span>
                  <span className={`grid size-6 place-items-center rounded-full border-2 ${on ? "border-primary bg-primary text-white" : "border-slate-300"}`}>
                    {on && <Check className="size-4" aria-hidden />}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6"><Button type="button" disabled={!role} onClick={() => setStep(2)}>Continuer</Button></div>
          <OrDivider>ou</OrDivider>
          <GoogleButton label="S’inscrire avec Google" />
        </>
      ) : (
        <>
          <button type="button" onClick={() => setStep(1)} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline md:mt-3 md:text-xs">
            <ArrowLeft className="size-4" aria-hidden /> Changer de profil
          </button>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-night md:mt-1 md:text-xl">
            {role === "doctor" ? "Votre compte médecin" : "Votre compte patient"}
          </h1>

          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5 md:mt-3 md:space-y-2.5">
            <div className="grid gap-5 sm:grid-cols-2 md:gap-3">
              <TextField compact label="Prénom" autoComplete="given-name" value={f.firstName} onChange={set("firstName")} error={errors.firstName} />
              <TextField compact label="Nom" autoComplete="family-name" value={f.lastName} onChange={set("lastName")} error={errors.lastName} />
            </div>
            <TextField compact label="Adresse e-mail" type="email" autoComplete="email" icon={<Mail />} value={f.email} onChange={set("email")} error={errors.email} />
            <TextField compact label="Téléphone" type="tel" autoComplete="tel" icon={<Phone />} hint="Avec l’indicatif du pays." value={f.phone} onChange={set("phone")} error={errors.phone} />

            <div>
              <PasswordField compact label="Mot de passe" autoComplete="new-password" icon={<Lock />} value={f.password} onChange={set("password")} error={errors.password} />
              {f.password && (
                <div className="mt-2" aria-live="polite">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className={`h-1.5 rounded-full ${i <= score ? STRENGTH[score].color : "bg-slate-200"}`} />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted">Sécurité : {STRENGTH[score].label}</p>
                </div>
              )}
            </div>
            <PasswordField
              compact
              label="Confirmer le mot de passe"
              autoComplete="new-password"
              icon={<Lock />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />

            {role === "doctor" && (
              <>
                <SelectField compact label="Spécialité" options={SPECIALTIES} value={f.specialty} onChange={set("specialty")} error={errors.specialty} />
                <TextField compact label="Numéro d’inscription professionnelle" icon={<BadgeCheck />} value={f.licence} onChange={set("licence")} error={errors.licence} />
                <p className="rounded-xl bg-primary/5 px-4 py-3 text-sm text-ink md:px-3 md:py-2 md:text-[10px] md:leading-4">
                  Votre compte sera vérifié avant l’accès aux besoins des patients. Vous enverrez vos justificatifs après la confirmation de votre e-mail.
                </p>
              </>
            )}

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm md:gap-2 md:text-[10px]">
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 size-5 shrink-0 rounded border-slate-300 accent-primary md:size-3" />
                <span>J’accepte les <Link href="/terms" className="font-semibold text-primary hover:underline">conditions d’utilisation</Link> et la <Link href="/privacy" className="font-semibold text-primary hover:underline">politique de confidentialité</Link>.</span>
              </label>
              {errors.terms && <p className="mt-1.5 text-sm text-danger">{errors.terms}</p>}
            </div>

            <Button compact type="submit" loading={loading}>Créer mon compte</Button>
          </form>
        </>
      )}

      <p className="mt-8 text-center text-base text-muted md:mt-2 md:text-xs">
        Déjà inscrit ? <Link href="/login" className="font-semibold text-primary hover:underline">Se connecter</Link>
      </p>
    </AuthShell>
  );
}
