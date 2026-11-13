const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const authRoutes = {
  GoogleStatus: { url: `${API_URL}/auth/google/status`, method: "POST" },
  GoogleComplete: { url: `${API_URL}/auth/google/complete`, method: "POST" },
  Login: {
    url: `${API_URL}/auth/login`,
    method: "POST",
  },
  Register: {
    url: `${API_URL}/auth/register`,
    method: "POST",
  },
  Profile: {
    url: `${API_URL}/auth/profile`,
    method: "GET",
  },
  UpdateAdminProfile: {
    url: `${API_URL}/auth/admin/profile`,
    method: "PATCH",
  },
  Logout: {
    url: `${API_URL}/auth/logout`,
    method: 'POST',
  },
  Refresh: {
    url: `${API_URL}/auth/refresh`,
    method: "POST",
  },
  ResetUserIdentifiers: {
    url: `${API_URL}/auth/reset-password`,
    method: "POST",
  },
};