"use client";

import { ConfirmDialog } from "@/components/custum/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  documentTypeColors,
  documentTypeLabels,
  patientDocumentService,
  type PatientDocument,
  type PatientDocumentType,
} from "@/services/patient-document-service";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileIcon,
  FileSpreadsheet,
  FileText,
  Filter,
  HardDrive,
  ImageIcon,
  Pill,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

const PAGE_SIZE = 6;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

function formatSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "Taille inconnue";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "Date non renseignée";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "Date non renseignée";
  }
}

function getCategoryIcon(type: PatientDocumentType) {
  switch (type) {
    case "prescription":
      return Pill;
    case "lab_result":
      return Activity;
    case "medical_report":
      return FileText;
    case "imaging":
      return ImageIcon;
    default:
      return FileSpreadsheet;
  }
}

function getFileExtensionBadge(filename: string): string {
  const ext = filename.split(".").pop()?.toUpperCase() ?? "DOC";
  return ext.slice(0, 4);
}

interface PatientDocumentsManagerProps {
  initialDocuments?: PatientDocument[];
  showHeader?: boolean;
}

export function PatientDocumentsManager({
  initialDocuments,
  showHeader = true,
}: PatientDocumentsManagerProps) {
  const [documents, setDocuments] = useState<PatientDocument[]>(initialDocuments ?? []);
  const [loading, setLoading] = useState(!initialDocuments);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<PatientDocumentType>("prescription");
  const [customTitle, setCustomTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | PatientDocumentType>("all");
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<PatientDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputId = useId();
  const typeSelectId = useId();

  // Load documents
  const loadDocuments = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await patientDocumentService.list();
      setDocuments(data);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Impossible de charger vos documents.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!initialDocuments) {
      void loadDocuments();
    }
  }, [initialDocuments, loadDocuments]);

  // Upload handler
  async function handleFileSelected(file?: File) {
    if (!file) return;
    setError(null);
    setUploadSuccess(null);

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      setError("Format invalide. Formats acceptés : PDF, JPEG, PNG, WEBP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Le fichier dépasse la taille maximale autorisée de 10 Mo.");
      return;
    }

    setUploading(true);
    try {
      const newDoc = await patientDocumentService.upload(
        file,
        selectedType,
        customTitle.trim() || undefined,
      );
      setDocuments((current) => [newDoc, ...current.filter((d) => d.id !== newDoc.id)]);
      setCustomTitle("");
      setPage(1);
      setUploadSuccess(`« ${newDoc.title} » a été ajouté avec succès.`);
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Échec lors de l'importation du document.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    void handleFileSelected(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    void handleFileSelected(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
  }

  // Delete handler
  async function handleDeleteDocument(id: string) {
    setError(null);
    try {
      await patientDocumentService.delete(id);
      setDocuments((current) => {
        const next = current.filter((doc) => doc.id !== id);
        const nextTotalPages = Math.ceil(next.length / PAGE_SIZE);
        setPage((currPage) => Math.min(currPage, Math.max(1, nextTotalPages)));
        return next;
      });
      if (previewDocument?.id === id) {
        setPreviewDocument(null);
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Impossible de supprimer ce document.",
      );
    }
  }

  // Filter & Search
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesType =
        typeFilter === "all" || doc.type === typeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.filename.toLowerCase().includes(q) ||
        documentTypeLabels[doc.type]?.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [documents, typeFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDocuments.slice(start, start + PAGE_SIZE);
  }, [filteredDocuments, currentPage]);

  // Counts by category
  const countsByType = useMemo(() => {
    const counts: Record<string, number> = { all: documents.length };
    for (const doc of documents) {
      counts[doc.type] = (counts[doc.type] ?? 0) + 1;
    }
    return counts;
  }, [documents]);

  return (
    <div className="space-y-6">
      {showHeader && (
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-night sm:text-3xl">
              Mes documents médicaux
            </h1>
            <p className="mt-1 text-sm text-muted sm:text-base">
              Importez, consultez et conservez vos ordonnances, bilans et comptes-rendus en toute sécurité.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadDocuments(true)}
            disabled={loading || refreshing}
            className="self-start rounded-xl sm:self-auto"
          >
            <RefreshCw
              className={`size-4 ${refreshing ? "animate-spin" : ""}`}
              aria-hidden
            />
            Actualiser
          </Button>
        </header>
      )}

      {/* Upload Section */}
      <section
        aria-labelledby="import-title"
        className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_-16px_rgba(30,41,59,.12)] sm:p-6"
      >
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Upload className="size-5" aria-hidden />
          </span>
          <div>
            <h2 id="import-title" className="text-base font-bold text-night sm:text-lg">
              Ajouter un nouveau document
            </h2>
            <p className="text-xs text-muted sm:text-sm">
              Sélectionnez le type de document puis choisissez ou glissez votre fichier.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={typeSelectId}
              className="text-xs font-bold text-ink sm:text-sm"
            >
              Catégorie de document
            </label>
            <select
              id={typeSelectId}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as PatientDocumentType)}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-ink outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            >
              {(Object.keys(documentTypeLabels) as PatientDocumentType[]).map((key) => (
                <option key={key} value={key}>
                  {documentTypeLabels[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={titleInputId}
              className="text-xs font-bold text-ink sm:text-sm"
            >
              Titre personnalisé (facultatif)
            </label>
            <Input
              id={titleInputId}
              type="text"
              placeholder="Ex : Bilan sanguin annuel, Ordonnance Dr. Nguema..."
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="mt-1.5 h-11 rounded-xl bg-slate-50/50 text-sm focus:bg-white"
            />
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
            isDragOver
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50/80"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="sr-only"
            id="patient-file-upload"
            aria-label="Sélectionner un fichier médical"
          />

          <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Plus className="size-6" aria-hidden />
          </span>

          <p className="mt-3 text-sm font-bold text-night">
            Glissez-déposez votre document ici, ou{" "}
            <label
              htmlFor="patient-file-upload"
              className="cursor-pointer text-primary underline hover:text-blue-700"
            >
              parcourez vos fichiers
            </label>
          </p>

          <p className="mt-1 text-xs text-muted">
            Formats acceptés : PDF, JPEG, PNG, WEBP · Taille maximale : 10 Mo
          </p>

          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-4 h-10 rounded-xl px-5 text-sm font-bold"
          >
            <Upload className="size-4" aria-hidden />
            {uploading ? "Importation en cours…" : "Sélectionner un fichier"}
          </Button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-800"
              aria-label="Fermer le message d'erreur"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        )}

        {uploadSuccess && (
          <div
            role="status"
            className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-semibold text-emerald-800"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" aria-hidden />
              {uploadSuccess}
            </span>
            <button
              type="button"
              onClick={() => setUploadSuccess(null)}
              className="text-emerald-600 hover:text-emerald-900"
              aria-label="Fermer le message de succès"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        )}
      </section>

      {/* Filter and Search Bar */}
      <section
        aria-label="Filtres des documents"
        className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Rechercher par titre ou nom de fichier..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl pl-9 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-ink"
                aria-label="Effacer la recherche"
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <Filter className="size-3.5" aria-hidden />
            <span>{filteredDocuments.length} document{filteredDocuments.length > 1 ? "s" : ""} trouvé{filteredDocuments.length > 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          <button
            type="button"
            onClick={() => {
              setTypeFilter("all");
              setPage(1);
            }}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              typeFilter === "all"
                ? "bg-primary text-white shadow-xs"
                : "bg-slate-100 text-ink hover:bg-slate-200/70"
            }`}
          >
            Tous
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                typeFilter === "all"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {countsByType.all ?? 0}
            </span>
          </button>

          {(Object.keys(documentTypeLabels) as PatientDocumentType[]).map((typeKey) => {
            const count = countsByType[typeKey] ?? 0;
            const isSelected = typeFilter === typeKey;
            return (
              <button
                key={typeKey}
                type="button"
                onClick={() => {
                  setTypeFilter(typeKey);
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  isSelected
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 text-ink hover:bg-slate-200/70"
                }`}
              >
                {documentTypeLabels[typeKey]}
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Cards List Section with Pagination */}
      <section aria-label="Liste des documents médicaux" className="space-y-4">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="size-12 rounded-2xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded-md bg-slate-100" />
                    <div className="h-3 w-1/2 rounded-md bg-slate-100" />
                  </div>
                </div>
                <div className="mt-4 h-8 rounded-xl bg-slate-50" />
              </div>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <span className="grid size-14 place-items-center rounded-3xl bg-slate-100 text-slate-400">
              <FileIcon className="size-7" aria-hidden />
            </span>
            <h3 className="mt-4 text-base font-bold text-night">
              {searchQuery || typeFilter !== "all"
                ? "Aucun document ne correspond à vos filtres"
                : "Vous n’avez aucun document médical pour le moment"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted">
              {searchQuery || typeFilter !== "all"
                ? "Modifiez vos termes de recherche ou réinitialisez le filtre de catégorie."
                : "Importez vos ordonnances, bilans ou comptes-rendus afin de les retrouver facilement à tout moment."}
            </p>
            {searchQuery || typeFilter !== "all" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setPage(1);
                }}
                className="mt-4 rounded-xl"
              >
                Réinitialiser les filtres
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 rounded-xl"
              >
                <Plus className="size-4" aria-hidden /> Importer mon premier document
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedDocuments.map((doc) => {
                const IconComponent = getCategoryIcon(doc.type);
                const colorConfig = documentTypeColors[doc.type] ?? documentTypeColors.other;
                const ext = getFileExtensionBadge(doc.filename);
                const viewUrl = doc.downloadUrl || doc.dataUrl;

                return (
                  <li
                    key={doc.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-10px_rgba(30,41,59,.08)] transition hover:border-blue-200 hover:shadow-[0_8px_30px_-12px_rgba(30,41,59,.16)]"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`grid size-12 shrink-0 place-items-center rounded-2xl ${colorConfig.iconBg}`}
                        >
                          <IconComponent className="size-6" aria-hidden />
                        </span>
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${colorConfig.badge}`}
                          >
                            {documentTypeLabels[doc.type] ?? "Document"}
                          </span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-extrabold text-slate-600">
                            {ext}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="mt-3.5">
                        <h3
                          className="line-clamp-2 text-base font-extrabold text-night group-hover:text-primary transition-colors"
                          title={doc.title}
                        >
                          {doc.title}
                        </h3>
                        <p
                          className="mt-1 truncate text-xs text-muted"
                          title={doc.filename}
                        >
                          {doc.filename}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-slate-400" aria-hidden />
                          {formatDate(doc.uploadedAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <HardDrive className="size-3.5 text-slate-400" aria-hidden />
                          {formatSize(doc.sizeBytes)}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => setPreviewDocument(doc)}
                        className="h-9 flex-1 rounded-xl text-xs font-bold"
                      >
                        <Eye className="size-3.5" aria-hidden />
                        Consulter
                      </Button>

                      {viewUrl ? (
                        <a
                          href={viewUrl}
                          download={doc.filename}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink transition hover:bg-slate-50 hover:text-primary"
                          title="Télécharger le fichier"
                          aria-label={`Télécharger ${doc.filename}`}
                        >
                          <Download className="size-4" aria-hidden />
                        </a>
                      ) : null}

                      {/* Shadcn Confirm Dialog for Deletion */}
                      <ConfirmDialog
                        trigger={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="size-9 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            aria-label={`Supprimer ${doc.title}`}
                            title="Supprimer ce document"
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </Button>
                        }
                        title="Supprimer ce document ?"
                        description={`« ${doc.title} » sera définitivement supprimé de votre dossier médical. Cette action est irréversible.`}
                        confirmLabel="Supprimer définitivement"
                        onConfirm={() => handleDeleteDocument(doc.id)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav
                aria-label="Pagination des documents médicaux"
                className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs sm:flex-row"
              >
                <p className="text-xs font-semibold text-muted">
                  Page <span className="text-ink font-bold">{currentPage}</span> sur{" "}
                  <span className="text-ink font-bold">{totalPages}</span> ·{" "}
                  {filteredDocuments.length} document{filteredDocuments.length > 1 ? "s" : ""}
                </p>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((curr) => Math.max(1, curr - 1))}
                    className="h-8 rounded-lg px-2.5 text-xs font-semibold"
                  >
                    Précédent
                  </Button>

                  {/* Numbered Page Buttons */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    // Show first, last, current, and neighbours
                    if (
                      p === 1 ||
                      p === totalPages ||
                      (p >= currentPage - 1 && p <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          aria-current={p === currentPage ? "page" : undefined}
                          className={`size-8 rounded-lg text-xs font-bold transition ${
                            p === currentPage
                              ? "bg-primary text-white shadow-xs"
                              : "border border-slate-200 text-ink hover:bg-slate-100"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }
                    if (p === currentPage - 2 || p === currentPage + 2) {
                      return (
                        <span key={p} className="px-1 text-xs text-muted">
                          …
                        </span>
                      );
                    }
                    return null;
                  })}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((curr) => Math.min(totalPages, curr + 1))}
                    className="h-8 rounded-lg px-2.5 text-xs font-semibold"
                  >
                    Suivant
                  </Button>
                </div>
              </nav>
            )}
          </>
        )}
      </section>

      {/* Consultation Modal (Shadcn Dialog) */}
      <Dialog
        open={Boolean(previewDocument)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPreviewDocument(null);
        }}
      >
        {previewDocument && (
          <DialogContent className="max-w-xl sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-6">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                    documentTypeColors[previewDocument.type]?.badge ?? "bg-slate-100 text-slate-700"
                  }`}
                >
                  {documentTypeLabels[previewDocument.type]}
                </span>
                <span className="text-xs text-muted">
                  Ajouté le {formatDate(previewDocument.uploadedAt)}
                </span>
              </div>
              <DialogTitle className="text-xl font-extrabold text-night mt-1">
                {previewDocument.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted">
                Fichier : {previewDocument.filename} ({formatSize(previewDocument.sizeBytes)})
              </DialogDescription>
            </DialogHeader>

            {/* Viewer body */}
            <div className="my-4 flex-1 overflow-auto rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-center min-h-60 max-h-[50vh] flex items-center justify-center">
              {previewDocument.mimeType.startsWith("image/") && (previewDocument.downloadUrl || previewDocument.dataUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewDocument.downloadUrl || previewDocument.dataUrl || ""}
                  alt={previewDocument.title}
                  className="max-h-[46vh] max-w-full rounded-xl object-contain shadow-xs"
                />
              ) : previewDocument.mimeType === "application/pdf" && (previewDocument.downloadUrl || previewDocument.dataUrl) ? (
                <iframe
                  src={previewDocument.downloadUrl || previewDocument.dataUrl || ""}
                  title={previewDocument.title}
                  className="h-[46vh] w-full rounded-xl border-0 bg-white"
                />
              ) : (
                <div className="space-y-3 py-6">
                  <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <FileText className="size-8" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-night">
                      Aperçu intégré non disponible pour ce type de fichier
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Vous pouvez ouvrir ou télécharger le document pour le consulter dans votre visionneuse habituelle.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between items-center w-full">
              <div className="flex gap-2 w-full sm:w-auto">
                <ConfirmDialog
                  trigger={
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="rounded-xl w-full sm:w-auto"
                    >
                      <Trash2 className="size-4" aria-hidden /> Supprimer
                    </Button>
                  }
                  title="Supprimer ce document ?"
                  description={`« ${previewDocument.title} » sera définitivement supprimé.`}
                  confirmLabel="Supprimer définitivement"
                  onConfirm={async () => {
                    await handleDeleteDocument(previewDocument.id);
                  }}
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                {previewDocument.downloadUrl || previewDocument.dataUrl ? (
                  <>
                    <a
                      href={previewDocument.downloadUrl || previewDocument.dataUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-ink hover:bg-slate-50 hover:text-primary"
                    >
                      <ExternalLink className="size-3.5" aria-hidden /> Nouvel onglet
                    </a>
                    <a
                      href={previewDocument.downloadUrl || previewDocument.dataUrl || "#"}
                      download={previewDocument.filename}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      <Download className="size-3.5" aria-hidden /> Télécharger
                    </a>
                  </>
                ) : null}
                <DialogClose render={<Button variant="outline" className="rounded-xl">Fermer</Button>} />
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

