const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

const MESSAGES_V2 = `${API_URL}/messages/v2/conversations`;

export const messageRoutes = {
  Conversations: MESSAGES_V2,
  Messages: (conversationId: string) =>
    `${MESSAGES_V2}/${encodeURIComponent(conversationId)}`,
  Send: (conversationId: string) =>
    `${MESSAGES_V2}/${encodeURIComponent(conversationId)}`,
  Read: (conversationId: string) =>
    `${MESSAGES_V2}/${encodeURIComponent(conversationId)}/read`,
};
