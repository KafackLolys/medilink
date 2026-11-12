export type Availability = "today" | "week" | "later";
export type DoctorListing = {
  id: string; name: string; initials: string; color: string; specialty: string; years: number; rating: number; reviews: number;
  area: string; distanceKm: number; availability: Availability; availabilityLabel: string; modes: string[]; pin: { x: number; y: number }; coordinates?: { latitude: number; longitude: number };
};

export const SPECIALTIES = ["Médecine générale", "Pédiatrie", "Cardiologie", "Dermatologie", "Gynécologie", "Neurologie", "Kinésithérapie", "Autre"];

export const DOCTORS: DoctorListing[] = [
  { id: "d1", name: "Dr. Amina Nguema", initials: "AN", color: "bg-secondary/15 text-secondary", specialty: "Médecine générale", years: 12, rating: 4.9, reviews: 128, area: "Secteur Centre", distanceKm: 1.2, availability: "today", availabilityLabel: "Disponible aujourd’hui", modes: ["À domicile", "Téléconsultation"], pin: { x: 47, y: 57 } },
  { id: "d2", name: "Dr. Paul Ndongo", initials: "PN", color: "bg-primary/10 text-primary", specialty: "Cardiologie", years: 15, rating: 4.8, reviews: 96, area: "Secteur Nord", distanceKm: 3.4, availability: "week", availabilityLabel: "Disponible cette semaine", modes: ["À domicile"], pin: { x: 38, y: 22 } },
  { id: "d3", name: "Dr. Aïcha Kamga", initials: "AK", color: "bg-warn/20 text-amber-700", specialty: "Pédiatrie", years: 9, rating: 5.0, reviews: 74, area: "Secteur Est", distanceKm: 2.1, availability: "today", availabilityLabel: "Disponible aujourd’hui", modes: ["À domicile", "Téléconsultation"], pin: { x: 74, y: 58 } },
  { id: "d4", name: "Dr. Sarah Mbarga", initials: "SM", color: "bg-secondary/15 text-secondary", specialty: "Médecine générale", years: 7, rating: 4.7, reviews: 53, area: "Secteur Sud", distanceKm: 4.8, availability: "week", availabilityLabel: "Disponible cette semaine", modes: ["À domicile"], pin: { x: 46, y: 78 } },
  { id: "d5", name: "Dr. Jean Essomba", initials: "JE", color: "bg-primary/10 text-primary", specialty: "Neurologie", years: 18, rating: 4.9, reviews: 61, area: "Secteur Nord", distanceKm: 6.3, availability: "later", availabilityLabel: "Dès la semaine prochaine", modes: ["Téléconsultation"], pin: { x: 22, y: 30 } },
  { id: "d6", name: "Dr. Laure Fotso", initials: "LF", color: "bg-warn/20 text-amber-700", specialty: "Dermatologie", years: 10, rating: 4.6, reviews: 42, area: "Secteur Centre", distanceKm: 1.9, availability: "week", availabilityLabel: "Disponible cette semaine", modes: ["À domicile", "Téléconsultation"], pin: { x: 64, y: 34 } },
  { id: "d7", name: "Dr. Éric Tchoua", initials: "ET", color: "bg-secondary/15 text-secondary", specialty: "Kinésithérapie", years: 8, rating: 4.8, reviews: 88, area: "Secteur Ouest", distanceKm: 2.7, availability: "today", availabilityLabel: "Disponible aujourd’hui", modes: ["À domicile"], pin: { x: 24, y: 60 } },
  { id: "d8", name: "Dr. Nadine Biyick", initials: "NB", color: "bg-primary/10 text-primary", specialty: "Gynécologie", years: 14, rating: 4.9, reviews: 109, area: "Secteur Est", distanceKm: 7.5, availability: "later", availabilityLabel: "Dès la semaine prochaine", modes: ["À domicile", "Téléconsultation"], pin: { x: 84, y: 24 } },
];
