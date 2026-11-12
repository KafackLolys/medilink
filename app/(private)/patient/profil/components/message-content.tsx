"use client";

import {
  ArrowLeft,
  Bell,
  Check,
  MessageCircle,
  Send,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { useMessaging } from "@/hooks/use-messaging";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useNotificationStore } from "@/store/notification-store";

export function PatientMessagesContent() {
  const [tab, setTab] = useState<"messages" | "notifications">("messages");
  const [draft, setDraft] = useState("");
  const notifications = useNotifications(20);
  const messaging = useMessaging();
  const session = useAuthSession();
  const unreadMessagesCount = useNotificationStore(
    (state) => state.unreadMessagesCount,
  );

  useEffect(() => {
    void Promise.resolve().then(() => {
      if (
        new URLSearchParams(window.location.search).get("tab") ===
        "notifications"
      ) {
        setTab("notifications");
      }
    });
  }, []);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !messaging.selected) return;
    if (await messaging.send(text)) setDraft("");
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-night sm:text-4xl">
          Messages
        </h1>
        <p className="mt-2 text-lg text-muted">
          Échangez avec les médecins et l’équipe MedLink.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Messages et notifications"
        className="inline-flex rounded-xl bg-white p-1 shadow-sm"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "messages"}
          onClick={() => setTab("messages")}
          className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${tab === "messages" ? "bg-primary text-white" : "text-muted"}`}
        >
          Messages
          {unreadMessagesCount > 0 && (
            <span className="rounded-full bg-danger px-1.5 text-xs text-white">
              {unreadMessagesCount}
            </span>
          )}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "notifications"}
          onClick={() => setTab("notifications")}
          className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${tab === "notifications" ? "bg-primary text-white" : "text-muted"}`}
        >
          <Bell className="size-4" aria-hidden />
          Notifications
          {notifications.unreadCount > 0 && (
            <span className="rounded-full bg-danger px-1.5 text-xs text-white">
              {notifications.unreadCount}
            </span>
          )}
        </button>
      </div>

      {tab === "notifications" ? (
        <div className="space-y-4">
          <section
            className="divide-y divide-slate-100 rounded-3xl bg-white p-4 shadow-sm sm:p-5"
            aria-label="Notifications récentes"
          >
            <div className="flex items-center justify-between gap-3 pb-3">
              <p className="text-sm text-muted">
                {notifications.unreadCount} notification(s) non lue(s)
              </p>
              <button
                type="button"
                onClick={() => void notifications.markAllRead()}
                disabled={
                  notifications.unreadCount === 0 || notifications.loading
                }
                className="text-sm font-bold text-primary disabled:opacity-50"
              >
                Tout marquer comme lu
              </button>
            </div>
            {notifications.error && (
              <p role="alert" className="py-4 text-sm text-rose-700">
                {notifications.error}
              </p>
            )}
            {notifications.loading ? (
              <p className="py-8 text-center text-sm text-muted">
                Chargement des notifications…
              </p>
            ) : notifications.items.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">
                Aucune notification pour le moment.
              </p>
            ) : (
              notifications.items.map((notification) => {
                const read = Boolean(notification.readAt);
                return (
                  <article
                    key={notification.id}
                    className={`flex gap-3 py-4 last:pb-0 ${!read ? "bg-blue-50/40" : ""}`}
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl ${read ? "bg-slate-100 text-muted" : "bg-blue-100 text-primary"}`}
                    >
                      <Bell className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-night">
                          {notification.title}
                        </p>
                        {!read && (
                          <span
                            className="size-2 rounded-full bg-primary"
                            aria-label="Non lue"
                          />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {notification.body}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {new Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(notification.createdAt))}
                      </p>
                      {notification.targetUrl && (
                        <Link
                          href={notification.targetUrl}
                          onClick={() =>
                            !read &&
                            void notifications.markRead(notification.id)
                          }
                          className="mt-2 inline-block text-xs font-bold text-primary hover:underline"
                        >
                          Ouvrir
                        </Link>
                      )}
                    </div>
                    {!read && (
                      <button
                        type="button"
                        onClick={() =>
                          void notifications.markRead(notification.id)
                        }
                        aria-label={`Marquer comme lu : ${notification.title}`}
                        className="shrink-0 text-muted hover:text-primary"
                      >
                        <Check className="size-4" aria-hidden />
                      </button>
                    )}
                  </article>
                );
              })
            )}
            <nav
              className="flex items-center justify-between pt-3"
              aria-label="Pagination des notifications"
            >
              <span className="text-xs text-muted">
                Page {notifications.page}
                {notifications.totalPages
                  ? ` sur ${notifications.totalPages}`
                  : ""}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => notifications.goToPage(notifications.page - 1)}
                  disabled={notifications.page <= 1 || notifications.loading}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                >
                  Précédent
                </button>
                <button
                  type="button"
                  onClick={() => notifications.goToPage(notifications.page + 1)}
                  disabled={
                    notifications.page >= notifications.totalPages ||
                    notifications.loading
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </nav>
          </section>
        </div>
      ) : (
        <section
          className="grid min-h-[520px] overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] lg:grid-cols-[300px_1fr]"
          aria-label="Messagerie"
        >
          <nav
            aria-label="Conversations"
            className="border-b border-slate-100 p-3 lg:border-b-0 lg:border-r"
          >
            <h2 className="px-3 py-2 text-sm font-bold text-muted">
              VOS CONVERSATIONS ({messaging.conversations.length})
            </h2>
            {messaging.loading ? (
              <p className="px-3 py-2 text-sm text-muted">
                Chargement des conversations…
              </p>
            ) : messaging.conversations.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted">
                Aucune conversation pour le moment. Une conversation sera créée
                après l’échange d’une proposition avec un médecin.
              </p>
            ) : null}
            <ul className="space-y-1">
              {messaging.conversations.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() =>
                      messaging.selectConversation(conversation.id)
                    }
                    aria-pressed={messaging.selectedId === conversation.id}
                    className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${messaging.selectedId === conversation.id ? "bg-primary/10" : "hover:bg-slate-50"}`}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-50 text-primary">
                      <UserRound className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-bold text-ink">
                          {conversation.peerName}
                        </span>
                        <span className="shrink-0 text-xs text-muted">
                          {conversation.lastMessageAt
                            ? new Intl.DateTimeFormat("fr-FR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              }).format(new Date(conversation.lastMessageAt))
                            : ""}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-sm text-muted">
                        {conversation.preview || conversation.requestTitle}
                      </span>
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {messaging.selected ? (
            <div className="flex min-h-[420px] min-w-0 flex-col">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <span className="grid size-10 place-items-center rounded-full bg-blue-50 text-primary">
                  <UserRound className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-bold text-ink">
                    {messaging.selected.peerName}
                  </h2>
                  <p className="truncate text-sm text-muted">
                    {messaging.selected.requestTitle}
                  </p>
                </div>
              </div>

              <ol
                aria-live="polite"
                className="relative flex-1 space-y-4 overflow-y-auto p-5"
              >
                {messaging.messagesLoading && (
                  <li className="text-center text-sm text-muted absolute top-0 left-1/2 -translate-x-1/2 ">
                    Chargement des messages…
                  </li>
                )}
                {!messaging.messagesLoading &&
                  messaging.messages.length === 0 && (
                    <li className="text-center text-sm text-muted">
                      Aucun message. Envoyez le premier message de la
                      conversation.
                    </li>
                  )}
                {messaging.messages.map((message) => {
                  const mine = message.senderUserId === session?.user.id;
                  return (
                    <li
                      key={message.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${mine ? "rounded-br-md bg-primary text-white" : "rounded-bl-md bg-surface text-ink"}`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {message.body}
                        </p>
                        <p
                          className={`mt-1 text-right text-xs ${mine ? "text-white/75" : "text-muted"}`}
                        >
                          {new Intl.DateTimeFormat("fr-FR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          }).format(new Date(message.sentAt))}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {messaging.error && (
                <p role="alert" className="px-4 pt-3 text-sm text-rose-700">
                  {messaging.error}
                </p>
              )}
              <form
                onSubmit={sendMessage}
                className="flex gap-2 border-t border-slate-100 p-4"
              >
                <label htmlFor="message" className="sr-only">
                  Votre message
                </label>
                <input
                  id="message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Écrire un message…"
                  autoComplete="off"
                  maxLength={4000}
                  className="h-12 min-w-0 flex-1 rounded-full border border-slate-200 px-5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || messaging.sending}
                  aria-label="Envoyer le message"
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {messaging.sending ? (
                    <span className="text-xs">…</span>
                  ) : (
                    <Send className="size-5" aria-hidden />
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="grid min-h-[420px] place-items-center p-6 text-center text-sm text-muted">
              {messaging.loading
                ? "Chargement…"
                : "Aucune conversation sélectionnée."}
            </div>
          )}
        </section>
      )}
      <p className="flex items-center gap-2 text-sm text-muted">
        <MessageCircle className="size-4 text-primary" aria-hidden />
        Ne partagez pas d’informations bancaires ou de codes confidentiels dans
        vos messages.
      </p>
    </div>
  );
}
