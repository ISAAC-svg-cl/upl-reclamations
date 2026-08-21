"use client";

import { useState } from "react";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/utils";
import { markNotificationReadAction, markAllNotificationsReadAction } from "@/actions/notification.actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, CheckCheck, FileText, MessageSquare, AlertCircle } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date | string;
}

interface NotificationListProps {
  initialNotifications: NotificationItem[];
}

export function NotificationList({ initialNotifications }: NotificationListProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [loadingAll, setLoadingAll] = useState(false);

  const handleMarkAll = async () => {
    setLoadingAll(true);
    await markAllNotificationsReadAction();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setLoadingAll(false);
  };

  const handleMarkOne = async (id: string) => {
    await markNotificationReadAction(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "RESPONSE_ADDED":
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case "STATUS_UPDATED":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          {unreadCount} notification(s) non lue(s)
        </span>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAll}
            isLoading={loadingAll}
            className="text-xs gap-1.5"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Tout marquer comme lu</span>
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground shadow-xs">
          <Bell className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
          <p className="font-semibold text-foreground text-sm">Aucune notification</p>
          <p className="text-xs">Vous êtes à jour, aucune nouvelle alerte.</p>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                n.isRead
                  ? "bg-card text-muted-foreground"
                  : "bg-primary/5 border-primary/30 text-foreground shadow-xs font-medium"
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="h-8 w-8 rounded-lg bg-background border flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {getIcon(n.type)}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-foreground">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground">{formatTimeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>

                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => handleMarkOne(n.id)}
                      className="inline-block text-xs font-bold text-primary hover:underline pt-1"
                    >
                      Consulter le dossier →
                    </Link>
                  )}
                </div>
              </div>

              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkOne(n.id)}
                  className="text-xs text-muted-foreground hover:text-primary shrink-0 p-1"
                  title="Marquer comme lu"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
