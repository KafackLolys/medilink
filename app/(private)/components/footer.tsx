import { Logo } from "@/components/custum/auth-shell";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/60">
      <div className="mx-auto max-w-[1160px] px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 text-[15px] text-muted">Une mise en relation simple et humaine.</p>
          </div>
          <nav aria-label="Liens utiles" className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-medium">
            <Link href="/aide" className="hover:text-primary">Aide</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
            <Link href="/privacy" className="hover:text-primary">Confidentialité</Link>
            <Link href="/terms" className="hover:text-primary">Conditions d’utilisation</Link>
          </nav>
        </div>
        <p className="mt-8 flex items-start gap-2 rounded-2xl bg-secondary/[.08] px-4 py-3 text-sm text-ink">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
          MedLink ne remplace pas une consultation. En cas d’urgence médicale, contactez immédiatement les services d’urgence sans attendre la réponse d’un médecin.
        </p>
        <p className="mt-6 text-sm text-muted">© 2026 MedLink</p>
      </div>
    </footer>
  );
}
