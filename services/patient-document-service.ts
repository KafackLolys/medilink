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

const STORAGE_KEY = "medilink_patient_documents_cache";

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

const DEFAULT_DOCUMENTS: PatientDocument[] = [
  {
    id: "doc-sample-1",
    type: "prescription",
    title: "Ordonnance traitement hypertension",
    filename: "ordonnance-dr-nguema-nov2026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 245 * 1024,
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: null,
  },
  {
    id: "doc-sample-2",
    type: "lab_result",
    title: "Bilan sanguin complet & glycémie",
    filename: "bilan-sanguin-labo-centre.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1048 * 1024,
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: null,
  },
  {
    id: "doc-sample-3",
    type: "medical_report",
    title: "Compte-rendu consultation cardiologique",
    filename: "compte-rendu-cardio-oct2026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 520 * 1024,
    uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: null,
  },
  {
    id: "doc-sample-4",
    type: "imaging",
    title: "Radiographie pulmonaire",
    filename: "radio-poumons-sept2026.jpg",
    mimeType: "image/jpeg",
    sizeBytes: 2400 * 1024,
    uploadedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    downloadUrl: null,
  },
];

function getLocalDocuments(): PatientDocument[] {
  if (typeof window === "undefined") return DEFAULT_DOCUMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DOCUMENTS));
      return DEFAULT_DOCUMENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_DOCUMENTS;
  } catch {
    return DEFAULT_DOCUMENTS;
  }
}

function saveLocalDocuments(docs: PatientDocument[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch {
    // Ignore storage quota errors
  }
}

export const patientDocumentService = {
  async list(): Promise<PatientDocument[]> {
    try {
      const remote = await apiRequest<PatientDocument[]>(patientRoutes.MyDocuments.url, {
        method: patientRoutes.MyDocuments.method,
      });
      if (Array.isArray(remote)) {
        saveLocalDocuments(remote);
        return remote;
      }
    } catch {
      // Backend offline or token missing: gracefully fallback to cached/sample documents
    }
    return getLocalDocuments();
  },

  async upload(
    file: File,
    type: PatientDocumentType,
    title?: string,
  ): Promise<PatientDocument> {
    const docTitle = title?.trim() || file.name.replace(/\.[^/.]+$/, "");

    try {
      const body = new FormData();
      body.append("file", file, file.name);
      body.append("type", type);
      if (title) body.append("title", title.trim());

      const remote = await apiRequest<PatientDocument>(patientRoutes.UploadDocument.url, {
        method: patientRoutes.UploadDocument.method,
        body,
      });
      if (remote && remote.id) {
        const current = getLocalDocuments();
        saveLocalDocuments([remote, ...current.filter((d) => d.id !== remote.id)]);
        return remote;
      }
    } catch {
      // Fallback for offline or local preview
    }

    // Convert file to local preview dataUrl
    const dataUrl = await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

    const localDoc: PatientDocument = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      title: docTitle,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
      downloadUrl: dataUrl,
      dataUrl,
    };

    const current = getLocalDocuments();
    saveLocalDocuments([localDoc, ...current]);
    return localDoc;
  },

  async delete(id: string): Promise<void> {
    try {
      const route = patientRoutes.DeleteDocument(id);
      await apiRequest<void>(route.url, { method: route.method });
    } catch {
      // Local fallback removal even if backend call fails
    }
    const current = getLocalDocuments();
    const filtered = current.filter((doc) => doc.id !== id);
    saveLocalDocuments(filtered);
  },
};

