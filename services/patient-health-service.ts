import { apiRequest } from "./http";

export interface PatientHealthCondition {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "controlled" | "inactive";
  diagnosedAt: string | null;
  notes: string | null;
}

export const patientHealthService = {
  list(): Promise<PatientHealthCondition[]> {
    return apiRequest<PatientHealthCondition[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? ""}/patients/me/conditions`,
    );
  },
};
