import { BiSolidLogInCircle } from "react-icons/bi";
import RecommendedDoctors from "./recommended-doctors";
import { Activity, Baby, BadgeCheck, Brain, CalendarCheck, FileText, Flower2, HeartPulse, LayoutGrid, MapPin, MessageCircle, Plus, Search, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import Link from "next/link";

const SPECIALTIES = [
  { n: "Médecine générale", I: Stethoscope },
  { n: "Pédiatrie", I: Baby },
  { n: "Cardiologie", I: HeartPulse },
  { n: "Dermatologie", I: Sparkles },
  { n: "Gynécologie", I: Flower2 },
  { n: "Neurologie", I: Brain },
  { n: "Kinésithérapie", I: Activity },
  { n: "Autres", I: LayoutGrid },
];
const STEPS = [
  { t: "Décrivez votre besoin", d: "Expliquez simplement votre situation, à votre rythme.", I: FileText },
  { t: "Échangez avec un médecin", d: "Consultez les propositions reçues et posez vos questions.", I: MessageCircle },
  { t: "Confirmez le rendez-vous", d: "Choisissez une date adaptée, le médecin vient chez vous.", I: CalendarCheck },
];
export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-surface">
      <div aria-hidden className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="absolute -right-40 top-20 size-[30rem] rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8">
        {/* Header */}
        <header className="mt-5 flex items-center justify-between rounded-full border border-white bg-white/80 py-2.5 pl-5 pr-2.5 shadow-[0_8px_30px_-12px_rgba(30,41,59,.12)] backdrop-blur">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-white"><Plus className="size-5" strokeWidth={3} /></span>
              <span className="text-xl font-extrabold tracking-tight text-night">MedLink</span>
            </div>
            <nav className="hidden gap-7 text-[15px] font-medium text-muted md:flex">
              <a className="font-bold text-ink" href="/">Accueil</a>
              <a href="/login">Trouver un médecin</a>
              <a href="/login">Besoins médicaux</a>
              <a href="/comment-ça-marche">Comment ça marche</a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <a href="/login" className="hidden px-4 text-[15px] font-semibold text-ink sm:block">Connexion</a>
            <a href="/register" className="rounded-full bg-primary px-5 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,.6)]">Créer un compte</a>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-8 grid items-center gap-10 rounded-[2rem] border border-white bg-white/70 p-8 shadow-[0_20px_60px_-30px_rgba(30,41,59,.18)] backdrop-blur lg:grid-cols-[1.35fr_.65fr] lg:p-12">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-night sm:text-5xl lg:whitespace-nowrap">La santé, plus proche de vous</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Trouvez un médecin ou publiez votre besoin médical pour recevoir de l’aide, sans vous déplacer.
            </p>

            <div className="mt-8 flex flex-col gap-2 rounded-3xl bg-white p-2 shadow-[0_12px_40px_-16px_rgba(37,99,235,.3)] ring-1 ring-slate-100 sm:flex-row sm:items-center sm:rounded-full">
              <label className="flex flex-1 items-center gap-3 rounded-full px-5 py-2.5">
                <Stethoscope className="size-5 text-primary" aria-hidden />
                <span><span className="block whitespace-nowrap text-xs font-semibold text-muted">Spécialité médicale</span><span className="block whitespace-nowrap text-[15px] text-slate-400">Ex. Médecin généraliste</span></span>
              </label>
              <span className="hidden h-8 w-px bg-slate-200 sm:block" />
              <label className="flex flex-1 items-center gap-3 rounded-full px-5 py-2.5">
                <MapPin className="size-5 text-secondary" aria-hidden />
                <span><span className="block whitespace-nowrap text-xs font-semibold text-muted">Localisation</span><span className="block whitespace-nowrap text-[15px] text-slate-400">Ville ou quartier</span></span>
              </label>
              <Link href="/login" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-white">
                <BiSolidLogInCircle className="size-8" aria-hidden /> Connexion
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <a href="#" className="rounded-3xl bg-primary/[.07] p-5 transition hover:bg-primary/10">
                <span className="mb-3 grid size-10 place-items-center rounded-2xl bg-white text-primary shadow-sm"><Stethoscope className="size-5" /></span>
                <p className="text-lg font-bold text-primary">Trouver un médecin</p>
                <p className="mt-1 text-[15px] text-muted">Consultez les profils et demandez un rendez-vous.</p>
              </a>
              <a href="#" className="rounded-3xl bg-secondary/[.09] p-5 transition hover:bg-secondary/[.13]">
                <span className="mb-3 grid size-10 place-items-center rounded-2xl bg-white text-secondary shadow-sm"><FileText className="size-5" /></span>
                <p className="text-lg font-bold text-secondary">Publier un besoin médical</p>
                <p className="mt-1 text-[15px] text-muted">Décrivez votre situation pour recevoir des propositions.</p>
              </a>
            </div>
          </div>

          {/* Visuel */}
          <div className="relative hidden min-h-[460px] lg:block">
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/15 via-sky-100 to-secondary/20">
              <svg viewBox="0 0 400 460" className="absolute inset-0 size-full" aria-hidden>
                <circle cx="320" cy="90" r="46" fill="#fff" opacity=".7" />
                <path d="M60 330 L200 215 L340 330 V460 H60Z" fill="#fff" opacity=".85" />
                <path d="M40 335 L200 205 L360 335" fill="none" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity=".85" />
                <rect x="172" y="350" width="56" height="110" rx="28" fill="#0D9488" opacity=".25" />
                <rect x="186" y="262" width="28" height="8" rx="4" fill="#0D9488" />
                <rect x="196" y="252" width="8" height="28" rx="4" fill="#0D9488" />
              </svg>
            </div>
            <div className="absolute left-0 top-10 w-64 rounded-3xl bg-white p-4 shadow-[0_20px_50px_-20px_rgba(30,41,59,.35)]">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-secondary/15 font-bold text-secondary">SM</span>
                <div><p className="font-bold">Dr Sarah Mbarga</p><p className="flex items-center gap-1 text-xs font-semibold text-success"><BadgeCheck className="size-4" /> Médecin vérifié</p></div>
              </div>
              <p className="mt-3 rounded-xl bg-surface px-3 py-2 text-sm text-muted">Visite à domicile · demain, 10 h 30</p>
            </div>
            <div className="absolute -bottom-4 right-0 w-60 rounded-3xl bg-white p-4 shadow-[0_20px_50px_-20px_rgba(30,41,59,.35)]">
              <div className="mb-2 flex -space-x-2">{["bg-primary", "bg-secondary", "bg-warn"].map((c) => <span key={c} className={`size-8 rounded-full border-2 border-white ${c}`} />)}</div>
              <p className="text-sm font-bold">3 propositions reçues</p>
              <p className="text-xs text-muted">pour votre demande de cardiologie</p>
            </div>
          </div>
        </section>

        {/* Spécialités */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-night">Quelle spécialité recherchez-vous ?</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {SPECIALTIES.map(({ n, I }) => (
              <Link key={n} href="/patient/medecins" className="flex flex-col items-center gap-3 rounded-3xl bg-white p-4 text-center shadow-[0_8px_30px_-16px_rgba(30,41,59,.15)] transition hover:-translate-y-0.5">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary/[.08] text-primary"><I className="size-6" /></span>
                <span className="text-sm font-semibold leading-tight">{n}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-night">Comment ça marche ?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map(({ t, d, I }, k) => (
              <div key={t} className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_-16px_rgba(30,41,59,.15)]">
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-secondary/10 text-secondary"><I className="size-6" /></span>
                  <span className="text-3xl font-extrabold text-slate-200">{k + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{t}</h3>
                <p className="mt-1 text-[15px] text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <RecommendedDoctors />

        {/* Bandeau besoin médical */}
        <section className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-secondary/[.09] p-8 sm:flex-row sm:items-center lg:p-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-night">Vous ne savez pas qui contacter ?</h2>
            <p className="mt-2 text-base text-muted">Publiez votre besoin médical. Les médecins vérifiés de votre secteur vous envoient leurs propositions, vous choisissez.</p>
          </div>
          <Link href="/patient/besoins/nouveau" className="rounded-full bg-secondary px-7 py-4 font-semibold text-white">
            Publier un besoin médical
          </Link>
        </section>

        <footer className="mt-12 pb-10 text-sm text-muted">
          <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-secondary" /> MedLink ne remplace pas une consultation. En cas d’urgence médicale, contactez immédiatement les services d’urgence.</p>
          <p className="mt-3">MedLink · Une mise en relation simple et humaine.</p>
        </footer>
      </div>
    </div>
  );
}
