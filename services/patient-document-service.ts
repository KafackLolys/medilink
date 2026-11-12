import { patientRoutes } from "@/routes/patient-routes";
import { apiRequest } from "./http";

export type PatientDocumentType =
  | "prescription"
  | "lab_result"
  | "medical_report"
  | "imaging"
  | "other";

export interface PatientDocument {
  id: string;
  type: PatientDocumentType;
  title: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  downloadUrl: string | null;
  dataUrl?: string | null;
}

export const documentTypeLabels: Record<PatientDocumentType, string> = {
  prescription: "Ordonnance médicale",
  lab_result: "Résultats d’analyse",
  medical_report: "Compte-rendu médical",
  imaging: "Imagerie médicale",
  other: "Autre document",
};

export const documentTypeColors: Record<PatientDocumentType, { badge: string; iconBg: string; text: string }> = {
  prescription: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    iconBg: "bg-blue-50 text-blue-600",
    text: "text-blue-700",
  },
  lab_result: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    iconBg: "bg-emerald-50 text-emerald-600",
    text: "text-emerald-700",
  },
  medical_report: {
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    iconBg: "bg-violet-50 text-violet-600",
    text: "text-violet-700",
  },
  imaging: {
    badge: "bg-sky-100 text-sky-700 border-sky-200",
    iconBg: "bg-sky-50 text-sky-600",
    text: "text-sky-700",
  },
  other: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    iconBg: "bg-slate-100 text-slate-600",
    text: "text-slate-700",
  },
};

export const patientDocumentService = {
  list(): Promise<PatientDocument[]> {
    // One-time privacy cleanup of the former cross-account medical file cache.
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem("medilink_patient_documents_cache"); } catch { /* unavailable */ }
    }
    return apiRequest<PatientDocument[]>(patientRoutes.MyDocuments.url, {
      method: patientRoutes.MyDocuments.method,
    });
  },
  upload(file: File, type: PatientDocumentType, title?: string): Promise<PatientDocument> {
    const body = new FormData();
    body.append("file", file, file.name);
    body.append("type", type);
    if (title?.trim()) body.append("title", title.trim());
    return apiRequest<PatientDocument>(patientRoutes.UploadDocument.url, {
      method: patientRoutes.UploadDocument.method,
      body,
    });
  },
  delete(id: string): Promise<void> {
    const route = patientRoutes.DeleteDocument(id);
    return apiRequest<void>(route.url, { method: route.method });
  },
};
