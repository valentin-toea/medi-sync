// store/notifications.store.ts
import { create } from "zustand";
import api from "@/services/api";

export type Notification = {
  id: number;
  titlu: string;
  mesaj: string;
  data_trimitere: string;
  citit: boolean;
};

type NotificationsState = {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  markAsRead: (notificationId: number) => Promise<void>;
};

let intervalId: ReturnType<typeof setTimeout> | null = null;

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get<Notification[]>("/api/notificari");
      set({ notifications: res.data, loading: false });
    } catch (err: any) {
      set({
        error: err.message ?? "Failed to fetch notifications",
        loading: false,
      });
    }
  },

  startPolling: () => {
    const { fetchNotifications } = get();
    // Avoid multiple intervals
    if (intervalId) return;
    fetchNotifications();
    intervalId = setInterval(fetchNotifications, 10000); // 10 seconds
  },

  stopPolling: () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      await api.post(`/api/notificari/${notificationId}/read`);
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, citit: true } : notif
        ),
      }));
    } catch (err: any) {
      console.error(
        `Failed to mark notification ${notificationId} as read`,
        err
      );
    }
  },
}));
