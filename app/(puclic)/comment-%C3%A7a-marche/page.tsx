import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  FileHeart,
  FilePlus2,
  HeartHandshake,
  HeartPulse,
  House,
  LockKeyhole,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stethoscope,
  UserRoundCheck,
  Video,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Comment ça marche ? | MediLink",
  description:
    "Découvrez comment MediLink connecte les patients à des médecins vérifiés : recherche, demandes médicales, propositions, messages et rendez-vous.",
};

type Step = {
  number: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  detail: string;
};

const patientSteps: Step[] = [
  {
    number: "01",
    title: "Créez votre compte patient",
    description: "Accédez à un espace personnel pour organiser vos demandes et retrouver vos échanges.",
    Icon: UserRoundCheck,
    detail: "Vos informations de profil et les documents médicaux se gèrent depuis votre espace sécurisé.",
  },
  {
    number: "02",
    title: "Cherchez un médecin ou décrivez votre besoin",
    description: "Vous pouvez consulter l’annuaire ou publier une demande détaillant votre situation, vos symptômes et votre localisation.",
    Icon: Search,
    detail: "Précisez le mode de consultation souhaité et ajoutez des documents utiles, si nécessaire.",
  },
  {
    number: "03",
    title: "Recevez des propositions de médecins vérifiés",
    description: "Les médecins intéressés répondent à votre demande avec un message, un créneau et leurs honoraires.",
    Icon: MessageSquareText,
    detail: "Comparez les propositions selon votre besoin : aucune acceptation automatique n’est effectuée à votre place.",
  },
  {
    number: "04",
    title: "Posez vos questions avant de choisir",
    description: "Discutez directement avec le médecin ayant proposé ses services grâce à la messagerie privée.",
    Icon: MessageCircle,
    detail: "Clarifiez les modalités pratiques de la consultation avant de confirmer votre choix.",
  },
  {
    number: "05",
    title: "Acceptez une proposition et confirmez",
    description: "Choisissez le médecin qui vous convient. Une confirmation vous informe que les autres propositions seront refusées.",
    Icon: CalendarCheck,
    detail: "Le rendez-vous dépend de la disponibilité du créneau et des règles de réservation applicables.",
  },
  {
    number: "06",
    title: "Retrouvez votre suivi au même endroit",
    description: "Consultez vos rendez-vous, vos demandes, vos documents et les informations de votre profil.",
    Icon: FileHeart,
    detail: "Après une consultation éligible, vous pouvez également laisser un avis sur votre expérience.",
  },
];

const doctorSteps: Step[] = [
  {
    number: "01",
    title: "Inscrivez-vous comme médecin",
    description: "Renseignez votre profil professionnel, votre spécialité et les informations nécessaires à votre activité.",
    Icon: Stethoscope,
    detail: "Votre espace professionnel centralise vos informations et les justificatifs demandés.",
  },
  {
    number: "02",
    title: "Faites vérifier votre profil",
    description: "Transmettez vos documents professionnels pour permettre leur examen par l’administration.",
    Icon: BadgeCheck,
    detail: "L’accès aux demandes réservées aux médecins vérifiés dépend de la validation de votre dossier.",
  },
  {
    number: "03",
    title: "Configurez votre disponibilité",
    description: "Activez la consultation à domicile, la téléconsultation ou les deux, puis définissez vos horaires et vos dates indisponibles.",
    Icon: CalendarClock,
    detail: "Vous pouvez également renseigner votre zone d’intervention et la durée habituelle des rendez-vous.",
  },
  {
    number: "04",
    title: "Répondez aux besoins des patients",
    description: "Parcourez les demandes, proposez un créneau, précisez vos honoraires et expliquez comment vous pouvez intervenir.",
    Icon: ClipboardList,
    detail: "Chaque proposition est liée à une demande précise et peut être suivie depuis votre espace médecin.",
  },
  {
    number: "05",
    title: "Échangez et suivez vos consultations",
    description: "Répondez aux messages des patients et consultez les rendez-vous issus des propositions acceptées.",
    Icon: HeartHandshake,
    detail: "Les rendez-vous sont contrôlés pour limiter les chevauchements et respecter vos indisponibilités.",
  },
];

const benefits: { title: string; description: string; Icon: LucideIcon }[] = [
  { title: "Médecins vérifiés", description: "Les profils professionnels passent par un processus de vérification avant d’accéder aux demandes réservées.", Icon: ShieldCheck },
  { title: "Un choix qui vous appartient", description: "Comparez et discutez avant d’accepter une proposition : vous gardez la maîtrise de votre décision.", Icon: CheckCircle2 },
  { title: "Des échanges centralisés", description: "Messages, propositions et informations utiles restent associés à votre parcours sur MediLink.", Icon: MessageCircle },
  { title: "Des horaires encadrés", description: "Les jours disponibles, les dates bloquées et les conflits de créneaux sont pris en compte lors de la réservation.", Icon: Clock3 },
];

const faqs = [
  {
    question: "Dois-je connaître le nom d’un médecin pour utiliser MediLink ?",
    answer: "Non. Vous pouvez chercher un médecin dans l’annuaire ou publier votre besoin médical afin de recevoir des propositions de médecins intéressés.",
  },
  {
    question: "Puis-je discuter avec un médecin avant d’accepter ?",
    answer: "Oui. Lorsqu’un médecin vous envoie une proposition active, vous pouvez utiliser la messagerie privée pour lui poser vos questions.",
  },
  {
    question: "Que se passe-t-il si j’accepte une proposition ?",
    answer: "MediLink vous demande de confirmer votre choix. Si l’acceptation aboutit, un rendez-vous est associé à votre demande et les autres propositions en attente sont automatiquement refusées.",
  },
  {
    question: "Puis-je demander une visite à domicile ?",
    answer: "Oui, si le médecin propose ce mode de consultation et que les conditions pratiques de réservation sont remplies, notamment l’adresse et le créneau disponible.",
  },
  {
    question: "La téléconsultation signifie-t-elle qu’un appel vidéo est intégré ?",
    answer: "MediLink prend en charge le choix et l’organisation de consultations à distance. La présence d’un outil de visioconférence intégré n’est pas garantie par cette page : vérifiez avec votre médecin les modalités du rendez-vous.",
  },
  {
    question: "MediLink peut-il gérer les urgences médicales ?",
    answer: "Non. MediLink est un service de mise en relation et de gestion des consultations. En cas d’urgence, contactez immédiatement les services d’urgence de votre pays.",
  },
];

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-night sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-muted">{description}</p>
    </div>
  );
}

function StepCard({ step }: { step: Step }) {
  const Icon = step.Icon;
  return (
    <li className="relative flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_12px_35px_-25px_rgba(15,23,42,0.35)] transition-shadow hover:shadow-[0_14px_40px_-24px_rgba(15,23,42,0.25)] sm:p-7">
      <div className="flex items-center justify-between">
        <span className="grid size-13 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-6" aria-hidden="true" /></span>
        <span className="text-3xl font-black tracking-tight text-slate-200" aria-label={`Étape ${Number(step.number)}`}>{step.number}</span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
      <p className="mt-2 leading-6 text-muted">{step.description}</p>
      <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-500">{step.detail}</p>
    </li>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-surface text-ink">
      <div className="pointer-events-none absolute -left-28 -top-28 size-[30rem] rounded-full bg-primary/[0.07] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 top-60 size-[30rem] rounded-full bg-secondary/[0.08] blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1240px] px-5 pb-20 pt-7 sm:px-8">
        <nav aria-label="Navigation de la page" className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-night">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-white"><HeartPulse className="size-6" aria-hidden="true" /></span>
            <span className="text-xl">MediLink</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <Link href="/patient/medecins" className="rounded-full px-4 py-2.5 text-ink hover:bg-white">Trouver un médecin</Link>
            <Link href="/login" className="rounded-full px-4 py-2.5 text-ink hover:bg-white">Connexion</Link>
            <Link href="/register" className="rounded-full bg-primary px-5 py-2.5 text-white hover:bg-blue-700">Créer un compte</Link>
          </div>
        </nav>

        <header className="mt-12 overflow-hidden rounded-[2rem] border border-white bg-white/85 px-6 py-12 shadow-[0_22px_70px_-45px_rgba(30,41,59,0.3)] sm:px-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-secondary">
                <Sparkles className="size-4" aria-hidden="true" /> Votre santé, plus simple à organiser
              </span>
              <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.12] tracking-tight text-night sm:text-5xl lg:text-6xl">
                Comment fonctionne <span className="text-primary">MediLink</span> ?
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                Un seul endroit pour trouver un médecin vérifié, exposer votre besoin médical, recevoir des propositions, discuter et organiser votre consultation à domicile ou à distance.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/patient/besoins/nouveau" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-white shadow-[0_10px_25px_-12px_rgba(37,99,235,0.6)] hover:bg-blue-700">Décrire mon besoin <ArrowRight className="size-4" aria-hidden="true" /></Link>
                <Link href="/patient/medecins" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 font-bold text-ink hover:bg-slate-50">Explorer les médecins <Search className="size-4" aria-hidden="true" /></Link>
              </div>
            </div>
            <div className="rounded-[1.8rem] bg-gradient-to-br from-primary/[0.08] via-white to-secondary/[0.1] p-5 sm:p-7" aria-label="Résumé visuel du parcours MediLink">
              <div className="space-y-3">
                {[
                  { label: "1. Décrivez votre besoin", Icon: FilePlus2 },
                  { label: "2. Échangez avec un médecin", Icon: MessageCircle },
                  { label: "3. Organisez votre rendez-vous", Icon: CalendarCheck },
                ].map(({ label, Icon }) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-sm">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" aria-hidden="true" /></span>
                    <span className="font-bold text-ink">{label}</span>
                    <Check className="ml-auto size-4 text-secondary" aria-hidden="true" />
                  </div>
                ))}
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-500"><ShieldCheck className="size-5 text-secondary" aria-hidden="true" /> Des médecins professionnels soumis à vérification</p>
            </div>
          </div>
        </header>

        <section aria-label="Deux façons de trouver une consultation" className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Search className="size-6" aria-hidden="true" /></span><h2 className="text-xl font-extrabold">Vous choisissez un médecin</h2></div>
            <p className="mt-4 leading-7 text-muted">Recherchez un professionnel selon sa spécialité, son secteur et son profil, puis consultez ses modes et horaires pour demander un rendez-vous.</p>
            <Link href="/patient/medecins" className="mt-5 inline-flex items-center gap-2 font-bold text-primary hover:underline">Consulter l’annuaire <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-secondary/10 text-secondary"><ClipboardList className="size-6" aria-hidden="true" /></span><h2 className="text-xl font-extrabold">Les médecins répondent à votre besoin</h2></div>
            <p className="mt-4 leading-7 text-muted">Publiez une demande médicale, consultez les propositions reçues, échangez avec les médecins intéressés, puis choisissez celle qui vous convient.</p>
            <Link href="/patient/besoins/nouveau" className="mt-5 inline-flex items-center gap-2 font-bold text-primary hover:underline">Publier une demande <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <section id="patients" className="scroll-mt-10 pt-24">
          <SectionHeading eyebrow="Pour les patients" title="Votre parcours, étape par étape" description="Du premier besoin jusqu’au suivi de votre rendez-vous, vous décidez du professionnel avec lequel vous souhaitez échanger." />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{patientSteps.map((step) => <StepCard key={step.number} step={step} />)}</ol>
        </section>

        <section id="consultations" className="scroll-mt-10 pt-24">
          <SectionHeading eyebrow="Les modes de consultation" title="À domicile ou à distance : choisissez la formule adaptée" description="Chaque médecin définit les modes qu’il accepte. Les modalités de votre consultation sont précisées dans le profil et la proposition du professionnel." />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-slate-100 bg-white p-7 sm:p-9">
              <span className="grid size-14 place-items-center rounded-2xl bg-secondary/10 text-secondary"><House className="size-7" aria-hidden="true" /></span>
              <h3 className="mt-6 text-2xl font-extrabold text-night">Consultation à domicile</h3>
              <p className="mt-3 leading-7 text-muted">Le professionnel se déplace à l’adresse convenue pour la consultation, sous réserve de sa zone d’intervention, de ses disponibilités et des informations d’adresse nécessaires.</p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary"><MapPin className="size-4" aria-hidden="true" /> Une prise en charge proche de vous</p>
            </article>
            <article className="rounded-3xl border border-slate-100 bg-white p-7 sm:p-9">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Video className="size-7" aria-hidden="true" /></span>
              <h3 className="mt-6 text-2xl font-extrabold text-night">Téléconsultation</h3>
              <p className="mt-3 leading-7 text-muted">Vous pouvez organiser une consultation à distance avec un médecin proposant ce mode. Les modalités techniques de l’échange sont à convenir avec lui.</p>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"><Smartphone className="size-4" aria-hidden="true" /> Organisez votre consultation à distance</p>
            </article>
          </div>
        </section>

        <section id="medecins" className="scroll-mt-10 pt-24">
          <SectionHeading eyebrow="Pour les médecins" title="Une organisation professionnelle, du profil au rendez-vous" description="MediLink vous donne un espace pour présenter votre activité, paramétrer votre disponibilité et répondre aux besoins des patients." />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{doctorSteps.map((step) => <StepCard key={step.number} step={step} />)}</ol>
          <div className="mt-7 rounded-3xl border border-primary/10 bg-primary/[0.06] p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div><h3 className="text-xl font-extrabold text-night">Vous êtes professionnel de santé ?</h3><p className="mt-2 leading-6 text-muted">Créez votre compte et préparez votre profil professionnel pour commencer votre parcours de vérification.</p></div>
              <Link href="/register" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-white hover:bg-blue-700">Rejoindre MediLink <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section id="avantages" className="pt-24">
          <SectionHeading eyebrow="Pourquoi MediLink" title="Les informations essentielles, réunies au bon endroit" description="La plateforme privilégie une mise en relation claire et structurée, sans choisir un médecin à votre place." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ title, description, Icon }) => (
              <article key={title} className="rounded-3xl border border-slate-100 bg-white p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-secondary/10 text-secondary"><Icon className="size-6" aria-hidden="true" /></span>
                <h3 className="mt-5 font-extrabold text-night">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="pt-24">
          <SectionHeading eyebrow="Questions fréquentes" title="Tout savoir avant de commencer" description="Quelques réponses aux questions les plus courantes sur la recherche de médecins et le fonctionnement des propositions." />
          <div className="mt-8 max-w-4xl space-y-3">
            {faqs.map(({ question, answer }) => (
              <details key={question} className="group rounded-2xl border border-slate-100 bg-white px-5 py-5 open:shadow-sm sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink [&::-webkit-details-marker]:hidden">
                  <span>{question}</span><ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-4 border-t border-slate-100 pt-4 leading-7 text-muted">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-label="Commencer avec MediLink" className="mt-24 overflow-hidden rounded-[2rem] bg-night px-6 py-12 text-white sm:px-10 sm:py-14">
          <div className="flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300">Prêt à commencer ?</p><h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Votre prochain rendez-vous commence par un premier pas.</h2><p className="mt-4 leading-7 text-slate-300">Choisissez un médecin ou expliquez votre besoin : MediLink vous accompagne dans l’organisation de votre parcours.</p></div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto"><Link href="/patient/besoins/nouveau" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-bold text-night hover:bg-slate-100">Publier mon besoin <ArrowRight className="size-4" aria-hidden="true" /></Link><Link href="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 font-bold text-white hover:bg-white/10">Créer un compte</Link></div>
          </div>
        </section>

        <footer className="mt-10 flex flex-col gap-4 border-t border-slate-200 py-7 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="flex max-w-3xl items-start gap-2"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" /> MediLink facilite la mise en relation, mais ne remplace pas un diagnostic médical. En cas d’urgence, contactez immédiatement les services d’urgence.</p>
          <Link href="/" className="font-bold text-primary hover:underline">Retour à l’accueil</Link>
        </footer>
      </div>
    </main>
  );
}
