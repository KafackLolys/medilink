const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const authRoutes = {
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
  Logout: {
    url: `${API_URL}/auth/logout`,
    method: 'POST',
  },
  Refresh: {
    url: `${API_URL}/auth/refresh`,
    method: 'GET',
  },
  ResetUserIdentifiers: {
    url: `${API_URL}/auth/reset-password`,
    method: "POST",
  },
};