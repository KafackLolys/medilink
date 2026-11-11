export type DoctorRequest = {
  id: string;
  title: string;
  specialty: string;
  location: string;
  published: string;
  priority: "Élevée" | "Moyenne" | "Faible";
  summary: string;
  icon: "stethoscope" | "activity" | "baby" | "heart";
};

export type DoctorAppointment = {
  id: string;
  time: string;
  patient: string;
  location: string;
  mode: "Domicile" | "Téléconsultation";
  status: "Confirmé" | "En attente";
};

export const DOCTOR_PROFILE = {
  name: "Dr. David Menye",
  initials: "DM",
  specialty: "Médecin généraliste",
  verified: true,
  city: "Yaoundé",
  coveredAreas: "Mimboman, Centre-ville, Biyem-Assi, Bastos et environs",
};

export const DOCTOR_METRICS = [
  { id: "requests", label: "Nouvelles demandes", value: 8, change: "+2", period: "vs. semaine dernière", icon: "users", tone: "blue" },
  { id: "proposals", label: "Propositions envoyées", value: 5, change: "+1", period: "vs. semaine dernière", icon: "send", tone: "blue" },
  { id: "appointments", label: "Rendez-vous à venir", value: 3, change: "Cette semaine", icon: "calendar", tone: "blue" },
  { id: "response", label: "Taux de réponse", value: "92 %", change: "+4 pts", period: "vs. semaine dernière", icon: "chart", tone: "green" },
] as const;

export const DOCTOR_REQUESTS: DoctorRequest[] = [
  {
    id: "request-1",
    title: "Besoin de consultation générale",
    specialty: "Médecine générale",
    location: "Yaoundé · Mimboman",
    published: "Publié il y a 2 h",
    priority: "Élevée",
    summary: "Fatigue persistante, maux de tête et baisse d’appétit depuis quelques jours.",
    icon: "stethoscope",
  },
  {
    id: "request-2",
    title: "Douleurs articulaires",
    specialty: "Rhumatologie",
    location: "Yaoundé · Centre-ville",
    published: "Publié hier",
    priority: "Moyenne",
    summary: "Douleurs aux genoux et aux poignets, plus marquées le matin.",
    icon: "activity",
  },
  {
    id: "request-3",
    title: "Suivi pédiatrique",
    specialty: "Pédiatrie",
    location: "Yaoundé · Biyem-Assi",
    published: "Publié hier",
    priority: "Moyenne",
    summary: "Suivi de croissance et contrôle vaccinal pour un enfant de 2 ans.",
    icon: "baby",
  },
  {
    id: "request-4",
    title: "Tension artérielle",
    specialty: "Cardiologie",
    location: "Yaoundé · Bastos",
    published: "Publié il y a 2 j",
    priority: "Faible",
    summary: "Tension élevée constatée à plusieurs reprises cette semaine (= 150/95).",
    icon: "heart",
  },
];

export const DOCTOR_APPOINTMENTS: DoctorAppointment[] = [
  { id: "appointment-1", time: "09:00", patient: "Mme Alice N. Ekotto", location: "Mimboman · Yaoundé", mode: "Domicile", status: "Confirmé" },
  { id: "appointment-2", time: "11:30", patient: "M. Jean C. Mbida", location: "Yaoundé", mode: "Téléconsultation", status: "Confirmé" },
  { id: "appointment-3", time: "16:00", patient: "Enfant Samuel T. (2 ans)", location: "Biyem-Assi", mode: "Domicile", status: "En attente" },
];

export const DOCTOR_QUICK_ACTIONS = [
  { id: "requests", label: "Voir les besoins des patients", href: "/medecin/besoins", icon: "users" },
  { id: "availability", label: "Gérer mes disponibilités", href: "/medecin/disponibilites", icon: "calendar" },
  { id: "profile", label: "Mettre à jour mon profil", href: "/medecin/profil", icon: "user" },
] as const;

export const DOCTOR_WEEK: { id: string; day: string; date: string; appointments: number; selected?: boolean }[] = [
  { id: "mon", day: "Lun.", date: "20", appointments: 2 },
  { id: "tue", day: "Mar.", date: "21", appointments: 3, selected: true },
  { id: "wed", day: "Mer.", date: "22", appointments: 1 },
  { id: "thu", day: "Jeu.", date: "23", appointments: 2 },
  { id: "fri", day: "Ven.", date: "24", appointments: 1 },
  { id: "sat", day: "Sam.", date: "25", appointments: 0 },
  { id: "sun", day: "Dim.", date: "26", appointments: 0 },
] as const;
