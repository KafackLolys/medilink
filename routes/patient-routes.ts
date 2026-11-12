const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const patientRoutes = {
  MyDocuments: {
    url: `${API_URL}/patients/me/documents`,
    method: "GET",
  },
  UploadDocument: {
    url: `${API_URL}/patients/me/documents`,
    method: "POST",
  },
  DeleteDocument: (id: string) => ({
    url: `${API_URL}/patients/me/documents/${encodeURIComponent(id)}`,
    method: "DELETE",
  }),
};

