const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const messageRoutes = {
  Conversations: `${API_URL}/messages/conversations`,
  Messages: (conversationId: string) =>
    `${API_URL}/messages/conversations/${encodeURIComponent(conversationId)}`,
  Send: (conversationId: string) =>
    `${API_URL}/messages/conversations/${encodeURIComponent(conversationId)}`,
};
