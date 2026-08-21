"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { ComplaintService } from "@/services/complaint.service";
import {
  createComplaintSchema,
  addResponseSchema,
  updateStatusSchema,
  CreateComplaintInput,
  AddResponseInput,
  UpdateStatusInput,
} from "@/schemas/complaint.schema";

export async function createComplaintAction(input: CreateComplaintInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Vous devez être connecté pour déposer une réclamation." };
    }

    const validated = createComplaintSchema.parse(input);
    const complaint = await ComplaintService.createComplaint(user, validated);

    revalidatePath("/student/dashboard");
    revalidatePath("/student/complaints");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/complaints");

    return { success: true, complaintId: complaint.id, reference: complaint.reference };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors du dépôt de la réclamation." };
  }
}

export async function updateStatusAction(input: UpdateStatusInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Session expirée." };
    }

    const validated = updateStatusSchema.parse(input);
    const updated = await ComplaintService.updateStatus(user, {
      complaintId: validated.complaintId,
      status: validated.status,
      reason: validated.reason,
      assignedServiceId: validated.assignedServiceId,
    });

    revalidatePath(`/student/complaints/${validated.complaintId}`);
    revalidatePath(`/staff/complaints/${validated.complaintId}`);
    revalidatePath(`/admin/complaints/${validated.complaintId}`);
    revalidatePath("/student/dashboard");
    revalidatePath("/staff/dashboard");
    revalidatePath("/admin/dashboard");

    return { success: true, complaint: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de la mise à jour du statut." };
  }
}

export async function addResponseAction(input: AddResponseInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Session expirée." };
    }

    const validated = addResponseSchema.parse(input);
    const response = await ComplaintService.addResponse(user, {
      complaintId: validated.complaintId,
      message: validated.message,
      isInternal: validated.isInternal,
      attachments: validated.attachments,
    });

    revalidatePath(`/student/complaints/${validated.complaintId}`);
    revalidatePath(`/staff/complaints/${validated.complaintId}`);
    revalidatePath(`/admin/complaints/${validated.complaintId}`);

    return { success: true, response };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de l'envoi de la réponse." };
  }
}
