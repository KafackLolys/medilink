import { authRoutes } from "@/routes/auth-routes";
import { apiRequest, publicApiRequest } from "./http";

export type AccountRole = "patient" | "doctor" | "admin";
export type RegisterableRole = Exclude<AccountRole, "admin">;

export interface AuthenticatedUser {
  id: string;
  role: AccountRole;
  email: string;
  phone: string;
  status: "active" | "pending" | "suspended" | "deleted";
  firstName?: string;
  lastName?: string;
  specialty?: string | null;
  registrationNumber?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: RegisterableRole;
  specialty?: string;
  registrationNumber?: string;
}

export interface AuthResponse {
  user: AuthenticatedUser;
  message?: string;
}

export interface LoginResponse extends AuthResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface PatientProfileResponse {
  user: AuthenticatedUser;
  patient: {
    id: string;
    fullName: string;
    dateOfBirth: string | null;
    gender: "female" | "male" | "non_binary" | "undisclosed";
    bloodType:
      | "a_positive"
      | "a_negative"
      | "b_positive"
      | "b_negative"
      | "ab_positive"
      | "ab_negative"
      | "o_positive"
      | "o_negative"
      | "unknown";
    verified: boolean;
    address: {
      city: string;
      district: string;
    } | null;
  };
}

export const authService = {
  /**
   * POST /auth/register
   * Request: { firstName, lastName, email, phone, password, role,
   *            specialty?, registrationNumber? }
   * Response: { user: { id, role, email, phone, status }, message? }
   */
  register(data: RegisterRequest): Promise<AuthResponse> {
    return publicApiRequest<AuthResponse>(authRoutes.Register.url, {
      method: authRoutes.Register.method,
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /auth/login
   * Request: { email, password }
   * Response: { user, idToken, refreshToken, expiresIn, tokenType }
   */
  login(data: LoginRequest): Promise<LoginResponse> {
    return publicApiRequest<LoginResponse>(authRoutes.Login.url, {
      method: authRoutes.Login.method,
      body: JSON.stringify(data),
    });
  },

  logout(): Promise<void> {
    return publicApiRequest<void>(authRoutes.Logout.url, {
      method: authRoutes.Logout.method,
    });
  },

  /**
   * GET /auth/profile
   * Response: { user: { id, role, email, phone, status },
   * patient: { id, fullName, dateOfBirth, gender, bloodType, verified,
   *            address: { city, district } | null } }
   */
  getPatientProfile(): Promise<PatientProfileResponse> {
    return apiRequest<PatientProfileResponse>(authRoutes.Profile.url, {
      method: authRoutes.Profile.method,
    });
  },
};
