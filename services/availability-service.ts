import { availabilityRoutes } from "@/routes/availability-routes";
import { apiRequest } from "./http";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface WeeklyAvailabilityInput {
  weekday: Weekday;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

export interface WeeklyAvailabilityOutput extends WeeklyAvailabilityInput {
  id: string;
}

export interface BlockedDate {
  id: string;
  date: string; // YYYY-MM-DD
  label: string;
  reason: string | null;
}

export interface CreateBlockedDateInput {
  date: string;
  reason?: string;
}

export interface DoctorAppointmentView {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  patient: string;
  district: string | null;
  status: string;
}

export const availabilityService = {
  getWeekly(): Promise<WeeklyAvailabilityOutput[]> {
    return apiRequest<WeeklyAvailabilityOutput[]>(availabilityRoutes.Weekly.url, {
      method: availabilityRoutes.Weekly.method,
    });
  },

  setWeekly(
    availabilities: WeeklyAvailabilityInput[],
  ): Promise<WeeklyAvailabilityOutput[]> {
    return apiRequest<WeeklyAvailabilityOutput[]>(
      availabilityRoutes.SetWeekly.url,
      {
        method: availabilityRoutes.SetWeekly.method,
        body: JSON.stringify(availabilities),
      },
    );
  },

  getDuration(): Promise<{ durationMinutes: number }> {
    return apiRequest<{ durationMinutes: number }>(`${availabilityRoutes.Weekly.url.replace(/\/weekly$/, "")}/duration`);
  },
  setDuration(durationMinutes: number): Promise<{ durationMinutes: number }> {
    return apiRequest<{ durationMinutes: number }>(`${availabilityRoutes.Weekly.url.replace(/\/weekly$/, "")}/duration`, {
      method: "PATCH", body: JSON.stringify({ durationMinutes }),
    });
  },

  getBlocked(): Promise<BlockedDate[]> {
    return apiRequest<BlockedDate[]>(availabilityRoutes.Blocked.url, {
      method: availabilityRoutes.Blocked.method,
    });
  },

  createBlocked(data: CreateBlockedDateInput): Promise<BlockedDate> {
    return apiRequest<BlockedDate>(availabilityRoutes.CreateBlocked.url, {
      method: availabilityRoutes.CreateBlocked.method,
      body: JSON.stringify(data),
    });
  },

  deleteBlocked(id: string): Promise<void> {
    const route = availabilityRoutes.DeleteBlocked(id);
    return apiRequest<void>(route.url, { method: route.method });
  },

  getDoctorAppointments(): Promise<DoctorAppointmentView[]> {
    return apiRequest<DoctorAppointmentView[]>(
      availabilityRoutes.DoctorAppointments.url,
      {
        method: availabilityRoutes.DoctorAppointments.method,
      },
    );
  },
};
