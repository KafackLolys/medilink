"use client";

import { ConfirmDialog } from "@/components/custum/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  doctorService,
  type DoctorVerificationDocument,
  type ProfessionalDocumentType,
} from "@/services/doctor-service";
import { Download, FileCheck2, FileText, Trash2, Upload } from "lucide-react";
import { useMemo, useRef, useState, type ChangeEvent } from "react";

const PAGE_SIZE = 6;

const documentLabels: Record<ProfessionalDocumentType, string> = {
  medical_license: "Inscription à l’Ordre des médecins",
  medical_degree: "Diplôme médical",
  identity_document: "Pièce d’identité",
  other: "Autre document",
};

const statusLabels = {
  pending: "En attente",
  approved: "Vérifié",
  rejected: "Refusé",
} as const;

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
} as const;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function DoctorDocumentsManager({
  initialDocuments,
}: {
  initialDocuments: DoctorVerificationDocument[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [type, setType] = useState<ProfessionalDocumentType>("medical_license");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const fileInput = useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(documents.length / PAGE_SIZE);
  const paginatedDocuments = useMemo(
    () => documents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [documents, page],
  );

  async function uploadDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    setError(null);
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      setError("Choisissez un fichier PDF, JPEG, PNG ou WEBP.");
      return;
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      setError("Le fichier doit peser entre 1 octet et 10 Mo.");
      return;
    }

    setUploading(true);
    try {
      const document = await doctorService.uploadMyDocument(file, type);
      setDocuments((current) => [document, ...current]);
      setPage(1);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Impossible d’importer ce document.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteDocument(id: string) {
    await doctorService.deleteMyDocument(id);
    setDocuments((current) => {
      const next = current.filter((document) => document.id !== id);
      const nextPages = Math.ceil(next.length / PAGE_SIZE);
      setPage((currentPage) => Math.min(currentPage, Math.max(1, nextPages)));
      return next;
    });
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <label className="text-sm font-semibold text-ink">
          Type de justificatif
          <select
            value={type}
            onChange={(event) => setType(event.target.value as ProfessionalDocumentType)}
            className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-normal"
          >
            {Object.entries(documentLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <div>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            onChange={(event) => void uploadDocument(event)}
            className="sr-only"
            aria-label="Importer un document justificatif"
          />
          <Button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="h-11 w-full rounded-xl px-4 sm:w-auto"
          >
            <Upload className="size-4" aria-hidden />
            {uploading ? "Importation…" : "Importer un document"}
          </Button>
        </div>
        <p className="text-xs text-muted sm:col-span-2">
          PDF, JPEG, PNG ou WEBP · 10 Mo maximum. Les liens de consultation sont privés et temporaires.
        </p>
      </div>

      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {documents.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-4 text-sm text-muted">
          Aucun document justificatif n’est associé à votre dossier.
        </p>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedDocuments.map((document) => {
              const status = document.status;
              return (
                <li key={document.id} className="flex min-w-0 flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <FileText className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-bold text-ink">
                        {documentLabels[document.name] ?? "Document justificatif"}
                      </h3>
                      <p className="mt-1 truncate text-xs text-muted" title={document.filename}>
                        {document.filename}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[status]}`}>
                      {statusLabels[status]}
                    </span>
                    <span className="text-xs text-muted">{formatSize(document.sizeBytes)}</span>
                  </div>
                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                    {document.downloadUrl ? (
                      <a
                        href={document.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 text-xs font-bold text-primary hover:bg-primary/15"
                      >
                        <Download className="size-4" aria-hidden /> Consulter
                      </a>
                    ) : (
                      <span className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 text-xs font-semibold text-muted">
                        <FileCheck2 className="size-4" aria-hidden /> Lien indisponible
                      </span>
                    )}
                    <ConfirmDialog
                      trigger={
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          aria-label={`Supprimer ${document.filename}`}
                          title="Supprimer le document"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      }
                      title="Supprimer ce document ?"
                      description={`« ${document.filename} » sera supprimé définitivement de votre dossier professionnel.`}
                      confirmLabel="Supprimer"
                      onConfirm={() => deleteDocument(document.id)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <nav aria-label="Pagination des documents" className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted">
                Page {page} sur {totalPages} · {documents.length} document{documents.length === 1 ? "" : "s"}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Précédent
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Suivant
                </Button>
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
