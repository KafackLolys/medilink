import { adminRoutes } from "@/routes/admin-routes";
import { apiRequest } from "./http";

export type ManagedRole = "patient" | "doctor";
export type ManagedAccountStatus =
  | "active"
  | "pending"
  | "suspended"
  | "deleted";
export type DoctorVerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "suspended";

export interface AdminAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  role: ManagedRole;
  status: ManagedAccountStatus;
  emailVerified: boolean;
  verificationStatus: DoctorVerificationStatus | null;
  createdAt: string | null;
}

export interface AdminAccountPage {
  items: AdminAccount[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CreateAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export const adminService = {
  listAccounts(
    role: ManagedRole,
    page: number,
    pageSize: number,
    q: string,
  ): Promise<AdminAccountPage> {
    const url = new URL(adminRoutes.Accounts);
    url.searchParams.set("role", role);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    if (q) url.searchParams.set("q", q);
    return apiRequest<AdminAccountPage>(url.toString());
  },

  updateStatus(
    id: string,
    status: ManagedAccountStatus,
  ): Promise<{ id: string; status: ManagedAccountStatus }> {
    return apiRequest(adminRoutes.AccountStatus(id), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  updateVerification(
    id: string,
    verification: { emailVerified: boolean } | { verificationStatus: DoctorVerificationStatus },
  ): Promise<{ id: string; emailVerified?: boolean; verificationStatus?: DoctorVerificationStatus }> {
    return apiRequest(adminRoutes.AccountVerification(id), {
      method: "PATCH",
      body: JSON.stringify(verification),
    });
  },

  createAdmin(data: CreateAdminRequest): Promise<AdminAccount> {
    return apiRequest<AdminAccount>(adminRoutes.CreateAdmin, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
