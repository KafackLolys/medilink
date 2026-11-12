const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const appointmentRoutes = {
  List: {
    url: `${API_URL}/appointments`,
    method: "GET",
  },
  Detail: (id: string) => ({
    url: `${API_URL}/appointments/${encodeURIComponent(id)}`,
    method: "GET",
  }),
  Create: {
    url: `${API_URL}/appointments`,
    method: "POST",
  },
};
