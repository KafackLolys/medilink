import PageShell from "@/components/custum/page-shell";
import ContactForm from "../components/contact-form";
import { SITE } from "@/lib/site";


export const metadata = {
  title: "Contact | MediLink",
  description: "Contactez l’équipe MediLink.",
};

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      intro="Une question, un problème, une demande concernant vos données ? Écrivez-nous, nous vous répondons par email."
    >
      <div className="grid gap-12 md:grid-cols-[1fr_16rem]">
        <ContactForm />

        <aside className="space-y-6 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
          <div>
            <h2 className="font-semibold">Email</h2>
            <a
              href={`mailto:${SITE.email}`}
              className="text-teal-700 underline underline-offset-4 dark:text-teal-400"
            >
              {SITE.email}
            </a>
          </div>
          <div>
            <h2 className="font-semibold">Urgence médicale</h2>
            <p>
              MediLink n’est pas un service d’urgence. Contactez directement
              les services d’urgence de votre pays.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}