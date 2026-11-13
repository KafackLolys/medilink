const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const availabilityRoutes = {
  Modes: {
    url: `${API_URL}/availabilities/me/modes`,
    method: "GET",
  },
  SetModes: {
    url: `${API_URL}/availabilities/me/modes`,
    method: "PUT",
  },
  Weekly: {
    url: `${API_URL}/availabilities/me/weekly`,
    method: "GET",
  },
  SetWeekly: {
    url: `${API_URL}/availabilities/me/weekly`,
    method: "PUT",
  },
  Blocked: {
    url: `${API_URL}/availabilities/me/blocked`,
    method: "GET",
  },
  CreateBlocked: {
    url: `${API_URL}/availabilities/me/blocked`,
    method: "POST",
  },
  DeleteBlocked: (id: string) => ({
    url: `${API_URL}/availabilities/me/blocked/${encodeURIComponent(id)}`,
    method: "DELETE",
  }),
  DoctorAppointments: {
    url: `${API_URL}/availabilities/me/appointments`,
    method: "GET",
  },
};
