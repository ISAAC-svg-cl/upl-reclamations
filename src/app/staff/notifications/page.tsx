import { getCurrentUser } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";
import { NotificationList } from "@/components/notifications/NotificationList";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StaffNotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const notifications = await NotificationService.getUserNotifications(user, 30);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Notifications du Service</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Alertes d'assignation, réponses étudiantes et transferts de dossiers
        </p>
      </div>

      <NotificationList initialNotifications={notifications as any} />
    </div>
  );
}
