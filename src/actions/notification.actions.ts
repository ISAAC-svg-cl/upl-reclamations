"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";

export async function markNotificationReadAction(notificationId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Non connecté" };

    await NotificationService.markAsRead(user, notificationId);
    revalidatePath("/student/notifications");
    revalidatePath("/staff/notifications");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAllNotificationsReadAction() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Non connecté" };

    await NotificationService.markAllAsRead(user);
    revalidatePath("/student/notifications");
    revalidatePath("/staff/notifications");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
