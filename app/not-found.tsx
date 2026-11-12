import Link from "next/link";

export const metadata = {
  title: "Page introuvable | MediLink",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-stone-50 px-6 py-16 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-8xl font-semibold tracking-tight text-teal-700 dark:text-teal-400 sm:text-9xl">
          404
        </p>

        {/* Tracé d'électrocardiogramme : le rythme s'arrête sur une ligne plate */}
        <svg
          viewBox="0 0 600 120"
          className="my-8 h-24 w-full"
          fill="none"
          role="img"
          aria-label="Tracé d'électrocardiogramme qui devient une ligne plate"
        >
          <path
            d="M0 70 H70 l10 -10 l10 10 H130 l10 12 l14 -62 l16 104 l10 -54 H250 l12 -16 l14 16 H600"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className="ecg-line text-teal-700 dark:text-teal-400"
          />
        </svg>

        <h1 className="text-2xl font-semibold sm:text-3xl">
          Cette page n’existe pas
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-stone-600 dark:text-stone-400">
          Le lien est peut-être incorrect, ou la page a été déplacée. Revenez à
          l’accueil pour retrouver votre chemin.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-teal-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400"
          >
            Retourner à l’accueil
          </Link>
        </div>
      </div>

      <style>{`
        .ecg-line {
          stroke-dasharray: 1;
          stroke-dashoffset: 0;
          animation: ecg-draw 2.4s ease-out 1 both;
        }
        @keyframes ecg-draw {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ecg-line { animation: none; }
        }
      `}</style>
    </main>
  );
}