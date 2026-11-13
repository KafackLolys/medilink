"use client";

import { adminService, type AdminAccount, type DoctorVerificationStatus, type ManagedAccountStatus, type ManagedRole } from "@/services/admin-service";
import { ApiError } from "@/services/http";
import { useCallback, useEffect, useState, type FormEvent } from "react";

const PAGE_SIZE = 10;

const statusLabels: Record<ManagedAccountStatus, string> = {
  active: "Actif",
  pending: "En attente",
  suspended: "Suspendu",
  deleted: "Supprimé",
};

const verificationLabels: Record<DoctorVerificationStatus, string> = {
  pending: "En attente",
  verified: "Vérifié",
  rejected: "Refusé",
  suspended: "Suspendu",
};

interface AccountEdit {
  status: ManagedAccountStatus;
  emailVerified: boolean;
  verificationStatus: DoctorVerificationStatus;
}

interface AdminForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function messageFrom(error: unknown): string {
  if (error instanceof ApiError || error instanceof Error) return error.message;
  return "Une erreur est survenue. Veuillez réessayer.";
}

export default function AdminPage() {
  const [role, setRole] = useState<ManagedRole>("patient");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [edits, setEdits] = useState<Record<string, AccountEdit>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<AdminForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.listAccounts(role, page, PAGE_SIZE, query);
      setAccounts(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setEdits(
        Object.fromEntries(
          result.items.map((account) => [
            account.id,
            {
              // A historical invalid users.status="verified" must not be passed
              // to the status endpoint. Show its actionable normal value instead.
              status: (account.status as string) === "verified"
                ? (account.verificationStatus === "verified" ? "active" : "pending")
                : account.status,
              emailVerified: account.emailVerified,
              verificationStatus: account.verificationStatus ?? "pending",
            },
          ]),
        ),
      );
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setLoading(false);
    }
  }, [page, query, role]);

  useEffect(() => {
    void Promise.resolve().then(loadAccounts);
  }, [loadAccounts]);

  function updateEdit(id: string, values: Partial<AccountEdit>) {
    setEdits((current) => ({
      ...current,
      [id]: { ...current[id], ...values },
    }));
  }

  async function saveAccount(account: AdminAccount) {
    const edit = edits[account.id];
    if (!edit) return;
    setSavingId(account.id);
    setError(null);
    setNotice(null);
    try {
      if (edit.status !== account.status) {
        await adminService.updateStatus(account.id, edit.status);
      }
      if (account.role === "patient" && edit.emailVerified !== account.emailVerified) {
        await adminService.updateVerification(account.id, {
          emailVerified: edit.emailVerified,
        });
      } else if (
        account.role === "doctor" &&
        (edit.verificationStatus !== account.verificationStatus ||
          ((account.status as string) === "verified" && edit.verificationStatus === "verified"))
      ) {
        await adminService.updateVerification(account.id, {
          verificationStatus: edit.verificationStatus,
        });
      }
      setNotice("Les modifications du compte ont été enregistrées.");
      await loadAccounts();
    } catch (cause) {
      setError(messageFrom(cause));
      await loadAccounts();
    } finally {
      setSavingId(null);
    }
  }

  async function createAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError(null);
    setNotice(null);
    try {
      await adminService.createAdmin(form);
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setNotice("Le compte administrateur a été créé. Transmettez ses identifiants de façon sécurisée.");
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setCreating(false);
    }
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">Administration</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Comptes de la plateforme</h1>
        <p className="mt-2 max-w-3xl text-muted">Consultez les patients et médecins, gérez leur accès et leur vérification, et créez de nouveaux comptes administrateurs.</p>
      </header>

      {error && <p role="alert" className="rounded-2xl bg-danger/10 p-4 text-sm font-medium text-danger">{error}</p>}
      {notice && <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{notice}</p>}

      <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7" aria-labelledby="accounts-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="accounts-heading" className="text-xl font-bold text-ink">Patients et médecins</h2>
            <p className="mt-1 text-sm text-muted">{total} compte{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="account-role">Type de compte</label>
            <select
              id="account-role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value as ManagedRole);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="patient">Patients</option>
              <option value="doctor">Médecins</option>
            </select>
            <form onSubmit={applySearch} className="flex min-w-0">
              <label className="sr-only" htmlFor="account-search">Rechercher un compte</label>
              <input
                id="account-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nom, e-mail, téléphone"
                className="h-11 min-w-0 rounded-l-xl border border-r-0 border-slate-200 px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 sm:w-64"
              />
              <button type="submit" className="rounded-r-xl bg-primary px-4 text-sm font-bold text-white hover:bg-blue-700">Rechercher</button>
            </form>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-muted">
                <th className="px-3 py-3 font-semibold">Compte</th>
                <th className="px-3 py-3 font-semibold">Statut</th>
                <th className="px-3 py-3 font-semibold">{role === "patient" ? "E-mail vérifié" : "Vérification professionnelle"}</th>
                <th className="px-3 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((account) => {
                const edit = edits[account.id];
                return (
                  <tr key={account.id} className="align-top">
                    <td className="px-3 py-4">
                      <p className="font-bold text-ink">{[account.firstName, account.lastName].filter(Boolean).join(" ") || "Sans nom"}</p>
                      <p className="mt-1 text-muted">{account.email ?? "E-mail non renseigné"}</p>
                      {account.phone && <p className="mt-0.5 text-xs text-muted">{account.phone}</p>}
                    </td>
                    <td className="px-3 py-4">
                      <label className="sr-only" htmlFor={`status-${account.id}`}>Statut du compte</label>
                      <select
                        id={`status-${account.id}`}
                        value={edit?.status ?? account.status}
                        onChange={(event) => updateEdit(account.id, { status: event.target.value as ManagedAccountStatus })}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:border-primary"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-4">
                      {role === "patient" ? (
                        <label className="inline-flex items-center gap-2 font-medium text-ink">
                          <input
                            type="checkbox"
                            checked={edit?.emailVerified ?? account.emailVerified}
                            onChange={(event) => updateEdit(account.id, { emailVerified: event.target.checked })}
                            className="size-4 accent-primary"
                          />
                          {edit?.emailVerified ?? account.emailVerified ? "Vérifié" : "Non vérifié"}
                        </label>
                      ) : (
                        <>
                          <label className="sr-only" htmlFor={`verification-${account.id}`}>Vérification professionnelle</label>
                          <select
                            id={`verification-${account.id}`}
                            value={edit?.verificationStatus ?? account.verificationStatus ?? "pending"}
                            onChange={(event) => updateEdit(account.id, { verificationStatus: event.target.value as DoctorVerificationStatus })}
                            className="h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:border-primary"
                          >
                            {Object.entries(verificationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                          </select>
                        </>
                      )}
                    </td>
                    <td className="px-3 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => void saveAccount(account)}
                        disabled={savingId === account.id}
                        className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingId === account.id ? "Enregistrement…" : "Enregistrer"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!loading && accounts.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-10 text-center text-muted">Aucun compte ne correspond à cette recherche.</td></tr>
              )}
              {loading && (
                <tr><td colSpan={4} className="px-3 py-10 text-center text-muted">Chargement des comptes…</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-sm text-muted">Page {page}{totalPages ? ` sur ${totalPages}` : ""}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1 || loading} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-50">Précédent</button>
            <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages || loading} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-50">Suivant</button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7" aria-labelledby="create-admin-heading">
        <h2 id="create-admin-heading" className="text-xl font-bold text-ink">Ajouter un administrateur</h2>
        <p className="mt-1 text-sm text-muted">Le compte sera actif dès sa création. Transmettez le mot de passe provisoire par un canal sécurisé.</p>
        <form onSubmit={createAdmin} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Prénom
            <input required autoComplete="given-name" value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} className="h-11 rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Nom
            <input required autoComplete="family-name" value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} className="h-11 rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Adresse e-mail
            <input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="h-11 rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-ink">
            Mot de passe provisoire
            <input required type="password" minLength={8} autoComplete="new-password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="h-11 rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          <button type="submit" disabled={creating} className="h-11 rounded-xl bg-primary px-5 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 sm:justify-self-start">
            {creating ? "Création…" : "Créer le compte administrateur"}
          </button>
        </form>
      </section>
    </div>
  );
}
