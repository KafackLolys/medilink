import { doctorRoutes } from "@/routes/doctor-routes";
import { apiRequest } from "./http";

export type ConsultationMode = "home" | "teleconsultation";

export interface DoctorAvailability {
  weekday: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

export interface DoctorDirectoryItem {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  yearsOfExperience: number;
  consultationFee: number;
  currency: string;
  professionalAddress: string | null;
  modes: ConsultationMode[];
  availability: DoctorAvailability[];
  rating: number | null;
  reviewsCount: number;
}

export interface DoctorOwnProfile extends DoctorDirectoryItem {
  phone: string;
  email: string;
  registrationNumber: string;
  secondarySpecialties: string[];
  degrees: string[];
  verificationStatus: "pending" | "verified" | "rejected" | "suspended";
  documents: Array<{
    id: string;
    name: string;
    filename: string;
    status: string;
  }>;
  completedConsultations: number;
}

export interface DoctorDirectoryResult {
  doctors: DoctorDirectoryItem[];
  specialties: string[];
}

export interface DoctorFilters {
  q?: string;
  specialty?: string;
  city?: string;
}

export const doctorService = {
  myProfile(): Promise<DoctorOwnProfile> {
    return apiRequest<DoctorOwnProfile>(doctorRoutes.MyProfile.url, {
      method: doctorRoutes.MyProfile.method,
    });
  },

  list(filters: DoctorFilters = {}): Promise<DoctorDirectoryResult> {
    const url = new URL(doctorRoutes.List.url);
    if (filters.q) url.searchParams.set("q", filters.q);
    if (filters.specialty) url.searchParams.set("specialty", filters.specialty);
    if (filters.city) url.searchParams.set("city", filters.city);
    return apiRequest<DoctorDirectoryResult>(url.toString(), {
      method: doctorRoutes.List.method,
    });
  },

  detail(id: string): Promise<DoctorDirectoryItem> {
    const route = doctorRoutes.Detail(id);
    return apiRequest<DoctorDirectoryItem>(route.url, { method: route.method });
  },
};
