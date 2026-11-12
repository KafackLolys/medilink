import PageShell from "@/components/custum/page-shell";
import Link from "next/link";

export const metadata = {
  title: "Aide | MediLink",
  description: "Réponses aux questions fréquentes sur MediLink.",
};

const faq = [
  {
    group: "Compte",
    items: [
      {
        q: "Comment créer un compte ?",
        a: "Choisissez votre profil (patient ou médecin), renseignez vos informations puis validez le formulaire d’inscription. Les médecins indiquent aussi leur spécialité et leur numéro d’enregistrement.",
      },
      {
        q: "Je n’ai pas reçu l’email de vérification.",
        a: "Vérifiez votre dossier de courriers indésirables. Si rien n’arrive au bout de quelques minutes, contactez-nous en précisant l’adresse email utilisée.",
      },
      {
        q: "J’ai oublié mon mot de passe.",
        a: "Sur la page de connexion, utilisez « Mot de passe oublié » et saisissez votre email. Vous recevrez un lien pour en choisir un nouveau.",
      },
    ],
  },
  {
    group: "Besoins médicaux",
    items: [
      {
        q: "Comment publier un besoin médical ?",
        a: "Depuis votre espace patient, créez un nouveau besoin : donnez-lui un titre, choisissez la spécialité, décrivez votre situation et indiquez le mode de consultation souhaité.",
      },
      {
        q: "Quels fichiers puis-je joindre ?",
        a: "Vous pouvez joindre jusqu’à 5 fichiers par besoin, de 10 Mo maximum chacun. Ils sont stockés de façon privée et ne sont visibles que par les personnes autorisées.",
      },
      {
        q: "Puis-je modifier ou supprimer un besoin ?",
        a: "Vous pouvez modifier un besoin tant qu’il est ouvert, le clore quand il n’est plus d’actualité, et supprimer les brouillons.",
      },
    ],
  },
  {
    group: "Notifications",
    items: [
      {
        q: "Comment activer les notifications ?",
        a: "Cliquez sur « Activer les notifications » et autorisez-les dans votre navigateur. Vous pouvez les désactiver à tout moment dans les réglages du navigateur.",
      },
    ],
  },
];

export default function AidePage() {
  return (
    <PageShell
      title="Aide"
      intro="Les réponses aux questions les plus fréquentes. Vous ne trouvez pas ce que vous cherchez ? Écrivez-nous."
    >
      <div
        role="note"
        className="mb-10 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
      >
        MediLink n’est pas un service d’urgence. En cas d’urgence médicale,
        contactez immédiatement les services d’urgence de votre pays.
      </div>

      <div className="space-y-10">
        {faq.map((g) => (
          <section key={g.group}>
            <h2 className="mb-3 text-xl font-semibold">{g.group}</h2>
            <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 dark:divide-stone-800 dark:border-stone-800">
              {g.items.map((item) => (
                <details key={item.q} className="group px-4 py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="text-teal-700 transition-transform group-open:rotate-45 dark:text-teal-400"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-400">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 text-stone-700 dark:text-stone-300">
        Besoin d’un coup de main ?{" "}
        <Link
          href="/contact"
          className="font-medium text-teal-700 underline underline-offset-4 dark:text-teal-400"
        >
          Contactez-nous
        </Link>
        .
      </p>
    </PageShell>
  );
}