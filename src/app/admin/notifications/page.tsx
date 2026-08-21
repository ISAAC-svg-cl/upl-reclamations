import { getCurrentUser } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";
import { NotificationList } from "@/components/notifications/NotificationList";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const notifications = await NotificationService.getUserNotifications(user, 30);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Centre de Notifications Administrateur</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Journal des alertes critiques et des événements du système UPL
        </p>
      </div>

      <NotificationList initialNotifications={notifications as any} />
    </div>
  );
}
