"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  messageService,
  type Conversation,
  type ConversationMessage,
} from "@/services/message-service";
import { isRealtimeSocketReady } from "@/services/realtime-socket";
import { useRealtimeSocket } from "@/hooks/use-realtime-socket";

type NewMessageEvent = {
  conversationId: string;
  message: ConversationMessage;
};

type ConversationUpdatedEvent = {
  conversationId: string;
  preview: string;
  lastMessageAt: string;
  unreadCount: number;
};

type MessageReadEvent = {
  conversationId: string;
  readerUserId: string;
  readAt: string;
};

export function useMessaging(enabled = true, trackSelectedConversation = true) {
  const socket = useRealtimeSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageRequestId = useRef(0);
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

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
    if (!enabled) {
      setLoading(false);
      return;
    }

    void refreshConversations();
    const onVisibilityChange = () => {
      if (!document.hidden) {
        void refreshConversations();
        const currentConversationId = selectedIdRef.current;
        if (currentConversationId) void refreshMessages(currentConversationId);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, refreshConversations, refreshMessages]);

  useEffect(() => {
    if (!enabled || !trackSelectedConversation) return;
    if (!selectedId) {
      messageRequestId.current += 1;
      setMessages([]);
      return;
    }

    void refreshMessages(selectedId);
  }, [enabled, trackSelectedConversation, selectedId, refreshMessages]);

  useEffect(() => {
    if (!enabled || !socket) return;

    const onConversationUpdated = (event: ConversationUpdatedEvent) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === event.conversationId
            ? {
                ...conversation,
                preview: event.preview,
                lastMessageAt: event.lastMessageAt,
                unreadCount: event.unreadCount,
              }
            : conversation,
        ),
      );
    };

    const onNewMessage = (event: NewMessageEvent) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === event.conversationId
            ? {
                ...conversation,
                preview: event.message.body,
                lastMessageAt: event.message.sentAt,
              }
            : conversation,
        ),
      );

      if (event.conversationId === selectedId) {
        setMessages((current) =>
          current.some((message) => message.id === event.message.id)
            ? current
            : [...current, event.message],
        );
      }
    };

    const onMessageRead = (event: MessageReadEvent) => {
      if (event.conversationId !== selectedId) return;
      setMessages((current) =>
        current.map((message) =>
          message.senderUserId !== event.readerUserId && !message.readAt
            ? { ...message, readAt: event.readAt }
            : message,
        ),
      );
    };

    const onConversationRead = (event: {
      conversationId: string;
      unreadCount: number;
    }) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === event.conversationId
            ? { ...conversation, unreadCount: event.unreadCount }
            : conversation,
        ),
      );
    };

    const joinSelectedConversation = () => {
      if (!trackSelectedConversation || !selectedId) return;
      socket.emit(
        "conversation:join",
        { conversationId: selectedId },
        (result: { joined?: boolean } | undefined) => {
          if (result?.joined) void refreshMessages(selectedId);
        },
      );
    };

    const onReady = () => {
      void refreshConversations();
      if (trackSelectedConversation) {
        joinSelectedConversation();
        if (selectedId) void refreshMessages(selectedId);
      }
    };

    socket.on("conversation:updated", onConversationUpdated);
    socket.on("message:new", onNewMessage);
    socket.on("message:read", onMessageRead);
    socket.on("conversation:read", onConversationRead);
    socket.on("connection:ready", onReady);

    if (isRealtimeSocketReady(socket)) onReady();

    return () => {
      socket.off("conversation:updated", onConversationUpdated);
      socket.off("message:new", onNewMessage);
      socket.off("message:read", onMessageRead);
      socket.off("conversation:read", onConversationRead);
      socket.off("connection:ready", onReady);
      if (trackSelectedConversation && selectedId && isRealtimeSocketReady(socket)) {
        socket.emit("conversation:leave", { conversationId: selectedId });
      }
    };
  }, [enabled, trackSelectedConversation, socket, selectedId, refreshConversations, refreshMessages]);

  const markConversationRead = useCallback(async (conversationId: string) => {
    try {
      await messageService.markConversationRead(conversationId);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, unreadCount: 0 }
            : conversation,
        ),
      );
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Impossible de marquer la conversation comme lue.",
      );
    }
  }, []);

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
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === selectedId
              ? {
                  ...conversation,
                  preview: sentMessage.body,
                  lastMessageAt: sentMessage.sentAt,
                }
              : conversation,
          ),
        );
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
    [selectedId],
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
    refreshConversations,
    markConversationRead,
  };
}
