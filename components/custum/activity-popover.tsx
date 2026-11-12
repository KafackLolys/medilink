"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState, type ReactElement } from "react";

export interface ActivityNotification {
  id: string;
  title?: string;
  text: string;
  when: string;
  unread?: boolean;
  href?: string;
}

export interface ActivityMessage {
  id: string;
  sender: string;
  preview: string;
  when: string;
  unread?: boolean;
  href?: string;
}

interface ActivityPopoverProps {
  trigger: ReactElement;
  notifications: ActivityNotification[];
  messages: ActivityMessage[];
  allNotificationsHref: string;
  allMessagesHref: string;
  onNotificationOpen?: (id: string) => void;
}

type ActivityTab = "notifications" | "messages";

export function ActivityPopover({
  trigger,
  notifications,
  messages,
  allNotificationsHref,
  allMessagesHref,
  onNotificationOpen,
}: ActivityPopoverProps) {
  const [tab, setTab] = useState<ActivityTab>("notifications");
  const unreadNotifications = notifications.filter((item) => item.unread).length;
  const unreadMessages = messages.filter((item) => item.unread).length;
  const items = tab === "notifications" ? notifications : messages;
  const allHref = tab === "notifications" ? allNotificationsHref : allMessagesHref;

  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="end" className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-100 p-0 shadow-xl">
        <div className="border-b border-slate-100 px-4 pb-3 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-night">Centre d’activité</h2>
              <p className="mt-0.5 text-xs text-muted">Vos dernières nouvelles et conversations</p>
            </div>
            <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              {tab === "notifications" ? <Bell className="size-4" aria-hidden /> : <MessageCircle className="size-4" aria-hidden />}
            </span>
          </div>
          <div role="tablist" aria-label="Activité récente" className="mt-4 grid grid-cols-2 rounded-xl bg-surface p-1">
            <button type="button" role="tab" aria-selected={tab === "notifications"} onClick={() => setTab("notifications")}
              className={`flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition ${tab === "notifications" ? "bg-white text-primary shadow-sm" : "text-muted hover:text-ink"}`}>
              <Bell className="size-4" aria-hidden /> Notifications
              {unreadNotifications > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-danger px-1 text-[10px] leading-5 text-white">{unreadNotifications}</span>}
            </button>
            <button type="button" role="tab" aria-selected={tab === "messages"} onClick={() => setTab("messages")}
              className={`flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition ${tab === "messages" ? "bg-white text-primary shadow-sm" : "text-muted hover:text-ink"}`}>
              <MessageCircle className="size-4" aria-hidden /> Messages
              {unreadMessages > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] leading-5 text-white">{unreadMessages}</span>}
            </button>
          </div>
        </div>

        <ul role="tabpanel" className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
          {tab === "notifications"
            ? notifications.map((notification) => (
                <li key={notification.id}>
                  <Link href={notification.href ?? allNotificationsHref} onClick={() => onNotificationOpen?.(notification.id)} className={`flex gap-3 px-4 py-3 transition hover:bg-slate-50 ${notification.unread ? "bg-blue-50/40" : ""}`}>
                    <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${notification.unread ? "bg-blue-100 text-primary" : "bg-slate-100 text-muted"}`}><Bell className="size-4" aria-hidden /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-sm font-bold text-ink">{notification.title ?? "Notification"}</span>
                        {notification.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Non lue" />}
                      </span>
                      <span className="mt-0.5 block text-sm leading-5 text-muted">{notification.text}</span>
                      <span className="mt-1 block text-xs text-muted">{notification.when}</span>
                    </span>
                  </Link>
                </li>
              ))
            : messages.map((message) => (
                <li key={message.id}>
                  <Link href={message.href ?? allMessagesHref} className={`flex gap-3 px-4 py-3 transition hover:bg-slate-50 ${message.unread ? "bg-blue-50/40" : ""}`}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">{message.sender.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="truncate text-sm font-bold text-ink">{message.sender}</span>
                        {message.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Non lu" />}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-muted">{message.preview}</span>
                      <span className="mt-1 block text-xs text-muted">{message.when}</span>
                    </span>
                  </Link>
                </li>
              ))}
          {items.length === 0 && (
            <li className="px-4 py-10 text-center">
              <span className="mx-auto grid size-10 place-items-center rounded-xl bg-surface text-muted">
                {tab === "notifications" ? <Bell className="size-5" aria-hidden /> : <MessageCircle className="size-5" aria-hidden />}
              </span>
              <p className="mt-2 text-sm font-semibold text-ink">{tab === "notifications" ? "Aucune notification" : "Aucun message"}</p>
              <p className="mt-1 text-xs text-muted">Tout est à jour pour le moment.</p>
            </li>
          )}
        </ul>

        <div className="border-t border-slate-100 p-2">
          <Link href={allHref} className="flex h-10 items-center justify-center rounded-xl text-sm font-bold text-primary transition hover:bg-primary/5">
            {tab === "notifications" ? "Toutes les notifications" : "Tous les messages"}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
