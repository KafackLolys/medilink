import { apiRequest } from "./http";

export interface DoctorReview {
  id: string;
  appointmentId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  patientLabel: string;
}
export interface DoctorReviewSummary {
  rating: number | null;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  items: DoctorReview[];
}

export const doctorReviewService = {
  listMine(): Promise<DoctorReviewSummary> {
    return apiRequest<DoctorReviewSummary>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? ""}/doctors/me/reviews`,
    );
  },
};
