import { prisma } from "@/lib/db";
import { UserSession } from "@/types";

export class NotificationService {
  static async getUserNotifications(user: UserSession, limit: number = 20) {
    return prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  static async getUnreadCount(user: UserSession): Promise<number> {
    return prisma.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    });
  }

  static async markAsRead(user: UserSession, notificationId: string) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: user.id,
      },
      data: {
        isRead: true,
      },
    });
  }

  static async markAllAsRead(user: UserSession) {
    return prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}
