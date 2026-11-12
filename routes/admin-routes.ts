const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const adminRoutes = {
  Accounts: `${API_URL}/admin/accounts`,
  AccountStatus: (id: string) =>
    `${API_URL}/admin/accounts/${encodeURIComponent(id)}/status`,
  AccountVerification: (id: string) =>
    `${API_URL}/admin/accounts/${encodeURIComponent(id)}/verification`,
  CreateAdmin: `${API_URL}/admin/admins`,
};
