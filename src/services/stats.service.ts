import { prisma } from "@/lib/db";
import { UserSession } from "@/types";

export class StatsService {
  /**
   * Statistiques pour le tableau de bord de l'étudiant
   */
  static async getStudentDashboardStats(user: UserSession) {
    const [total, newCount, inProgress, waitingInfo, resolved, closed, recentComplaints] =
      await Promise.all([
        prisma.complaint.count({ where: { studentId: user.id } }),
        prisma.complaint.count({ where: { studentId: user.id, status: "NEW" } }),
        prisma.complaint.count({ where: { studentId: user.id, status: "IN_PROGRESS" } }),
        prisma.complaint.count({ where: { studentId: user.id, status: "WAITING_INFO" } }),
        prisma.complaint.count({ where: { studentId: user.id, status: "RESOLVED" } }),
        prisma.complaint.count({ where: { studentId: user.id, status: "CLOSED" } }),
        prisma.complaint.findMany({
          where: { studentId: user.id },
          include: {
            category: true,
            service: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return {
      total,
      newCount,
      inProgress,
      waitingInfo,
      resolved,
      closed,
      recentComplaints,
    };
  }

  /**
   * Statistiques pour le tableau de bord du responsable de service (Staff)
   */
  static async getStaffDashboardStats(user: UserSession) {
    const whereService: any = {};
    if (user.serviceId) {
      whereService.serviceId = user.serviceId;
    }

    const [totalAssigned, newCount, inProgress, waitingInfo, resolved, urgentCount, recentComplaints] =
      await Promise.all([
        prisma.complaint.count({ where: whereService }),
        prisma.complaint.count({ where: { ...whereService, status: "NEW" } }),
        prisma.complaint.count({ where: { ...whereService, status: "IN_PROGRESS" } }),
        prisma.complaint.count({ where: { ...whereService, status: "WAITING_INFO" } }),
        prisma.complaint.count({ where: { ...whereService, status: "RESOLVED" } }),
        prisma.complaint.count({ where: { ...whereService, priority: "URGENT", status: { notIn: ["RESOLVED", "CLOSED", "REJECTED"] } } }),
        prisma.complaint.findMany({
          where: whereService,
          include: {
            student: true,
            category: true,
            faculty: true,
          },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
      ]);

    return {
      totalAssigned,
      newCount,
      inProgress,
      waitingInfo,
      resolved,
      urgentCount,
      recentComplaints,
    };
  }

  /**
   * Statistiques globales pour l'administrateur et les autorités décanales UPL
   */
  static async getAdminDashboardStats() {
    const [
      totalUsers,
      totalStudents,
      totalComplaints,
      newComplaints,
      inProgressComplaints,
      resolvedComplaints,
      urgentComplaints,
      categories,
      faculties,
      statuses,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: "NEW" } }),
      prisma.complaint.count({ where: { status: "IN_PROGRESS" } }),
      prisma.complaint.count({ where: { status: "RESOLVED" } }),
      prisma.complaint.count({ where: { priority: "URGENT", status: { notIn: ["RESOLVED", "CLOSED", "REJECTED"] } } }),
      prisma.complaintCategory.findMany({
        include: {
          _count: { select: { complaints: true } },
        },
      }),
      prisma.faculty.findMany({
        include: {
          _count: { select: { complaints: true } },
        },
      }),
      prisma.complaint.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

    const categoryDistribution = categories.map((cat) => ({
      name: cat.name,
      code: cat.code,
      count: cat._count.complaints,
    }));

    const facultyDistribution = faculties.map((fac) => ({
      name: fac.code,
      fullName: fac.name,
      count: fac._count.complaints,
    }));

    const statusDistribution = statuses.map((st) => ({
      status: st.status,
      count: st._count.status,
    }));

    return {
      totalUsers,
      totalStudents,
      totalComplaints,
      newComplaints,
      inProgressComplaints,
      resolvedComplaints,
      urgentComplaints,
      resolutionRate,
      categoryDistribution,
      facultyDistribution,
      statusDistribution,
    };
  }
}
