"use client";

import { useCallback, useEffect, useState } from "react";
import { notificationService, type NotificationPage } from "@/services/notification-service";
import { isWebPushConfigured, listenForWebPush } from "@/services/web-push";
import { authStore } from "@/store/auth-store";

const EMPTY_PAGE: NotificationPage = {
  items: [],
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
  unreadCount: 0,
};

export function useNotifications(pageSize = 20, poll = false) {
  const [result, setResult] = useState<NotificationPage>(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((current) => current + 1);
  }, []);

  const markRead = useCallback(async (id: string) => {
    try {
      await notificationService.markRead(id);
      setResult((current) => ({
        ...current,
        unreadCount: Math.max(
          0,
          current.unreadCount -
            (current.items.some((item) => item.id === id && !item.readAt) ? 1 : 0),
        ),
        items: current.items.map((item) =>
          item.id === id ? { ...item, readAt: new Date().toISOString() } : item,
        ),
      }));
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de marquer cette notification comme lue.");
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await notificationService.markAllRead();
      const readAt = new Date().toISOString();
      setResult((current) => ({
        ...current,
        unreadCount: 0,
        items: current.items.map((item) => ({ ...item, readAt })),
      }));
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible de marquer les notifications comme lues.");
    }
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    setLoading(true);
    setError(null);
    setPage(nextPage);
  }, []);

  useEffect(() => {
    let active = true;
    let stopListening: (() => void) | null = null;
    const load = () => {
      const session = authStore.getState().session;
      if (!session) {
        setResult(EMPTY_PAGE);
        setLoading(false);
        return;
      }
      notificationService
        .list(page, pageSize)
        .then((response) => {
          if (active) setResult(response);
        })
        .catch((cause: unknown) => {
          if (active) {
            setError(
              cause instanceof Error
                ? cause.message
                : "Impossible de charger les notifications.",
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };

    load();
    const interval = poll
      ? window.setInterval(() => {
          if (!document.hidden) load();
        }, 30_000)
      : null;
    const onVisibilityChange = () => {
      if (!document.hidden) load();
    };
    if (poll) document.addEventListener("visibilitychange", onVisibilityChange);
    const onPush = () => load();
    window.addEventListener("medilink:notification", onPush);
    if (poll && isWebPushConfigured()) {
      void listenForWebPush(() => undefined)
        .then((unsubscribe) => {
          if (active) stopListening = unsubscribe;
          else unsubscribe();
        })
        .catch((cause: unknown) => {
          if (active) {
            setError(
              cause instanceof Error
                ? cause.message
                : "Impossible d’activer la réception des notifications push.",
            );
          }
        });
    }

    return () => {
      active = false;
      stopListening?.();
      if (interval !== null) window.clearInterval(interval);
      if (poll) document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("medilink:notification", onPush);
    };
  }, [page, pageSize, poll, reloadKey]);

  return {
    ...result,
    loading,
    error,
    page,
    goToPage,
    refresh,
    markRead,
    markAllRead,
  };
}
