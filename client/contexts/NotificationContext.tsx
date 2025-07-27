import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "order" | "offer";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

// Mock initial notifications
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message: "Kumar Oil Mills confirmed your order for Premium Mustard Oil",
    type: "order",
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    read: false,
    actionUrl: "/vendor/orders",
    icon: "📦",
  },
  {
    id: "2",
    title: "Special Offer",
    message: "Spice Garden has 20% off on Garam Masala this week!",
    type: "offer",
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    read: false,
    actionUrl: "/vendor/dashboard",
    icon: "🎉",
  },
  {
    id: "3",
    title: "Order Delivered",
    message: "Your Basmati Rice order has been delivered successfully",
    type: "success",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    read: true,
    actionUrl: "/vendor/orders",
    icon: "✅",
  },
];

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
        duration: 5000,
      });
    },
    [],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
