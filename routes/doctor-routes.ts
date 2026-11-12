const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const doctorRoutes = {
  MyProfile: {
    url: `${API_URL}/doctors/me`,
    method: "GET",
  },
  List: {
    url: `${API_URL}/doctors`,
    method: "GET",
  },
  Detail: (id: string) => ({
    url: `${API_URL}/doctors/${encodeURIComponent(id)}`,
    method: "GET",
  }),
};
