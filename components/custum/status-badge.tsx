export type Status =
  | "Brouillon" | "Publiée" | "En attente de propositions" | "Propositions reçues" | "Rendez-vous confirmé" | "Clôturée" | "Annulée"
  | "En attente de confirmation" | "Confirmé" | "Terminé" | "Annulé";

const TONES = {
  slate: "bg-slate-100 text-slate-600",
  blue: "bg-primary/10 text-primary",
  teal: "bg-secondary/10 text-secondary",
  green: "bg-success/10 text-success",
  amber: "bg-warn/15 text-amber-700",
  red: "bg-danger/10 text-danger",
};

const STATUS_TONE: Record<Status, keyof typeof TONES> = {
  Brouillon: "slate", Publiée: "blue", "En attente de propositions": "blue", "Propositions reçues": "teal",
  "Rendez-vous confirmé": "green", Clôturée: "slate", Annulée: "red",
  "En attente de confirmation": "amber", Confirmé: "green", Terminé: "slate", Annulé: "red",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 self-start whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${TONES[STATUS_TONE[status]]}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden /> {status}
    </span>
  );
}