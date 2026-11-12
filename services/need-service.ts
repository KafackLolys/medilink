import { needRoutes } from "@/routes/need-routes";
import { apiRequest } from "./http";

export type NeedStatus =
  | "draft"
  | "published"
  | "awaiting_proposals"
  | "proposals_received"
  | "appointment_confirmed"
  | "closed"
  | "cancelled";

export interface PatientNeed {
  id: string;
  title: string;
  specialty: string;
  createdAt: string;
  interested: number;
  mode: "domicile" | "teleconsultation";
  status: NeedStatus;
  attachmentsCount: number;
}

export interface PatientNeedDetail extends PatientNeed {
  description: string;
  symptoms: string[];
  durationDescription: string | null;
  city: string;
  district: string;
  privateAddress: string | null;
  priority: "normal" | "rapide";
  attachments: Array<{
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    downloadUrl: string;
  }>;
}

export interface UpdateNeedRequest {
  title: string;
  specialty: string;
  description: string;
  mode: "domicile" | "tele";
}

export interface DoctorNeedFilters {
  q?: string;
  specialty?: string;
  priority?: "routine" | "urgent" | "emergency";
  mode?: "home" | "teleconsultation";
}

export interface DoctorNeedListItem {
  id: string;
  title: string;
  summary: string;
  specialty: string;
  city: string;
  district: string;
  mode: "home" | "teleconsultation";
  priority: "routine" | "urgent" | "emergency";
  publishedAt: string;
  availableFrom: string | null;
  documentsCount: number;
}

export interface PaginatedDoctorNeeds {
  items: DoctorNeedListItem[];
  specialties: string[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DoctorNeedDetail extends Omit<PatientNeedDetail, "priority"> {
  priority: "routine" | "urgent" | "emergency";
  availableFrom: string | null;
  attachments: PatientNeedDetail["attachments"];
}

export interface DoctorProposalRequest {
  message: string;
  proposedAppointmentAt: string;
  consultationMode: "home" | "teleconsultation";
  fee: number;
  details?: string;
}

export type ProposalStatus =
  | "sent"
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled";

export interface DoctorProposal {
  id: string;
  needId: string;
  needTitle: string;
  specialty: string;
  city: string;
  district: string;
  status: ProposalStatus;
  message: string;
  proposedAt: string;
  proposedAppointmentAt: string | null;
  consultationMode: "home" | "teleconsultation";
  fee: number;
  currency: string;
  patientResponse: string | null;
  respondedAt: string | null;
}

export interface PaginatedDoctorProposals {
  items: DoctorProposal[];
  counts: Record<ProposalStatus, number>;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CreateNeedRequest {
  title: string;
  specialty: string;
  description: string;
  symptoms: string[];
  since?: string;
  city: string;
  district: string;
  address?: string;
  priority: "normal" | "rapide" | "urgence";
  mode: "domicile" | "tele";
  consent: boolean;
}

export const needService = {
  list(): Promise<PatientNeed[]> {
    return apiRequest<PatientNeed[]>(needRoutes.List.url, {
      method: needRoutes.List.method,
    });
  },

  listForDoctor(
    filters: DoctorNeedFilters,
    page: number,
    pageSize: number,
  ): Promise<PaginatedDoctorNeeds> {
    const url = new URL(needRoutes.DoctorList.url);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    if (filters.q) url.searchParams.set("q", filters.q);
    if (filters.specialty) url.searchParams.set("specialty", filters.specialty);
    if (filters.priority) url.searchParams.set("priority", filters.priority);
    if (filters.mode) url.searchParams.set("mode", filters.mode);
    return apiRequest<PaginatedDoctorNeeds>(url.toString(), {
      method: needRoutes.DoctorList.method,
    });
  },

  listProposalsForDoctor(
    status: ProposalStatus | "",
    page: number,
    pageSize: number,
  ): Promise<PaginatedDoctorProposals> {
    const url = new URL(needRoutes.DoctorProposals.url);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    if (status) url.searchParams.set("status", status);
    return apiRequest<PaginatedDoctorProposals>(url.toString(), {
      method: needRoutes.DoctorProposals.method,
    });
  },

  create(data: CreateNeedRequest, files: File[]): Promise<PatientNeed> {
    const body = new FormData();
    body.append("data", JSON.stringify(data));
    for (const file of files) {
      body.append("files", new Blob([file], { type: file.type }), file.name);
    }

    return apiRequest<PatientNeed>(needRoutes.Create.url, {
      method: needRoutes.Create.method,
      body,
    });
  },

  detail(id: string): Promise<PatientNeedDetail> {
    const route = needRoutes.Detail(id);
    return apiRequest<PatientNeedDetail>(route.url, { method: route.method });
  },

  doctorDetail(id: string): Promise<DoctorNeedDetail> {
    const route = needRoutes.DoctorDetail(id);
    return apiRequest<DoctorNeedDetail>(route.url, { method: route.method });
  },

  sendDoctorProposal(
    id: string,
    data: DoctorProposalRequest,
  ): Promise<{ id: string }> {
    const route = needRoutes.DoctorProposal(id);
    return apiRequest<{ id: string }>(route.url, {
      method: route.method,
      body: JSON.stringify(data),
    });
  },

  cancelDoctorProposal(id: string): Promise<{ id: string; status: ProposalStatus }> {
    const route = needRoutes.CancelDoctorProposal(id);
    return apiRequest<{ id: string; status: ProposalStatus }>(route.url, {
      method: route.method,
    });
  },

  update(id: string, data: UpdateNeedRequest): Promise<PatientNeedDetail> {
    const route = needRoutes.Update(id);
    return apiRequest<PatientNeedDetail>(route.url, {
      method: route.method,
      body: JSON.stringify(data),
    });
  },

  close(id: string): Promise<void> {
    const route = needRoutes.Close(id);
    return apiRequest<void>(route.url, { method: route.method });
  },

  remove(id: string): Promise<void> {
    const route = needRoutes.Delete(id);
    return apiRequest<void>(route.url, { method: route.method });
  },
};
