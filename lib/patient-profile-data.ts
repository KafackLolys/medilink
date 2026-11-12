export const PATIENT_PROFILE = {
  name: "Mme Estelle Ngono",
  initials: "EN",
  age: 72,
  gender: "Femme",
  bloodType: "O+",
  location: "Yaoundé, Biyem-Assi",
  phone: "+237 6 97 52 52 41",
  email: "estelle.ngono@gmail.com",
  verified: true,
} as const;

export const PATIENT_HEALTH = [
  { id: "hypertension", name: "Hypertension", status: "Sous contrôle", icon: "heart", tone: "red" },
  { id: "diabetes", name: "Diabète (Type 2)", status: "Suivi en cours", icon: "droplet", tone: "red" },
  { id: "asthma", name: "Asthme", status: "Léger", icon: "lungs", tone: "blue" },
] as const;

export const PATIENT_PROFILE_NAV = [
  { id: "profil", label: "Mon profil", icon: "user" },
  { id: "messages", label: "Messages", icon: "message", badge: 3 },
  { id: "documents", label: "Mes documents", icon: "folder" },
] as const;

export const PATIENT_PROFILE_APPOINTMENT = {
  date: "18 nov.",
  title: "Consultation à domicile",
  doctor: "Dr Martin Nguema",
  specialty: "Médecine générale",
  status: "Réalisé",
  href: "/patient/rendez-vous",
} as const;

export const PATIENT_PROFILE_REQUEST = {
  title: "Douleurs articulaires persistantes",
  published: "Publié le 9 nov.",
  proposals: 2,
  status: "En cours",
  href: "/patient/demandes",
} as const;

export const PATIENT_PROFILE_DOCUMENTS = [
  { id: "prescription", name: "Ordonnance médicale", detail: "Ajoutée le 18 nov. 2026", kind: "Ordonnance" },
  { id: "analysis", name: "Résultats d’analyse", detail: "Ajoutés le 12 nov. 2026", kind: "Analyse" },
] as const;

export const PATIENT_PROFILE_MESSAGES = [
  { id: "doctor", sender: "Dr Martin Nguema", text: "Bonjour, je vous confirme notre prochain rendez-vous.", when: "Il y a 2 h" },
  { id: "support", sender: "Équipe MedLink", text: "Votre dossier médical est prêt à être complété.", when: "Hier" },
] as const;
