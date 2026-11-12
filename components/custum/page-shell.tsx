import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

const footerLinks = [
  { href: "/aide", label: "Aide" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Confidentialité" },
  { href: "/terms", label: "Conditions d’utilisation" },
];

type PageShellProps = {
  title: string;
  intro?: string;
  children: ReactNode;
};

export default function PageShell({ title, intro, children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <header className="border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-semibold text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-teal-400"
          >
            {SITE.name}
          </Link>
          <Link
            href="/"
            className="text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            Retour à l’accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 dark:text-stone-400">
            {intro}
          </p>
        )}
        <div className="mt-10">{children}</div>
      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800">
        <nav
          aria-label="Liens du pied de page"
          className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-6 py-6 text-sm text-stone-600 dark:text-stone-400"
        >
          {footerLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-teal-700 hover:underline dark:hover:text-teal-400"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}

/** Section de texte juridique : titre + paragraphes/listes. */
export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-stone-700 dark:text-stone-300 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}