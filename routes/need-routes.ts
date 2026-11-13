const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const needRoutes = {
  PatientProposals: (id: string) => ({
    url: `${API_URL}/needs/${encodeURIComponent(id)}/proposals`, method: "GET",
  }),
  AcceptPatientProposal: (id: string, proposalId: string) => ({
    url: `${API_URL}/needs/${encodeURIComponent(id)}/proposals/${encodeURIComponent(proposalId)}/accept`, method: "PATCH",
  }),
  List: {
    url: `${API_URL}/needs`,
    method: "GET",
  },
  DoctorList: {
    url: `${API_URL}/needs/doctor`,
    method: "GET",
  },
  DoctorProposals: {
    url: `${API_URL}/needs/doctor/proposals`,
    method: "GET",
  },
  CancelDoctorProposal: (id: string) => ({
    url: `${API_URL}/needs/doctor/proposals/${encodeURIComponent(id)}/cancel`,
    method: "PATCH",
  }),
  DoctorDetail: (id: string) => ({
    url: `${API_URL}/needs/doctor/${encodeURIComponent(id)}`,
    method: "GET",
  }),
  DoctorProposal: (id: string) => ({
    url: `${API_URL}/needs/doctor/${encodeURIComponent(id)}/proposals`,
    method: "POST",
  }),
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
