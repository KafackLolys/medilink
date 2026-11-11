import { Status } from "@/components/custum/status-badge";

export type Doctor = { initials: string; name: string; specialty: string; color: string };
const D = {
  amina: { initials: "AN", name: "Dr. Amina Nguema", specialty: "Médecin généraliste", color: "bg-secondary/15 text-secondary" },
  paul: { initials: "PN", name: "Dr. Paul Ndongo", specialty: "Cardiologue", color: "bg-primary/10 text-primary" },
  aicha: { initials: "AK", name: "Dr. Aïcha Kamga", specialty: "Pédiatre", color: "bg-warn/20 text-amber-700" },
  sarah: { initials: "SM", name: "Dr. Sarah Mbarga", specialty: "Médecin généraliste", color: "bg-secondary/15 text-secondary" },
} satisfies Record<string, Doctor>;

export type Appointment = {
  id: string; doctor: Doctor; day: string; month: string; dateLabel: string; time: string;
  mode: "domicile" | "teleconsultation"; status: Extract<Status, "En attente de confirmation" | "Confirmé" | "Terminé" | "Annulé">;
};
export const APPOINTMENTS: Appointment[] = [
  { id: "a1", doctor: D.amina, day: "19", month: "nov.", dateLabel: "Jeudi 19 novembre 2026", time: "10:30", mode: "domicile", status: "En attente de confirmation" },
  { id: "a2", doctor: D.paul, day: "24", month: "nov.", dateLabel: "Mardi 24 novembre 2026", time: "15:00", mode: "teleconsultation", status: "Confirmé" },
  { id: "a3", doctor: D.aicha, day: "28", month: "oct.", dateLabel: "Mercredi 28 octobre 2026", time: "09:00", mode: "domicile", status: "Terminé" },
  { id: "a4", doctor: D.sarah, day: "5", month: "nov.", dateLabel: "Jeudi 5 novembre 2026", time: "16:30", mode: "domicile", status: "Annulé" },
];

export type MedicalRequest = {
  id: string; title: string; specialty: string; publishedOn: string; interested: number; mode: string; status: Status;
};
export const REQUESTS: MedicalRequest[] = [
  { id: "r1", title: "Maux de tête fréquents depuis une semaine", specialty: "Neurologie", publishedOn: "Publiée le 8 nov. 2026", interested: 3, mode: "À domicile", status: "Propositions reçues" },
  { id: "r2", title: "Fièvre persistante chez mon enfant", specialty: "Pédiatrie", publishedOn: "Publiée le 10 nov. 2026", interested: 0, mode: "À domicile", status: "En attente de propositions" },
  { id: "r3", title: "Suivi de ma tension artérielle", specialty: "Cardiologie", publishedOn: "Publiée le 2 nov. 2026", interested: 2, mode: "Téléconsultation", status: "Rendez-vous confirmé" },
  { id: "r4", title: "Consultation pédiatrique de routine", specialty: "Pédiatrie", publishedOn: "Publiée le 20 oct. 2026", interested: 4, mode: "À domicile", status: "Clôturée" },
  { id: "r5", title: "Douleurs au bas du dos", specialty: "Kinésithérapie", publishedOn: "Non publiée", interested: 0, mode: "À domicile", status: "Brouillon" },
];
export const ACTIVE: Status[] = ["Publiée", "En attente de propositions", "Propositions reçues"];

export const NOTIFICATIONS = [
  { id: "n1", text: "Dr. Paul Ndongo a proposé ses services pour votre demande de maux de tête.", when: "Il y a 2 h" },
  { id: "n2", text: "Votre rendez-vous du 19 novembre attend la confirmation du médecin.", when: "Hier" },
  { id: "n3", text: "Complétez vos informations médicales (facultatif) pour aider les médecins.", when: "Il y a 2 jours" },
];