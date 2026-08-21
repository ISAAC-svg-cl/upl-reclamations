import { prisma } from "@/lib/db";

export class AcademicService {
  static async getFaculties() {
    return prisma.faculty.findMany({
      where: { isActive: true },
      include: {
        departments: {
          where: { isActive: true },
          include: {
            programs: {
              where: { isActive: true },
              include: {
                promotions: {
                  where: { isActive: true },
                },
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  static async getPromotionsList() {
    return prisma.promotion.findMany({
      where: { isActive: true },
      include: {
        program: {
          include: {
            department: {
              include: {
                faculty: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  static async getCategories() {
    return prisma.complaintCategory.findMany({
      where: { isActive: true },
      include: {
        defaultService: true,
      },
      orderBy: { name: "asc" },
    });
  }

  static async getServices() {
    return prisma.service.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            complaints: true,
            users: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  static async getAllUsers(search?: string, role?: string) {
    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { matricule: { contains: search } },
      ];
    }

    return prisma.user.findMany({
      where,
      include: {
        service: true,
        faculty: true,
        studentProfile: {
          include: {
            promotion: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
