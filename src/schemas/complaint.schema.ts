import { z } from "zod";

export const createComplaintSchema = z.object({
  categoryId: z.string().min(1, "Veuillez choisir une catégorie de réclamation"),
  subject: z
    .string()
    .min(5, "L'objet doit comporter au moins 5 caractères")
    .max(150, "L'objet ne doit pas dépasser 150 caractères"),
  description: z
    .string()
    .min(20, "Veuillez détailler précisément votre réclamation (min. 20 caractères)"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  facultyId: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
  promotionId: z.string().optional().nullable(),
  attachments: z
    .array(
      z.object({
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
      })
    )
    .optional(),
});

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;

export const addResponseSchema = z.object({
  complaintId: z.string().min(1),
  message: z.string().min(3, "Le message ne peut pas être vide"),
  isInternal: z.boolean().default(false),
  attachments: z
    .array(
      z.object({
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
      })
    )
    .optional(),
});

export type AddResponseInput = z.infer<typeof addResponseSchema>;

export const updateStatusSchema = z.object({
  complaintId: z.string().min(1),
  status: z.enum([
    "NEW",
    "IN_PROGRESS",
    "WAITING_INFO",
    "FORWARDED",
    "RESOLVED",
    "CLOSED",
    "REJECTED",
  ]),
  reason: z.string().optional(),
  assignedServiceId: z.string().optional().nullable(),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

export const complaintFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  categoryId: z.string().optional(),
  serviceId: z.string().optional(),
  facultyId: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
});

export type ComplaintFilterInput = z.infer<typeof complaintFilterSchema>;
