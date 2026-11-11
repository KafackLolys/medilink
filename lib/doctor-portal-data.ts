export type NeedPriority = "Élevée" | "Moyenne" | "Faible";
export type NeedMode = "À domicile" | "Téléconsultation";
export type Need = {
  id: string;
  title: string;
  summary: string;
  symptoms: string[];
  duration: string;
  specialty: string;
  city: string;
  district: string;
  distanceKm: number;
  mode: NeedMode;
  publishedAt: string;
  priority: NeedPriority;
  availableFrom: string;
  documents: string[];
};

export type DoctorProposalStatus = "Envoyée" | "En attente" | "Acceptée" | "Refusée" | "Expirée" | "Annulée";

export const DOCTOR_PROFILE_DETAILS = {
  fullName: "Dr. David Menye",
  phone: "+237 6 70 12 34 56",
  email: "david.menye@medlink.example",
  specialty: "Médecine générale",
  secondarySpecialties: ["Médecine préventive", "Gériatrie"],
  degrees: ["Doctorat en médecine · Université de Yaoundé I", "Diplôme de médecine familiale"],
  registrationNumber: "CM-MED-2012-0842",
  experienceYears: 14,
  bio: "Médecin généraliste, j’accompagne les familles et les personnes âgées avec une approche attentive et préventive. Consultations à domicile et suivi à distance.",
  consultationFee: "15 000",
  professionalAddress: "Centre médical du Mfoundi, Yaoundé",
  verificationStatus: "Vérifié" as const,
  documents: [
    { id: "license", name: "Inscription à l’Ordre des médecins", filename: "inscription-ordre.pdf", status: "Vérifié" },
    { id: "diploma", name: "Diplôme de médecine", filename: "diplome-medecine.pdf", status: "Vérifié" },
  ],
};

export const DOCTOR_ZONES = {
  city: "Yaoundé",
  radiusKm: 10,
  maxDistanceKm: 15,
  districts: ["Mimboman", "Centre-ville", "Biyem-Assi", "Bastos"],
} as const;

export const DOCTOR_NEEDS: Need[] = [
  {
    id: "request-1",
    title: "Besoin de consultation générale",
    summary: "Fatigue persistante, maux de tête et baisse d’appétit depuis quelques jours.",
    symptoms: ["Fatigue", "Maux de tête", "Baisse d’appétit"],
    duration: "Depuis 4 jours",
    specialty: "Médecine générale",
    city: "Yaoundé",
    district: "Mimboman",
    distanceKm: 2.4,
    mode: "À domicile",
    publishedAt: "Il y a 2 h",
    priority: "Élevée",
    availableFrom: "Aujourd’hui",
    documents: ["Résumé des symptômes.pdf"],
  },
  {
    id: "request-2",
    title: "Douleurs articulaires",
    summary: "Douleurs aux genoux et aux poignets, plus marquées le matin.",
    symptoms: ["Douleurs aux genoux", "Douleurs aux poignets"],
    duration: "Environ 2 semaines",
    specialty: "Rhumatologie",
    city: "Yaoundé",
    district: "Centre-ville",
    distanceKm: 4.1,
    mode: "Téléconsultation",
    publishedAt: "Hier",
    priority: "Moyenne",
    availableFrom: "Cette semaine",
    documents: [],
  },
  {
    id: "request-3",
    title: "Suivi pédiatrique",
    summary: "Suivi de croissance et contrôle vaccinal pour un enfant de 2 ans.",
    symptoms: ["Suivi de croissance"],
    duration: "Suivi régulier",
    specialty: "Pédiatrie",
    city: "Yaoundé",
    district: "Biyem-Assi",
    distanceKm: 3.2,
    mode: "À domicile",
    publishedAt: "Hier",
    priority: "Moyenne",
    availableFrom: "Cette semaine",
    documents: ["Carnet de santé (extrait).pdf"],
  },
  {
    id: "request-4",
    title: "Tension artérielle",
    summary: "Tension élevée constatée à plusieurs reprises cette semaine (= 150/95).",
    symptoms: ["Tension élevée"],
    duration: "Depuis 1 semaine",
    specialty: "Cardiologie",
    city: "Yaoundé",
    district: "Bastos",
    distanceKm: 5.6,
    mode: "À domicile",
    publishedAt: "Il y a 2 j",
    priority: "Faible",
    availableFrom: "Cette semaine",
    documents: [],
  },
  {
    id: "request-5",
    title: "Consultation de suivi après traitement",
    summary: "Souhaite faire le point après un traitement récent et vérifier son évolution.",
    symptoms: ["Suivi post-traitement"],
    duration: "Depuis 3 jours",
    specialty: "Médecine générale",
    city: "Yaoundé",
    district: "Mimboman",
    distanceKm: 1.8,
    mode: "Téléconsultation",
    publishedAt: "Il y a 3 h",
    priority: "Faible",
    availableFrom: "Aujourd’hui",
    documents: [],
  },
];

export const DOCTOR_PROPOSALS: {
  id: string;
  needId: string;
  needTitle: string;
  patient: string;
  sentAt: string;
  appointment: string;
  mode: NeedMode;
  fee: number;
  status: DoctorProposalStatus;
  response?: string;
}[] = [
  { id: "proposal-1", needId: "request-1", needTitle: "Besoin de consultation générale", patient: "Patient · Mimboman", sentAt: "Aujourd’hui, 09:12", appointment: "Aujourd’hui · 15:00", mode: "À domicile", fee: 15000, status: "En attente" },
  { id: "proposal-2", needId: "request-3", needTitle: "Suivi pédiatrique", patient: "Parent · Biyem-Assi", sentAt: "Hier, 16:40", appointment: "Demain · 10:30", mode: "À domicile", fee: 18000, status: "Acceptée", response: "La proposition a été acceptée. Rendez-vous confirmé." },
  { id: "proposal-3", needId: "request-2", needTitle: "Douleurs articulaires", patient: "Patient · Centre-ville", sentAt: "10 nov. 2026", appointment: "12 nov. · 11:00", mode: "Téléconsultation", fee: 10000, status: "Refusée", response: "Le patient a choisi une autre proposition." },
  { id: "proposal-4", needId: "request-4", needTitle: "Tension artérielle", patient: "Patient · Bastos", sentAt: "3 nov. 2026", appointment: "6 nov. · 09:00", mode: "À domicile", fee: 15000, status: "Expirée" },
];

export const DOCTOR_SCHEDULE = [
  { id: "monday", day: "Lundi", enabled: true, start: "08:00", end: "17:00" },
  { id: "tuesday", day: "Mardi", enabled: true, start: "08:00", end: "17:00" },
  { id: "wednesday", day: "Mercredi", enabled: true, start: "08:00", end: "13:00" },
  { id: "thursday", day: "Jeudi", enabled: true, start: "08:00", end: "17:00" },
  { id: "friday", day: "Vendredi", enabled: true, start: "08:00", end: "16:00" },
  { id: "saturday", day: "Samedi", enabled: false, start: "09:00", end: "13:00" },
  { id: "sunday", day: "Dimanche", enabled: false, start: "09:00", end: "13:00" },
] as const;

export const DOCTOR_BOOKED_APPOINTMENTS = [
  { id: "appointment-1", date: "2026-11-12", time: "09:00", patient: "Mme Alice N. Ekotto", district: "Mimboman", mode: "À domicile", status: "Confirmé" },
  { id: "appointment-2", date: "2026-11-12", time: "11:30", patient: "M. Jean C. Mbida", district: "Yaoundé", mode: "Téléconsultation", status: "Confirmé" },
  { id: "appointment-3", date: "2026-11-12", time: "16:00", patient: "Enfant Samuel T. (2 ans)", district: "Biyem-Assi", mode: "À domicile", status: "En attente" },
  { id: "appointment-4", date: "2026-11-13", time: "10:00", patient: "Patient · Bastos", district: "Bastos", mode: "À domicile", status: "À confirmer" },
  { id: "appointment-5", date: "2026-11-14", time: "14:30", patient: "Patient · Centre-ville", district: "Centre-ville", mode: "Téléconsultation", status: "Terminé" },
];

export const DOCTOR_BLOCKED_DATES = [
  { id: "blocked-1", date: "2026-11-16", label: "Lundi 16 novembre", reason: "Indisponibilité personnelle" },
];

export const DOCTOR_CONVERSATIONS = [
  { id: "conversation-1", patient: "Mme Alice N. Ekotto", initials: "AE", preview: "Merci docteur, je serai disponible à 9 h.", time: "09:42", unread: 2, requestId: "request-1", messages: [
    { id: "m1", from: "patient", text: "Bonjour docteur, pouvez-vous confirmer votre heure d’arrivée ?", time: "09:20" },
    { id: "m2", from: "doctor", text: "Bonjour, je vous confirme notre rendez-vous à 9 h.", time: "09:32" },
    { id: "m3", from: "patient", text: "Merci docteur, je serai disponible à 9 h.", time: "09:42" },
  ] },
  { id: "conversation-2", patient: "M. Jean C. Mbida", initials: "JM", preview: "La téléconsultation est-elle toujours prévue ?", time: "Hier", unread: 1, requestId: "request-2", messages: [
    { id: "m4", from: "patient", text: "La téléconsultation est-elle toujours prévue ?", time: "Hier · 18:10" },
  ] },
  { id: "conversation-3", patient: "Parent de Samuel", initials: "PS", preview: "J’ai ajouté un document au dossier.", time: "10 nov.", unread: 0, requestId: "request-3", messages: [
    { id: "m5", from: "patient", text: "J’ai ajouté un document au dossier.", time: "10 nov. · 14:25" },
  ] },
];

export const DOCTOR_NOTIFICATIONS = [
  { id: "notification-1", type: "Besoin pertinent", text: "Une nouvelle demande de médecine générale est disponible à Mimboman.", when: "Il y a 15 min", unread: true, href: "/medecin/besoins/request-5" },
  { id: "notification-2", type: "Proposition acceptée", text: "Votre proposition pour le suivi pédiatrique a été acceptée.", when: "Il y a 1 h", unread: true, href: "/medecin/propositions" },
  { id: "notification-3", type: "Rendez-vous confirmé", text: "Mme Alice N. Ekotto a confirmé le rendez-vous de demain.", when: "Hier", unread: false, href: "/medecin/rendez-vous" },
  { id: "notification-4", type: "Nouveau message", text: "M. Jean C. Mbida vous a envoyé un message.", when: "Hier", unread: false, href: "/medecin/messages" },
];

export const DOCTOR_PATIENT_REVIEWS = [
  { id: "review-1", patient: "Mme Alice N. Ekotto", rating: 5, date: "8 nov. 2026", comment: "Médecin très attentif et ponctuel. La consultation à domicile s’est très bien passée." },
  { id: "review-2", patient: "M. Paul M.", rating: 4, date: "2 nov. 2026", comment: "Très bonne écoute et des explications claires." },
  { id: "review-3", patient: "Mme Carine T.", rating: 5, date: "28 oct. 2026", comment: "Professionnel, rassurant et disponible. Je recommande." },
];
