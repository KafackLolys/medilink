"use client";

import { PATIENT_PROFILE_MESSAGES } from "@/lib/patient-profile-data";
import { ArrowLeft, Bell, Check, MessageCircle, Send, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { registerWebPush, isWebPushConfigured } from "@/services/web-push";
import { ApiError } from "@/services/http";

type Message = { id: string; text: string; from: "doctor" | "patient"; when: string };

const conversations = [
  {
    id: "doctor",
    name: PATIENT_PROFILE_MESSAGES[0].sender,
    preview: PATIENT_PROFILE_MESSAGES[0].text,
    when: PATIENT_PROFILE_MESSAGES[0].when,
    messages: [
      { id: "d1", text: "Bonjour, je vous confirme notre prochain rendez-vous.", from: "doctor", when: "Aujourd’hui, 10:30" },
      { id: "p1", text: "Merci Docteur, je serai disponible.", from: "patient", when: "Aujourd’hui, 10:42" },
      { id: "d2", text: "Parfait. N’hésitez pas à me signaler tout changement d’ici là.", from: "doctor", when: "Aujourd’hui, 11:05" },
    ] satisfies Message[],
  },
  {
    id: "support",
    name: PATIENT_PROFILE_MESSAGES[1].sender,
    preview: PATIENT_PROFILE_MESSAGES[1].text,
    when: PATIENT_PROFILE_MESSAGES[1].when,
    messages: [
      { id: "s1", text: PATIENT_PROFILE_MESSAGES[1].text, from: "doctor", when: PATIENT_PROFILE_MESSAGES[1].when },
    ] satisfies Message[],
  },
];

export default function PatientMessagesPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [tab, setTab] = useState<"messages" | "notifications">("messages");
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>(
    Object.fromEntries(conversations.map((conversation) => [conversation.id, conversation.messages])),
  );
  const [draft, setDraft] = useState("");
  const notifications = useNotifications(20);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushMessage, setPushMessage] = useState<string | null>(null);
  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0];
  const messages = messagesByConversation[selected.id] ?? selected.messages;

  useEffect(() => {
    void Promise.resolve().then(() => {
      if (new URLSearchParams(window.location.search).get("tab") === "notifications") {
        setTab("notifications");
      }
    });
  }, []);

  async function enablePush() {
    setPushLoading(true);
    setPushMessage(null);
    try {
      await registerWebPush();
      setPushMessage("Les notifications push sont activées sur cet appareil.");
    } catch (cause) {
      setPushMessage(
        cause instanceof ApiError || cause instanceof Error
          ? cause.message
          : "Impossible d’activer les notifications push.",
      );
    } finally {
      setPushLoading(false);
    }
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessagesByConversation((current) => ({
      ...current,
      [selected.id]: [
        ...(current[selected.id] ?? selected.messages),
        { id: `${selected.id}-${Date.now()}`, text, from: "patient", when: "À l’instant" },
      ],
    }));
    setDraft("");
  }

  return (
    <div className="space-y-6">
      <header>
        <Link href="/patient" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden /> Tableau de bord
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-night sm:text-4xl">Messages</h1>
        <p className="mt-2 text-lg text-muted">Échangez avec les médecins et l’équipe MedLink.</p>
      </header>

      <div role="tablist" aria-label="Messages et notifications" className="inline-flex rounded-xl bg-white p-1 shadow-sm">
        <button type="button" role="tab" aria-selected={tab === "messages"} onClick={() => setTab("messages")} className={`h-10 rounded-lg px-4 text-sm font-semibold ${tab === "messages" ? "bg-primary text-white" : "text-muted"}`}>Messages</button>
        <button type="button" role="tab" aria-selected={tab === "notifications"} onClick={() => setTab("notifications")} className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${tab === "notifications" ? "bg-primary text-white" : "text-muted"}`}><Bell className="size-4" aria-hidden />Notifications{notifications.unreadCount > 0 && <span className="rounded-full bg-danger px-1.5 text-xs text-white">{notifications.unreadCount}</span>}</button>
      </div>

      {tab === "notifications" ? (
        <div className="space-y-4">
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm" aria-label="Préférences de notification">
            <div>
              <p className="font-bold text-night">Notifications sur cet appareil</p>
              <p className="mt-1 text-sm text-muted">Activez les alertes web. Chaque navigateur ou appareil est enregistré séparément.</p>
            </div>
            <button type="button" onClick={() => void enablePush()} disabled={!isWebPushConfigured() || pushLoading} className="h-10 rounded-xl bg-primary px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{pushLoading ? "Activation…" : "Activer les notifications"}</button>
            {!isWebPushConfigured() && <p className="w-full text-xs text-amber-700">La configuration Firebase Web et la clé VAPID doivent être ajoutées à l’environnement du frontend.</p>}
            {pushMessage && <p role="status" className="w-full text-sm text-muted">{pushMessage}</p>}
          </section>
          <section className="divide-y divide-slate-100 rounded-3xl bg-white p-4 shadow-sm sm:p-5" aria-label="Notifications récentes">
            <div className="flex items-center justify-between gap-3 pb-3">
              <p className="text-sm text-muted">{notifications.unreadCount} notification(s) non lue(s)</p>
              <button type="button" onClick={() => void notifications.markAllRead()} disabled={notifications.unreadCount === 0 || notifications.loading} className="text-sm font-bold text-primary disabled:opacity-50">Tout marquer comme lu</button>
            </div>
            {notifications.error && <p role="alert" className="py-4 text-sm text-rose-700">{notifications.error}</p>}
            {notifications.loading ? (
              <p className="py-8 text-center text-sm text-muted">Chargement des notifications…</p>
            ) : notifications.items.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">Aucune notification pour le moment.</p>
            ) : notifications.items.map((notification) => {
              const read = Boolean(notification.readAt);
              return <article key={notification.id} className={`flex gap-3 py-4 last:pb-0 ${!read ? "bg-blue-50/40" : ""}`}>
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${read ? "bg-slate-100 text-muted" : "bg-blue-100 text-primary"}`}><Bell className="size-5" aria-hidden /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-night">{notification.title}</p>{!read && <span className="size-2 rounded-full bg-primary" aria-label="Non lue" />}</div>
                  <p className="mt-1 text-sm text-muted">{notification.body}</p>
                  <p className="mt-1 text-xs text-muted">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.createdAt))}</p>
                  {notification.targetUrl && <Link href={notification.targetUrl} onClick={() => !read && void notifications.markRead(notification.id)} className="mt-2 inline-block text-xs font-bold text-primary hover:underline">Ouvrir</Link>}
                </div>
                {!read && <button type="button" onClick={() => void notifications.markRead(notification.id)} aria-label={`Marquer comme lu : ${notification.title}`} className="shrink-0 text-muted hover:text-primary"><Check className="size-4" aria-hidden /></button>}
              </article>;
            })}
            <nav className="flex items-center justify-between pt-3" aria-label="Pagination des notifications">
              <span className="text-xs text-muted">Page {notifications.page}{notifications.totalPages ? ` sur ${notifications.totalPages}` : ""}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => notifications.goToPage(notifications.page - 1)} disabled={notifications.page <= 1 || notifications.loading} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-50">Précédent</button>
                <button type="button" onClick={() => notifications.goToPage(notifications.page + 1)} disabled={notifications.page >= notifications.totalPages || notifications.loading} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-50">Suivant</button>
              </div>
            </nav>
          </section>
        </div>
      ) : (
      <section className="grid min-h-[520px] overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] lg:grid-cols-[300px_1fr]" aria-label="Messagerie">
        <nav aria-label="Conversations" className="border-b border-slate-100 p-3 lg:border-b-0 lg:border-r">
          <h2 className="px-3 py-2 text-sm font-bold text-muted">VOS CONVERSATIONS</h2>
          <ul className="space-y-1">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <button type="button" onClick={() => setSelectedId(conversation.id)} aria-pressed={selected.id === conversation.id}
                  className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${selected.id === conversation.id ? "bg-primary/10" : "hover:bg-slate-50"}`}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-50 text-primary"><UserRound className="size-5" aria-hidden /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2"><span className="truncate font-bold text-ink">{conversation.name}</span><span className="shrink-0 text-xs text-muted">{conversation.when}</span></span>
                    <span className="mt-1 block truncate text-sm text-muted">{conversation.preview}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-h-[420px] min-w-0 flex-col">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <span className="grid size-10 place-items-center rounded-full bg-blue-50 text-primary"><UserRound className="size-5" aria-hidden /></span>
            <div><h2 className="font-bold text-ink">{selected.name}</h2><p className="text-sm text-muted">{selected.id === "doctor" ? "Médecin" : "Assistance MedLink"}</p></div>
          </div>

          <ol aria-live="polite" className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((message) => (
              <li key={message.id} className={`flex ${message.from === "patient" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.from === "patient" ? "rounded-br-md bg-primary text-white" : "rounded-bl-md bg-surface text-ink"}`}>
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                  <p className={`mt-1 text-right text-xs ${message.from === "patient" ? "text-white/75" : "text-muted"}`}>{message.when}</p>
                </div>
              </li>
            ))}
          </ol>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 p-4">
            <label htmlFor="message" className="sr-only">Votre message</label>
            <input id="message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Écrire un message…" autoComplete="off"
              className="h-12 min-w-0 flex-1 rounded-full border border-slate-200 px-5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
            <button type="submit" disabled={!draft.trim()} aria-label="Envoyer le message" className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              <Send className="size-5" aria-hidden />
            </button>
          </form>
        </div>
      </section>
      )}
      <p className="flex items-center gap-2 text-sm text-muted"><MessageCircle className="size-4 text-primary" aria-hidden />Ne partagez pas d’informations bancaires ou de codes confidentiels dans vos messages.</p>
    </div>
  );
}
