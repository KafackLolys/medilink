import { messageRoutes } from "@/routes/message-routes";
import { apiRequest } from "./http";

export interface Conversation {
  id: string;
  peerUserId: string;
  peerName: string;
  requestId: string;
  requestTitle: string;
  preview: string;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ConversationMessage {
  id: string;
  senderUserId: string;
  body: string;
  sentAt: string;
  readAt: string | null;
}

export const messageService = {
  listConversations(): Promise<{ items: Conversation[] }> {
    return apiRequest(messageRoutes.Conversations);
  },

  listMessages(conversationId: string): Promise<{ items: ConversationMessage[] }> {
    return apiRequest(messageRoutes.Messages(conversationId));
  },

  sendMessage(
    conversationId: string,
    body: string,
  ): Promise<ConversationMessage> {
    return apiRequest(messageRoutes.Send(conversationId), {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  },
};
