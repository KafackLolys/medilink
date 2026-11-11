"use client";

import { doctorCard, DoctorPageHeading } from "../../components/doctor-ui";
import { DOCTOR_CONVERSATIONS, DOCTOR_NOTIFICATIONS } from "@/lib/doctor-portal-data";
import { Bell, Check, CheckCheck, MessageCircle, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

type Message = { id: string; from: "doctor" | "patient"; text: string; time: string };
type Conversation = { id: string; patient: string; initials: string; preview: string; time: string; unread: number; requestId: string; messages: Message[] };

export default function DoctorMessagesPage() {
  const [tab, setTab] = useState<"messages" | "notifications">("messages");
  const [conversations, setConversations] = useState<Conversation[]>(DOCTOR_CONVERSATIONS.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({ ...message, from: message.from === "doctor" ? "doctor" as const : "patient" as const })),
  })));
  const [selectedId, setSelectedId] = useState(conversations[0]?.id ?? "");
  const [text, setText] = useState("");
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const selected = conversations.find((conversation) => conversation.id === selectedId);
  const unreadNotifications = useMemo(() => DOCTOR_NOTIFICATIONS.filter((notification) => notification.unread && !readNotifications.includes(notification.id)).length, [readNotifications]);

  function selectConversation(id: string) {
    setSelectedId(id);
    setConversations((items) => items.map((conversation) => conversation.id === id ? { ...conversation, unread: 0 } : conversation));
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = text.trim();
    if (!message || !selected) return;
    const now = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
    setConversations((items) => items.map((conversation) => conversation.id === selected.id
      ? { ...conversation, preview: message, time: now, messages: [...conversation.messages, { id: `message-${Date.now()}`, from: "doctor", text: message, time: now }] }
      : conversation));
    setText("");
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
          {DOCTOR_NOTIFICATIONS.map((notification) => {
            const read = !notification.unread || readNotifications.includes(notification.id);
            return <article key={notification.id} className={`flex gap-3 py-4 first:pt-0 last:pb-0 ${!read ? "bg-blue-50/40" : ""}`}>
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${read ? "bg-slate-100 text-muted" : "bg-blue-100 text-primary"}`}><Bell className="size-5" aria-hidden /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-night">{notification.type}</p>{!read && <span className="size-2 rounded-full bg-primary" aria-label="Non lue" />}</div>
                <p className="mt-1 text-sm text-muted">{notification.text}</p>
                <p className="mt-1 text-xs text-muted">{notification.when}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Link href={notification.href} className="text-xs font-bold text-primary hover:underline">Ouvrir</Link>
                {!read && <button type="button" onClick={() => setReadNotifications((ids) => [...ids, notification.id])} aria-label={`Marquer comme lu : ${notification.type}`} className="text-muted hover:text-primary"><Check className="size-4" aria-hidden /></button>}
              </div>
            </article>;
          })}
        </section>
      ) : (
        <div className={`${doctorCard} grid min-h-[520px] overflow-hidden md:grid-cols-[280px_minmax(0,1fr)]`}>
          <aside className={`border-b border-slate-100 md:border-b-0 md:border-r ${selected ? "hidden md:block" : ""}`}>
            <h2 className="border-b border-slate-100 p-4 text-sm font-extrabold text-night">Conversations ({conversations.length})</h2>
            <ul className="divide-y divide-slate-100">
              {conversations.map((conversation) => <li key={conversation.id}>
                <button type="button" onClick={() => selectConversation(conversation.id)} className={`flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50 ${selectedId === conversation.id ? "bg-blue-50/70" : ""}`}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-extrabold text-primary">{conversation.initials}</span>
                  <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-bold text-night">{conversation.patient}</span><span className="text-[10px] text-muted">{conversation.time}</span></span><span className="mt-1 block truncate text-xs text-muted">{conversation.preview}</span></span>
                  {conversation.unread > 0 && <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">{conversation.unread}</span>}
                </button>
              </li>)}
            </ul>
          </aside>
          {selected ? (
            <section className="flex min-h-[520px] min-w-0 flex-col">
              <header className="flex items-center gap-3 border-b border-slate-100 p-4">
                <button type="button" onClick={() => setSelectedId("")} className="mr-1 rounded-lg px-2 py-1 text-sm font-semibold text-primary md:hidden">Retour</button>
                <span className="grid size-10 place-items-center rounded-full bg-blue-100 text-xs font-extrabold text-primary">{selected.initials}</span>
                <div className="min-w-0 flex-1"><h2 className="truncate text-sm font-bold text-night">{selected.patient}</h2><p className="text-xs text-muted">Conversation liée à une demande</p></div>
                <Link href={`/medecin/besoins/${selected.requestId}`} className="text-xs font-bold text-primary hover:underline">Voir le besoin</Link>
              </header>
              <ul className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4 sm:p-6">
                {selected.messages.map((message) => <li key={message.id} className={`flex ${message.from === "doctor" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${message.from === "doctor" ? "rounded-br-sm bg-primary text-white" : "rounded-bl-sm bg-white text-ink shadow-sm"}`}>
                    <p className="text-sm leading-5">{message.text}</p><p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${message.from === "doctor" ? "text-blue-100" : "text-muted"}`}>{message.time}{message.from === "doctor" && <CheckCheck className="size-3" aria-hidden />}</p>
                  </div>
                </li>)}
              </ul>
              <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 p-3">
                <label className="sr-only" htmlFor="doctor-message">Votre message</label>
                <input id="doctor-message" value={text} onChange={(event) => setText(event.target.value)} placeholder="Écrire un message…" className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-primary" />
                <button type="submit" disabled={!text.trim()} aria-label="Envoyer le message" className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-white disabled:opacity-50"><Send className="size-4" aria-hidden /></button>
              </form>
            </section>
          ) : <div className="hidden place-items-center text-sm text-muted md:grid">Choisissez une conversation.</div>}
        </div>
      )}
      <p className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-muted"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />Évitez de transmettre des informations de santé sensibles en dehors du dossier sécurisé du patient.</p>
    </div>
  );
}
