"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { Bell, Check, MessageCircle, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { useMessaging } from "@/hooks/use-messaging";
import { useAuthSession } from "@/hooks/use-auth-session";

export default function DoctorMessagesPage() {
  const [tab, setTab] = useState<"messages" | "notifications">("messages");
  const messaging = useMessaging();
  const session = useAuthSession();
  const [text, setText] = useState("");
  const notifications = useNotifications(20, true);
  const unreadNotifications = notifications.unreadCount;

  useEffect(() => {
    void Promise.resolve().then(() => {
      if (new URLSearchParams(window.location.search).get("tab") === "notifications") {
        setTab("notifications");
      }
    });
  }, []);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = text.trim();
    if (!message || !messaging.selected) return;
    if (await messaging.send(message)) setText("");
  }

  return (
    <div className="space-y-5">
      <DoctorPageHeading title="Messages et notifications" description="Échangez avec les patients et restez informé des événements de votre activité." />
      <div role="tablist" aria-label="Messagerie et notifications" className="inline-flex rounded-xl bg-white p-1 shadow-sm">
        <button type="button" role="tab" aria-selected={tab === "messages"} onClick={() => setTab("messages")} className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${tab === "messages" ? "bg-primary text-white" : "text-muted"}`}><MessageCircle className="size-4" aria-hidden />Messages</button>
        <button type="button" role="tab" aria-selected={tab === "notifications"} onClick={() => setTab("notifications")} className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${tab === "notifications" ? "bg-primary text-white" : "text-muted"}`}><Bell className="size-4" aria-hidden />Notifications{unreadNotifications > 0 && <span className="rounded-full bg-danger px-1.5 text-xs text-white">{unreadNotifications}</span>}</button>
      </div>

      {tab === "notifications" ? (
        <section className={`${doctorCard} divide-y divide-slate-100 p-4 sm:p-5`} aria-label="Notifications récentes">
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
              const href = notification.targetUrl ?? "/medecin/messages";
              return <article key={notification.id} className={`flex gap-3 py-4 last:pb-0 ${!read ? "bg-blue-50/40" : ""}`}>
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${read ? "bg-slate-100 text-muted" : "bg-blue-100 text-primary"}`}><Bell className="size-5" aria-hidden /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-night">{notification.title}</p>{!read && <span className="size-2 rounded-full bg-primary" aria-label="Non lue" />}</div>
                  <p className="mt-1 text-sm text-muted">{notification.body}</p>
                  <p className="mt-1 text-xs text-muted">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.createdAt))}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Link href={href} onClick={() => !read && void notifications.markRead(notification.id)} className="text-xs font-bold text-primary hover:underline">Ouvrir</Link>
                  {!read && <button type="button" onClick={() => void notifications.markRead(notification.id)} aria-label={`Marquer comme lu : ${notification.title}`} className="text-muted hover:text-primary"><Check className="size-4" aria-hidden /></button>}
                </div>
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
      ) : (
        <div className={`${doctorCard} grid min-h-[520px] overflow-hidden md:grid-cols-[280px_minmax(0,1fr)]`}>
          <aside className={`border-b border-slate-100 md:border-b-0 md:border-r ${messaging.selected ? "hidden md:block" : ""}`}>
            <h2 className="border-b border-slate-100 p-4 text-sm font-extrabold text-night">Conversations ({messaging.conversations.length})</h2>
            {messaging.loading ? <p className="p-4 text-sm text-muted">Chargement des conversations…</p> : messaging.conversations.length === 0 ? <p className="p-4 text-sm text-muted">Aucune conversation n’est disponible. Les échanges apparaîtront après une proposition envoyée à un patient.</p> : null}
            <ul className="divide-y divide-slate-100">
              {messaging.conversations.map((conversation) => <li key={conversation.id}>
                <button type="button" onClick={() => messaging.selectConversation(conversation.id)} className={`flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50 ${messaging.selectedId === conversation.id ? "bg-blue-50/70" : ""}`}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-extrabold text-primary">{conversation.peerName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
                  <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-bold text-night">{conversation.peerName}</span><span className="text-[10px] text-muted">{conversation.lastMessageAt ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(conversation.lastMessageAt)) : ""}</span></span><span className="mt-1 block truncate text-xs text-muted">{conversation.preview || conversation.requestTitle}</span></span>
                  {conversation.unreadCount > 0 && <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">{conversation.unreadCount}</span>}
                </button>
              </li>)}
            </ul>
          </aside>
          {messaging.selected ? (
            <section className="flex min-h-[520px] min-w-0 flex-col">
              <header className="flex items-center gap-3 border-b border-slate-100 p-4">
                <button type="button" onClick={() => messaging.selectConversation("")} className="mr-1 rounded-lg px-2 py-1 text-sm font-semibold text-primary md:hidden">Retour</button>
                <span className="grid size-10 place-items-center rounded-full bg-blue-100 text-xs font-extrabold text-primary">{messaging.selected.peerName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
                <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-bold text-night">{messaging.selected.peerName}</h2><p className="truncate text-xs text-muted">{messaging.selected.requestTitle}</p></div>
                <Link href={`/medecin/besoins/${messaging.selected.requestId}`} className="text-xs font-bold text-primary hover:underline">Voir le besoin</Link>
              </header>
              <ul className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4 sm:p-6">
                {messaging.messagesLoading && <li className="text-center text-sm text-muted">Chargement des messages…</li>}
                {!messaging.messagesLoading && messaging.messages.length === 0 && <li className="text-center text-sm text-muted">Aucun message. Envoyez le premier message de la conversation.</li>}
                {messaging.messages.map((message) => {
                  const mine = message.senderUserId === session?.user.id;
                  return <li key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${mine ? "rounded-br-sm bg-primary text-white" : "rounded-bl-sm bg-white text-ink shadow-sm"}`}>
                    <p className="whitespace-pre-wrap text-sm leading-5">{message.body}</p><p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-blue-100" : "text-muted"}`}>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(new Date(message.sentAt))}</p>
                  </div>
                </li>;
                })}
              </ul>
              {messaging.error && <p role="alert" className="px-4 pt-3 text-sm text-rose-700">{messaging.error}</p>}
              <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 p-3">
                <label className="sr-only" htmlFor="doctor-message">Votre message</label>
                <input id="doctor-message" value={text} onChange={(event) => setText(event.target.value)} placeholder="Écrire un message…" maxLength={4000} className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary" />
                <button type="submit" disabled={!text.trim() || messaging.sending} aria-label="Envoyer le message" className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-white disabled:opacity-50">{messaging.sending ? <span className="text-xs">…</span> : <Send className="size-4" aria-hidden />}</button>
              </form>
            </section>
          ) : <div className="hidden place-items-center text-sm text-muted md:grid">{messaging.loading ? "Chargement…" : "Choisissez une conversation."}</div>}
        </div>
      )}
      <p className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-muted"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />Évitez de transmettre des informations de santé sensibles en dehors du dossier sécurisé du patient.</p>
    </div>
  );
}
