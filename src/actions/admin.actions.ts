"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function toggleUserStatusAction(userId: string) {
  try {
    await requireAuth(["ADMIN"]);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "Utilisateur introuvable" };

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    revalidatePath("/admin/users");
    return { success: true, isActive: updated.isActive };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createFacultyAction(data: { name: string; code: string; description?: string }) {
  try {
    await requireAuth(["ADMIN"]);
    const faculty = await prisma.faculty.create({ data });
    revalidatePath("/admin/faculties");
    return { success: true, faculty };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDepartmentAction(data: { facultyId: string; name: string; code: string; description?: string }) {
  try {
    await requireAuth(["ADMIN"]);
    const dept = await prisma.department.create({ data });
    revalidatePath("/admin/faculties");
    return { success: true, dept };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createServiceAction(data: { name: string; code: string; email?: string; description?: string }) {
  try {
    await requireAuth(["ADMIN"]);
    const srv = await prisma.service.create({ data });
    revalidatePath("/admin/services");
    return { success: true, service: srv };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCategoryAction(data: { name: string; code: string; description?: string; slaDays?: number; defaultServiceId?: string }) {
  try {
    await requireAuth(["ADMIN"]);
    const cat = await prisma.complaintCategory.create({ data });
    revalidatePath("/admin/services");
    return { success: true, category: cat };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
