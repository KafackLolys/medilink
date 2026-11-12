import { appointmentRoutes } from "@/routes/appointment-routes";
import { apiRequest } from "./http";
import type { ConsultationMode } from "./doctor-service";

export type AppointmentStatus =
  | "pending_confirmation"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected"
  | "no_show";

export interface PatientAppointment {
  id: string;
  doctor: {
    id: string;
    name: string;
    specialty: string;
    professionalAddress: string | null;
  };
  scheduledAt: string;
  durationMinutes: number;
  consultationMode: ConsultationMode;
  status: AppointmentStatus;
  fee: number;
  currency: string;
  reason: string | null;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  scheduledAt: string;
  timeZone: string;
  consultationMode: ConsultationMode;
  reason?: string;
}

export const appointmentService = {
  listMine(): Promise<PatientAppointment[]> {
    return apiRequest<PatientAppointment[]>(appointmentRoutes.List.url, {
      method: appointmentRoutes.List.method,
    });
  },

  detail(id: string): Promise<PatientAppointment> {
    const route = appointmentRoutes.Detail(id);
    return apiRequest<PatientAppointment>(route.url, { method: route.method });
  },

  create(
    request: CreateAppointmentRequest,
  ): Promise<{ id: string; status: AppointmentStatus }> {
    return apiRequest<{ id: string; status: AppointmentStatus }>(
      appointmentRoutes.Create.url,
      {
        method: appointmentRoutes.Create.method,
        body: JSON.stringify(request),
      },
    );
  },
};
