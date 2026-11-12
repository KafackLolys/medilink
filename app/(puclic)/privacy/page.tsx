import Link from "next/link";
import { SITE } from "@/lib/site";
import PageShell, { Section } from "@/components/custum/page-shell";

export const metadata = {
  title: "Politique de confidentialité | MediLink",
  description: "Comment MediLink collecte, utilise et protège vos données.",
};

export default function PrivacyPage() {
  return (
    <PageShell
      title="Politique de confidentialité"
      intro={`Dernière mise à jour : ${SITE.legalUpdatedAt}. Cette page explique quelles données ${SITE.name} collecte, pourquoi, et comment vous pouvez les contrôler.`}
    >
      <Section title="1. Qui est responsable de vos données ?">
        <p>
          {SITE.name} est exploité par [nom de la structure / de l’éditeur],
          [adresse]. Pour toute question sur vos données, écrivez à{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="text-teal-700 underline underline-offset-4 dark:text-teal-400"
          >
            {SITE.email}
          </a>
          .
        </p>
      </Section>

      <Section title="2. Données que nous collectons">
        <ul>
          <li>
            <strong>Compte :</strong> prénom, nom, téléphone, adresse email,
            rôle (patient ou médecin). Pour les médecins : spécialité et numéro
            d’enregistrement.
          </li>
          <li>
            <strong>Besoins médicaux :</strong> titre, spécialité, description,
            mode de consultation et pièces jointes que vous choisissez de
            publier.
          </li>
          <li>
            <strong>Notifications :</strong> un identifiant technique de votre
            navigateur, si vous activez les notifications.
          </li>
          <li>
            <strong>Données techniques :</strong> journaux de connexion et
            d’erreurs nécessaires au fonctionnement et à la sécurité du service.
          </li>
        </ul>
        <p>
          Votre mot de passe n’est jamais stocké en clair ni dans notre base de
          données applicative.
        </p>
      </Section>

      <Section title="3. Pourquoi nous les utilisons">
        <ul>
          <li>Créer et sécuriser votre compte.</li>
          <li>Mettre en relation patients et médecins selon la spécialité.</li>
          <li>Vous envoyer les emails et notifications liés à votre activité.</li>
          <li>Assurer la sécurité, prévenir les abus et améliorer le service.</li>
        </ul>
        <p>
          Les données de santé que vous publiez sont traitées sur la base de
          votre consentement, que vous pouvez retirer à tout moment.
        </p>
      </Section>

      <Section title="4. Qui peut voir vos informations">
        <p>
          Vos besoins médicaux et leurs pièces jointes ne sont accessibles
          qu’à vous et aux professionnels autorisés sur la plateforme. Nous ne
          vendons pas vos données et ne les utilisons pas à des fins
          publicitaires.
        </p>
        <p>
          Nous faisons appel à des prestataires techniques qui traitent des
          données pour notre compte : Google Firebase (authentification, base de
          données, notifications) et Supabase (stockage des fichiers). Ils sont
          tenus de protéger vos données. Vos données peuvent être traitées en
          dehors de votre pays de résidence.
        </p>
      </Section>

      <Section title="5. Sécurité">
        <p>
          Les fichiers médicaux sont stockés dans un espace privé et ne sont
          consultables qu’au moyen de liens temporaires. Les échanges avec
          l’application sont chiffrés et l’accès aux données est contrôlé par
          authentification. Aucune mesure n’offre une sécurité absolue : en
          cas d’incident touchant vos données, nous vous informerons dans les
          conditions prévues par la loi.
        </p>
      </Section>

      <Section title="6. Durée de conservation">
        <p>
          Nous conservons vos données tant que votre compte est actif, puis
          pendant [durée à définir] après sa suppression, sauf obligation légale
          de les conserver plus longtemps.
        </p>
      </Section>

      <Section title="7. Vos droits">
        <p>
          Vous pouvez demander l’accès à vos données, leur rectification, leur
          suppression, ou vous opposer à certains traitements. Pour exercer ces
          droits, écrivez-nous via la{" "}
          <Link
            href="/contact"
            className="text-teal-700 underline underline-offset-4 dark:text-teal-400"
          >
            page de contact
          </Link>
          . Vous pouvez aussi saisir l’autorité de protection des données
          compétente dans votre pays.
        </p>
      </Section>

      <Section title="8. Notifications et cookies">
        <p>
          Les notifications ne sont envoyées qu’après votre autorisation dans le
          navigateur, et vous pouvez les retirer à tout moment. Nous utilisons
          uniquement les stockages techniques nécessaires à la connexion et au
          fonctionnement du site.
        </p>
      </Section>

      <Section title="9. Modifications">
        <p>
          Nous pouvons mettre à jour cette politique. La date de dernière mise à
          jour figure en haut de la page et, en cas de changement important,
          nous vous en informerons.
        </p>
      </Section>
    </PageShell>
  );
}