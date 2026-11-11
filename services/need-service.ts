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
