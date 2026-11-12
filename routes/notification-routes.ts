const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const notificationRoutes = {
  List: `${API_URL}/notifications`,
  Read: (id: string) =>
    `${API_URL}/notifications/${encodeURIComponent(id)}/read`,
  ReadAll: `${API_URL}/notifications/read-all`,
  Devices: `${API_URL}/notifications/devices`,
  UnregisterDevice: (deviceId: string) =>
    `${API_URL}/notifications/devices/${encodeURIComponent(deviceId)}/unregister`,
};
