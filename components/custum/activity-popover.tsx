"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  CalendarCheck,
  ClipboardCheck,
  Info,
  MessageCircle,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

export interface ActivityNotification {
  id: string;
  type?: string;
  title?: string;
  text: string;
  when: string;
  unread?: boolean;
  href?: string;
}

interface ActivityPopoverProps {
  trigger: ReactElement;
  notifications: ActivityNotification[];
  allNotificationsHref: string;
  onNotificationOpen?: (id: string) => void;
}

export function NotificationTypeIcon({ type, title, className = "size-4" }: { type?: string; title?: string; className?: string }) {
  const normalizedTitle = (title ?? "").toLocaleLowerCase("fr");

  if (normalizedTitle.includes("demande de rendez-vous")) {
    return <CalendarCheck className={className} aria-hidden />;
  }

  switch (type) {
    case "new_message":
      return <MessageCircle className={className} aria-hidden />;
    case "proposal_received":
    case "proposal_accepted":
      return <ClipboardCheck className={className} aria-hidden />;
    case "appointment_updated":
      return <CalendarCheck className={className} aria-hidden />;
    case "relevant_need":
      return <Stethoscope className={className} aria-hidden />;
    case "system":
      return <Info className={className} aria-hidden />;
    default:
      return <Bell className={className} aria-hidden />;
  }
}

export function ActivityPopover({
  trigger,
  notifications,
  allNotificationsHref,
  onNotificationOpen,
}: ActivityPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="end" className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-100 p-0 shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4">
          <div>
            <h2 className="font-bold text-night">Notifications</h2>
            <p className="mt-0.5 text-xs text-muted">Les dernières actualités de votre compte</p>
          </div>
          <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Bell className="size-4" aria-hidden />
          </span>
        </div>

        <ul aria-label="Notifications récentes" className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <Link
                href={notification.href ?? allNotificationsHref}
                onClick={() => onNotificationOpen?.(notification.id)}
                className={`flex gap-3 px-4 py-3 transition hover:bg-slate-50 ${notification.unread ? "bg-blue-50/40" : ""}`}
              >
                <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${notification.unread ? "bg-blue-100 text-primary" : "bg-slate-100 text-muted"}`}>
                  <NotificationTypeIcon type={notification.type} title={notification.title} />
                </span>
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
          ))}
          {notifications.length === 0 && (
            <li className="px-4 py-10 text-center">
              <span className="mx-auto grid size-10 place-items-center rounded-xl bg-surface text-muted">
                <Bell className="size-5" aria-hidden />
              </span>
              <p className="mt-2 text-sm font-semibold text-ink">Aucune notification</p>
              <p className="mt-1 text-xs text-muted">Tout est à jour pour le moment.</p>
            </li>
          )}
        </ul>

        <div className="border-t border-slate-100 p-2">
          <Link href={allNotificationsHref} className="flex h-10 items-center justify-center rounded-xl text-sm font-bold text-primary transition hover:bg-primary/5">
            Toutes les notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
