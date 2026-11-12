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
  documents: DoctorVerificationDocument[];
  completedConsultations: number;
}

export type ProfessionalDocumentType =
  | "medical_license"
  | "medical_degree"
  | "identity_document"
  | "other";

export interface DoctorVerificationDocument {
  id: string;
  medicalDocumentId: string;
  name: ProfessionalDocumentType;
  filename: string;
  status: "pending" | "approved" | "rejected";
  sizeBytes: number;
  downloadUrl: string | null;
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
  updateMyProfile(data: {
    bio: string;
    yearsOfExperience: number;
    consultationFee: number;
    professionalAddress: string | null;
  }): Promise<DoctorOwnProfile> {
    return apiRequest<DoctorOwnProfile>(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"}/doctors/me`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  myProfile(): Promise<DoctorOwnProfile> {
    return apiRequest<DoctorOwnProfile>(doctorRoutes.MyProfile.url, {
      method: doctorRoutes.MyProfile.method,
    });
  },

  uploadMyDocument(
    file: File,
    type: ProfessionalDocumentType,
  ): Promise<DoctorVerificationDocument> {
    const body = new FormData();
    body.append("file", new Blob([file], { type: file.type }), file.name);
    body.append("type", type);
    return apiRequest<DoctorVerificationDocument>(doctorRoutes.MyDocuments.url, {
      method: doctorRoutes.MyDocuments.method,
      body,
    });
  },

  deleteMyDocument(id: string): Promise<void> {
    const route = doctorRoutes.DeleteMyDocument(id);
    return apiRequest<void>(route.url, { method: route.method });
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
