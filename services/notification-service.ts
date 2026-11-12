import { notificationRoutes } from "@/routes/notification-routes";
import { apiRequest } from "./http";

export type NotificationType =
  | "relevant_need"
  | "proposal_received"
  | "proposal_accepted"
  | "appointment_updated"
  | "new_message"
  | "system";

export interface UserNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  targetUrl: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPage {
  items: UserNotification[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  unreadCount: number;
}

export interface RegisterNotificationDeviceRequest {
  deviceId: string;
  token: string;
  platform: "web" | "mobile";
  userAgent?: string;
}

export const notificationService = {
  list(page: number, pageSize: number): Promise<NotificationPage> {
    const url = new URL(notificationRoutes.List);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    return apiRequest<NotificationPage>(url.toString());
  },

  markRead(id: string): Promise<{ id: string; readAt: string }> {
    return apiRequest(notificationRoutes.Read(id), { method: "PATCH" });
  },

  markAllRead(): Promise<{ updated: number }> {
    return apiRequest(notificationRoutes.ReadAll, { method: "PATCH" });
  },

  registerDevice(
    request: RegisterNotificationDeviceRequest,
  ): Promise<{ deviceId: string; platform: "web" | "mobile" }> {
    return apiRequest(notificationRoutes.Devices, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  unregisterDevice(deviceId: string): Promise<{ removed: boolean }> {
    return apiRequest(notificationRoutes.UnregisterDevice(deviceId), {
      method: "POST",
    });
  },
};
