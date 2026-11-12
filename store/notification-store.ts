import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NotificationStoreState {
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  setUnreadMessagesCount: (count: number) => void;
  setUnreadNotificationsCount: (count: number) => void;
  updateCountsFromNotifications: (
    items: Array<{ type: string; readAt: string | null }>,
    totalUnread?: number,
  ) => void;
  decrementUnreadMessages: (amount?: number) => void;
  resetUnreadMessages: () => void;
}

export const useNotificationStore = create<NotificationStoreState>()(
  persist(
    (set) => ({
      unreadMessagesCount: 3,
      unreadNotificationsCount: 0,
      setUnreadMessagesCount: (count) =>
        set({ unreadMessagesCount: Math.max(0, count) }),
      setUnreadNotificationsCount: (count) =>
        set({ unreadNotificationsCount: Math.max(0, count) }),
      updateCountsFromNotifications: (items, totalUnread) => {
        const unreadMessages = items.filter(
          (item) => item.type === "new_message" && !item.readAt,
        ).length;
        set({
          unreadMessagesCount: unreadMessages,
          unreadNotificationsCount:
            typeof totalUnread === "number"
              ? totalUnread
              : items.filter((item) => !item.readAt).length,
        });
      },
      decrementUnreadMessages: (amount = 1) =>
        set((state) => ({
          unreadMessagesCount: Math.max(0, state.unreadMessagesCount - amount),
        })),
      resetUnreadMessages: () => set({ unreadMessagesCount: 0 }),
    }),
    {
      name: "medilink-notifications",
      partialize: (state) => ({
        unreadMessagesCount: state.unreadMessagesCount,
        unreadNotificationsCount: state.unreadNotificationsCount,
      }),
    },
  ),
);

export const notificationStore = useNotificationStore;
