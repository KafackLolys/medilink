import { apiRequest } from "@/services/http";
const API = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export type DoctorZoneSettings = { city: string; districts: string[]; radiusKm: number; maxDistanceKm: number };
export type PatientProfileUpdate = {
  name: string; phone: string; bloodType: string; city: string; district: string;
};
export type ContactMessage = { name: string; email: string; subject: string; message: string };
export const integrationService = {
  getDoctorZone(): Promise<DoctorZoneSettings> {
    return apiRequest<DoctorZoneSettings>(`${API}/integration/doctor/zone`);
  },
  saveDoctorZone(settings: DoctorZoneSettings): Promise<DoctorZoneSettings> {
    return apiRequest<DoctorZoneSettings>(`${API}/integration/doctor/zone`, {method:"PUT",body:JSON.stringify(settings)});
  },
  savePatientProfile(data: PatientProfileUpdate): Promise<{ saved: boolean }> {
    return apiRequest<{saved:boolean}>(`${API}/integration/patient/profile`, {method:"PATCH",body:JSON.stringify(data)});
  },
  sendContact(data: ContactMessage): Promise<{ id:string }> {
    return apiRequest<{id:string}>(`${API}/integration/contact`, {method:"POST",body:JSON.stringify(data)});
  },
};
