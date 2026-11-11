"use client";

import { PATIENT_PROFILE_MESSAGES } from "@/lib/patient-profile-data";
import { ArrowLeft, MessageCircle, Send, UserRound } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

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
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>(
    Object.fromEntries(conversations.map((conversation) => [conversation.id, conversation.messages])),
  );
  const [draft, setDraft] = useState("");
  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0];
  const messages = messagesByConversation[selected.id] ?? selected.messages;

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
      <p className="flex items-center gap-2 text-sm text-muted"><MessageCircle className="size-4 text-primary" aria-hidden />Ne partagez pas d’informations bancaires ou de codes confidentiels dans vos messages.</p>
    </div>
  );
}
