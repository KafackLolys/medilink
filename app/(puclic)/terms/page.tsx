import Link from "next/link";
import { SITE } from "@/lib/site";
import PageShell, { Section } from "@/components/custum/page-shell";

export const metadata = {
  title: "Conditions d’utilisation | MediLink",
  description: "Les règles d’utilisation de la plateforme MediLink.",
};

export default function TermsPage() {
  return (
    <PageShell
      title="Conditions d’utilisation"
      intro={`Dernière mise à jour : ${SITE.legalUpdatedAt}. En créant un compte ou en utilisant ${SITE.name}, vous acceptez les conditions ci-dessous.`}
    >
      <div
        role="note"
        className="mb-10 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
      >
        {SITE.name} n’est pas un service d’urgence. En cas d’urgence médicale,
        contactez immédiatement les services d’urgence de votre pays.
      </div>

      <Section title="1. Objet du service">
        <p>
          {SITE.name} est une plateforme qui met en relation des patients et des
          professionnels de santé. Les patients y publient des besoins médicaux ;
          les médecins peuvent les consulter et y répondre selon leur
          spécialité.
        </p>
        <p>
          La plateforme est un outil de mise en relation. Elle ne remplace ni un
          diagnostic, ni une consultation, ni un traitement médical.
        </p>
      </Section>

      <Section title="2. Compte utilisateur">
        <ul>
          <li>
            Vous devez fournir des informations exactes et les tenir à jour.
          </li>
          <li>
            Vous devez vérifier votre adresse email pour finaliser votre
            inscription.
          </li>
          <li>
            Vous êtes responsable de la confidentialité de votre mot de passe et
            de l’activité réalisée depuis votre compte.
          </li>
          <li>
            Si vous pensez que votre compte a été utilisé par quelqu’un d’autre,
            prévenez-nous sans délai.
          </li>
        </ul>
      </Section>

      <Section title="3. Obligations des patients">
        <ul>
          <li>Décrire votre situation de bonne foi et le plus fidèlement possible.</li>
          <li>
            Ne joindre que des documents qui vous concernent ou dont vous avez
            le droit de disposer.
          </li>
          <li>
            Ne pas utiliser la plateforme pour une urgence vitale.
          </li>
        </ul>
      </Section>

      <Section title="4. Obligations des médecins">
        <ul>
          <li>
            Exercer légalement et fournir un numéro d’enregistrement valide.
            Nous pouvons demander des justificatifs.
          </li>
          <li>
            Respecter le secret médical et la déontologie applicable à votre
            profession.
          </li>
          <li>
            Rester seul responsable des avis et soins que vous prodiguez.
          </li>
        </ul>
      </Section>

      <Section title="5. Usages interdits">
        <ul>
          <li>Usurper l’identité d’une autre personne ou d’un professionnel.</li>
          <li>Publier des contenus illicites, trompeurs ou injurieux.</li>
          <li>
            Chercher à accéder aux données d’autres utilisateurs ou à perturber
            le fonctionnement du service.
          </li>
          <li>
            Collecter des données de la plateforme de manière automatisée sans
            autorisation.
          </li>
        </ul>
      </Section>

      <Section title="6. Données personnelles">
        <p>
          Le traitement de vos données est décrit dans notre{" "}
          <Link
            href="/privacy"
            className="text-teal-700 underline underline-offset-4 dark:text-teal-400"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </Section>

      <Section title="7. Responsabilité">
        <p>
          Nous mettons tout en œuvre pour assurer la disponibilité et la
          sécurité du service, sans garantir qu’il soit exempt d’interruptions
          ou d’erreurs. Dans les limites autorisées par la loi, {SITE.name}{" "}
          n’est pas responsable du contenu des échanges entre utilisateurs ni
          des conséquences médicales des décisions prises à partir des
          informations échangées.
        </p>
      </Section>

      <Section title="8. Suspension et suppression de compte">
        <p>
          Nous pouvons suspendre ou supprimer un compte qui ne respecte pas ces
          conditions. Vous pouvez demander la suppression de votre compte à tout
          moment via la{" "}
          <Link
            href="/contact"
            className="text-teal-700 underline underline-offset-4 dark:text-teal-400"
          >
            page de contact
          </Link>
          .
        </p>
      </Section>

      <Section title="9. Propriété intellectuelle">
        <p>
          La marque, le logo, le design et le code de {SITE.name} appartiennent
          à leur éditeur. Vous conservez vos droits sur les contenus que vous
          publiez et nous accordez le droit de les afficher aux seules fins du
          service.
        </p>
      </Section>

      <Section title="10. Modification des conditions">
        <p>
          Nous pouvons modifier ces conditions. En cas de changement important,
          nous vous en informerons ; continuer à utiliser le service après
          modification vaut acceptation.
        </p>
      </Section>

      <Section title="11. Droit applicable">
        <p>
          Ces conditions sont régies par le droit de [pays à compléter]. Tout
          litige relève des tribunaux compétents de [ville / juridiction à
          compléter].
        </p>
      </Section>
    </PageShell>
  );
}