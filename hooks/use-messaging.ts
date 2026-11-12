"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  messageService,
  type Conversation,
  type ConversationMessage,
} from "@/services/message-service";

export function useMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageRequestId = useRef(0);

  const refreshConversations = useCallback(async () => {
    try {
      const response = await messageService.listConversations();
      setConversations(response.items);
      setSelectedId((current) => {
        const requestedId =
          typeof window === "undefined"
            ? null
            : new URLSearchParams(window.location.search).get("conversation");
        if (requestedId && response.items.some((item) => item.id === requestedId)) {
          return requestedId;
        }
        return response.items.some((item) => item.id === current)
          ? current
          : (response.items[0]?.id ?? "");
      });
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Impossible de charger les conversations.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMessages = useCallback(async (conversationId: string) => {
    const requestId = ++messageRequestId.current;
    setMessagesLoading(true);
    try {
      const response = await messageService.listMessages(conversationId);
      if (requestId === messageRequestId.current) {
        setMessages(response.items);
        setError(null);
      }
    } catch (cause) {
      if (requestId === messageRequestId.current) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Impossible de charger les messages.",
        );
      }
    } finally {
      if (requestId === messageRequestId.current) setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => refreshConversations());
    const interval = window.setInterval(() => {
      if (!document.hidden) void refreshConversations();
    }, 15_000);
    const onVisibilityChange = () => {
      if (!document.hidden) void refreshConversations();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refreshConversations]);

  useEffect(() => {
    if (!selectedId) {
      messageRequestId.current += 1;
      return;
    }
    let active = true;
    const load = () => {
      if (!active) return;
      void refreshMessages(selectedId).then(() => {
        if (active) void refreshConversations();
      });
    };
    void Promise.resolve().then(load);
    const interval = window.setInterval(() => {
      if (!document.hidden) void load();
    }, 8_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [selectedId, refreshConversations, refreshMessages]);

  const send = useCallback(
    async (body: string): Promise<boolean> => {
      if (!selectedId || !body.trim()) return false;
      setSending(true);
      setError(null);
      try {
        const sentMessage = await messageService.sendMessage(selectedId, body.trim());
        setMessages((current) =>
          current.some((message) => message.id === sentMessage.id)
            ? current
            : [...current, sentMessage],
        );
        await refreshConversations();
        return true;
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Impossible d’envoyer ce message.",
        );
        return false;
      } finally {
        setSending(false);
      }
    },
    [refreshConversations, selectedId],
  );

  return {
    conversations,
    selectedId,
    selectConversation: setSelectedId,
    selected: conversations.find((conversation) => conversation.id === selectedId),
    messages,
    loading,
    messagesLoading,
    sending,
    error,
    send,
  };
}
