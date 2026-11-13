"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { BadgeCheck, CalendarClock, CheckCircle2, MessageCircle, Send, Stethoscope } from "lucide-react";
import { ConfirmDialog } from "@/components/custum/confirm-dialog";
import { needService, type PatientProposal, type NeedStatus } from "@/services/need-service";
import { messageService, type ConversationMessage } from "@/services/message-service";
import { useAuthSession } from "@/hooks/use-auth-session";

type Props = { needId: string; status: NeedStatus; onAccepted: () => void };
const statusLabel: Record<PatientProposal["status"], string> = {
  sent: "Envoyée", pending: "En attente", accepted: "Acceptée", rejected: "Non retenue",
  expired: "Expirée", cancelled: "Annulée",
};
const formatDate = (value: string) => new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium", timeStyle: "short",
}).format(new Date(value));

export function ProposalsPanel({ needId, status, onAccepted }: Props) {
  const session = useAuthSession();
  const [proposals, setProposals] = useState<PatientProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      setProposals((await needService.patientProposals(needId)).items);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de charger les propositions.");
    } finally {
      setLoading(false);
    }
  }, [needId]);

  useEffect(() => { void load(); }, [load]);

  const active = proposals.find((p) => p.id === selected) ?? null;
  useEffect(() => {
    if (!active || !["pending", "sent", "accepted"].includes(active.status)) return;
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) { setChatLoading(true); setChatError(null); setMessages([]); }
    });
    messageService.listMessages(active.conversationId)
      .then((result) => { if (!cancelled) setMessages(result.items); })
      .catch((cause: unknown) => { if (!cancelled) setChatError(cause instanceof Error ? cause.message : "Conversation indisponible."); })
      .finally(() => { if (!cancelled) setChatLoading(false); });
    return () => { cancelled = true; };
  }, [active?.id, active?.conversationId, active?.status]);

  async function accept(proposalId: string) {
    await needService.acceptPatientProposal(needId, proposalId);
    setSelected(proposalId);
    await load();
    onAccepted();
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active || !draft.trim()) return;
    setSending(true);
    setChatError(null);
    try {
      const item = await messageService.sendMessage(active.conversationId, draft.trim());
      setMessages((current) => [...current, item]);
      setDraft("");
    } catch (cause) {
      setChatError(cause instanceof Error ? cause.message : "Impossible d'envoyer le message.");
    } finally { setSending(false); }
  }

  const chosen = proposals.some((p) => p.status === "accepted") || status === "appointment_confirmed";
  return (
    <aside className="min-w-0 space-y-4" aria-labelledby="proposal-heading">
      <section className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="proposal-heading" className="text-xl font-extrabold tracking-tight text-night">Médecins intéressés</h2>
            <p className="mt-1 text-sm text-muted">Comparez leurs propositions, échangez et choisissez un médecin.</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{proposals.length}</span>
        </div>
        {error && <div role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error} <button type="button" className="ml-2 underline" onClick={() => void load()}>Réessayer</button></div>}
        {loading ? <p role="status" className="mt-5 text-sm text-muted">Chargement des propositions…</p> : proposals.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-surface p-5 text-sm text-muted">Aucune proposition reçue pour le moment. Les médecins intéressés apparaîtront ici.</div>
        ) : (
          <ul className="mt-5 space-y-3">
            {proposals.map((proposal) => {
              const isActive = ["pending", "sent", "accepted"].includes(proposal.status);
              const canAccept = !chosen && isActive && proposal.status !== "accepted";
              return <li key={proposal.id} className={`rounded-2xl border p-4 ${proposal.status === "accepted" ? "border-emerald-300 bg-emerald-50/40" : "border-slate-200"}`}>
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Stethoscope className="size-5" aria-hidden /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-ink">{proposal.doctor.name}</p>
                    <p className="text-xs text-muted">{proposal.doctor.specialty}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-700"><BadgeCheck className="size-3.5" aria-hidden /> Médecin vérifié</span>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${proposal.status === "accepted" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{statusLabel[proposal.status]}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <p className="rounded-xl bg-surface p-3"><span className="block text-xs text-muted">Honoraires proposés</span><strong>{proposal.fee.toLocaleString("fr-FR")} {proposal.currency}</strong></p>
                  <p className="rounded-xl bg-surface p-3"><span className="block text-xs text-muted">Rendez-vous proposé</span><strong>{proposal.proposedAppointmentAt ? formatDate(proposal.proposedAppointmentAt) : "À confirmer"}</strong></p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">{proposal.message}</p>
                <p className="mt-2 text-xs text-muted">{proposal.consultationMode === "home" ? "À domicile" : "Téléconsultation"} · Envoyée le {formatDate(proposal.proposedAt)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {isActive && <button type="button" onClick={() => { setSelected(proposal.id); setDraft(""); }} className="inline-flex h-10 items-center gap-2 rounded-full border border-primary/20 bg-white px-4 text-sm font-bold text-primary hover:bg-blue-50"><MessageCircle className="size-4" aria-hidden /> {selected === proposal.id ? "Conversation ouverte" : "Écrire"}</button>}
                  {canAccept && <ConfirmDialog trigger={<button type="button" className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-white"><CheckCircle2 className="size-4" aria-hidden /> Accepter</button>} title={`Accepter la proposition de ${proposal.doctor.name} ?`} description="En confirmant, ce médecin sera sélectionné pour votre demande. Toutes les autres propositions seront automatiquement refusées et ne pourront plus être acceptées. Un rendez-vous sera créé à la date proposée, sous réserve de disponibilité." confirmLabel="Confirmer mon choix" onConfirm={() => accept(proposal.id)} />}
                  <Link href={`/patient/medecins/${encodeURIComponent(proposal.doctor.id)}`} className="inline-flex h-10 items-center rounded-full bg-surface px-4 text-sm font-semibold text-ink">Voir le profil</Link>
                </div>
              </li>;
            })}
          </ul>
        )}
      </section>
      {active && ["pending", "sent", "accepted"].includes(active.status) && (
        <section aria-label={`Conversation avec ${active.doctor.name}`} className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] sm:p-6">
          <div className="flex items-center gap-2"><MessageCircle className="size-5 text-primary" /><h3 className="font-extrabold text-night">Écrire à {active.doctor.name}</h3></div>
          <p className="mt-1 text-xs text-muted">Conversation privée liée au médecin ayant proposé ses services.</p>
          {chatError && <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{chatError}</p>}
          <div className="mt-4 max-h-80 min-h-32 space-y-2 overflow-y-auto rounded-2xl bg-surface p-3" aria-live="polite">
            {chatLoading ? <p className="text-sm text-muted">Chargement des messages…</p> : messages.length === 0 ? <p className="text-sm text-muted">Aucun message. Écrivez au médecin pour échanger sur sa proposition.</p> : messages.map((message) => (
              <div key={message.id} className={`flex ${message.senderUserId === session?.user.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${message.senderUserId === session?.user.id ? "bg-primary text-white" : "bg-white text-ink"}`}>
                  <p className="whitespace-pre-wrap break-words">{message.body}</p><p className="mt-1 text-[10px] opacity-70">{formatDate(message.sentAt)}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="mt-3 flex gap-2">
            <label className="sr-only" htmlFor="patient-proposal-message">Votre message</label>
            <textarea id="patient-proposal-message" rows={2} maxLength={4000} required value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Votre message au médecin…" className="min-w-0 flex-1 resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
            <button type="submit" disabled={sending || !draft.trim() || chatLoading} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white disabled:opacity-50"><Send className="size-4" aria-hidden /> Envoyer</button>
          </form>
        </section>
      )}
      {chosen && <div role="status" className="flex items-start gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800"><CalendarClock className="mt-0.5 size-5 shrink-0" aria-hidden />Un médecin a été choisi. Les autres propositions ont été automatiquement refusées.</div>}
    </aside>
  );
}
