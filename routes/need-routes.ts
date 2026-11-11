const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const needRoutes = {
  List: {
    url: `${API_URL}/needs`,
    method: "GET",
  },
  Create: {
    url: `${API_URL}/needs`,
    method: "POST",
  },
  Detail: (id: string) => ({
    url: `${API_URL}/needs/${encodeURIComponent(id)}`,
    method: "GET",
  }),
  Update: (id: string) => ({
    url: `${API_URL}/needs/${encodeURIComponent(id)}`,
    method: "PATCH",
  }),
  Close: (id: string) => ({
    url: `${API_URL}/needs/${encodeURIComponent(id)}/close`,
    method: "PATCH",
  }),
  Delete: (id: string) => ({
    url: `${API_URL}/needs/${encodeURIComponent(id)}`,
    method: "DELETE",
  }),
};
