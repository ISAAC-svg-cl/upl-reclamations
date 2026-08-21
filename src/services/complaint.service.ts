import { prisma } from "@/lib/db";
import { UPL_INSTITUTION_CONFIG } from "@/config/institution";
import { ComplaintPriority, ComplaintStatus, UserSession } from "@/types";
import { CreateComplaintInput } from "@/schemas/complaint.schema";

export class ComplaintService {
  /**
   * Génère une référence institutionnelle unique et continue (ex: UPL-REC-2026-000001)
   */
  static async generateReference(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `${UPL_INSTITUTION_CONFIG.academic.referencePrefix}-${currentYear}`;

    const count = await prisma.complaint.count({
      where: {
        reference: {
          startsWith: prefix,
        },
      },
    });

    const sequence = String(count + 1).padStart(6, "0");
    return `${prefix}-${sequence}`;
  }

  /**
   * Crée une nouvelle réclamation déposée par un étudiant
   */
  static async createComplaint(
    user: UserSession,
    data: CreateComplaintInput
  ) {
    if (user.role !== "STUDENT" && user.role !== "ADMIN") {
      throw new Error("Seuls les étudiants ou l'administration peuvent soumettre une réclamation.");
    }

    const reference = await this.generateReference();

    // Déterminer le service par défaut si non spécifié
    const category = await prisma.complaintCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error("Catégorie de réclamation introuvable.");
    }

    // Récupérer le profil étudiant pour associer faculté/département/promotion
    const student = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        studentProfile: {
          include: {
            promotion: {
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
            },
          },
        },
      },
    });

    const promotion = student?.studentProfile?.promotion;
    const department = promotion?.program.department;
    const faculty = department?.faculty;

    return await prisma.$transaction(async (tx) => {
      const complaint = await tx.complaint.create({
        data: {
          reference,
          subject: data.subject,
          description: data.description,
          priority: data.priority,
          status: "NEW",
          studentId: user.id,
          categoryId: data.categoryId,
          serviceId: category.defaultServiceId,
          facultyId: data.facultyId || faculty?.id,
          departmentId: data.departmentId || department?.id,
          promotionId: data.promotionId || promotion?.id,
          history: {
            create: {
              authorId: user.id,
              fromStatus: null,
              toStatus: "NEW",
              reason: "Dépôt initial de la réclamation",
            },
          },
          attachments: data.attachments && data.attachments.length > 0
            ? {
                create: data.attachments.map((att) => ({
                  fileName: att.fileName,
                  fileUrl: att.fileUrl,
                  fileSize: att.fileSize,
                  mimeType: att.mimeType,
                })),
              }
            : undefined,
        },
        include: {
          category: true,
          service: true,
          faculty: true,
        },
      });

      // Notifier l'étudiant de la confirmation
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Réclamation enregistrée",
          message: `Votre réclamation N° ${reference} a été enregistrée avec succès.`,
          type: "COMPLAINT_CREATED",
          link: `/student/complaints/${complaint.id}`,
        },
      });

      return complaint;
    });
  }

  /**
   * Met à jour le statut d'une réclamation avec traçabilité obligatoire
   */
  static async updateStatus(
    user: UserSession,
    params: {
      complaintId: string;
      status: ComplaintStatus;
      reason?: string;
      assignedServiceId?: string | null;
    }
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.complaintId },
      include: { student: true, service: true },
    });

    if (!complaint) {
      throw new Error("Réclamation introuvable.");
    }

    // Contrôle d'accès RBAC
    if (user.role === "STUDENT" && params.status !== "CLOSED") {
      throw new Error("Un étudiant ne peut que clôturer une réclamation résolue.");
    }

    if (user.role === "STAFF" && complaint.serviceId !== user.serviceId && user.serviceId) {
      throw new Error("Cette réclamation n'est pas assignée à votre service.");
    }

    const fromStatus = complaint.status as ComplaintStatus;
    const toStatus = params.status;
    const now = new Date();

    return await prisma.$transaction(async (tx) => {
      const updated = await tx.complaint.update({
        where: { id: params.complaintId },
        data: {
          status: toStatus,
          serviceId: params.assignedServiceId !== undefined ? params.assignedServiceId : complaint.serviceId,
          resolvedAt: toStatus === "RESOLVED" ? now : complaint.resolvedAt,
          closedAt: toStatus === "CLOSED" ? now : complaint.closedAt,
        },
      });

      // Audit Trail dans l'historique
      await tx.complaintHistory.create({
        data: {
          complaintId: complaint.id,
          authorId: user.id,
          fromStatus,
          toStatus,
          reason: params.reason || `Transition de statut vers ${toStatus} par ${user.fullName}`,
        },
      });

      // Notification pour l'étudiant
      let notifTitle = "Mise à jour de votre réclamation";
      let notifMsg = `Le statut de votre réclamation ${complaint.reference} est passé à : ${toStatus}`;

      if (toStatus === "RESOLVED") {
        notifTitle = "Réclamation traitée";
        notifMsg = `Votre réclamation ${complaint.reference} a été résolue par les services de l'UPL.`;
      } else if (toStatus === "WAITING_INFO") {
        notifTitle = "Complément d'information requis";
        notifMsg = `L'administration demande des informations complémentaires pour ${complaint.reference}.`;
      } else if (toStatus === "REJECTED") {
        notifTitle = "Réclamation non recevable";
        notifMsg = `Votre réclamation ${complaint.reference} a été rejetée. Motif : ${params.reason || "Non spécifié"}`;
      }

      await tx.notification.create({
        data: {
          userId: complaint.studentId,
          title: notifTitle,
          message: notifMsg,
          type: "STATUS_UPDATED",
          link: `/student/complaints/${complaint.id}`,
        },
      });

      return updated;
    });
  }

  /**
   * Ajoute une réponse / message au dossier de réclamation
   */
  static async addResponse(
    user: UserSession,
    params: {
      complaintId: string;
      message: string;
      isInternal?: boolean;
      attachments?: Array<{
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
      }>;
    }
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.complaintId },
      include: { student: true },
    });

    if (!complaint) {
      throw new Error("Réclamation introuvable.");
    }

    // RBAC
    if (user.role === "STUDENT" && complaint.studentId !== user.id) {
      throw new Error("Vous ne pouvez répondre qu'à vos propres réclamations.");
    }

    const isInternal = user.role !== "STUDENT" && Boolean(params.isInternal);

    return await prisma.$transaction(async (tx) => {
      const response = await tx.complaintResponse.create({
        data: {
          complaintId: params.complaintId,
          authorId: user.id,
          message: params.message,
          isInternal,
          attachments: params.attachments && params.attachments.length > 0
            ? {
                create: params.attachments.map((att) => ({
                  fileName: att.fileName,
                  fileUrl: att.fileUrl,
                  fileSize: att.fileSize,
                  mimeType: att.mimeType,
                })),
              }
            : undefined,
        },
        include: {
          author: true,
          attachments: true,
        },
      });

      // Si c'est une réponse publique d'un agent pour un étudiant
      if (!isInternal && user.id !== complaint.studentId) {
        await tx.notification.create({
          data: {
            userId: complaint.studentId,
            title: "Nouvelle réponse reçue",
            message: `Une nouvelle réponse a été apportée à votre réclamation ${complaint.reference}.`,
            type: "RESPONSE_ADDED",
            link: `/student/complaints/${complaint.id}`,
          },
        });
      }

      // Si l'étudiant répond alors qu'on attendait des infos, basculer automatiquement en IN_PROGRESS
      if (user.id === complaint.studentId && complaint.status === "WAITING_INFO") {
        await tx.complaint.update({
          where: { id: complaint.id },
          data: { status: "IN_PROGRESS" },
        });

        await tx.complaintHistory.create({
          data: {
            complaintId: complaint.id,
            authorId: user.id,
            fromStatus: "WAITING_INFO",
            toStatus: "IN_PROGRESS",
            reason: "Complément d'information transmis par l'étudiant",
          },
        });
      }

      return response;
    });
  }

  /**
   * Récupère une réclamation par son identifiant ou référence avec vérification des droits
   */
  static async getComplaintById(user: UserSession, idOrRef: string) {
    const complaint = await prisma.complaint.findFirst({
      where: {
        OR: [{ id: idOrRef }, { reference: idOrRef }],
      },
      include: {
        student: {
          include: {
            studentProfile: {
              include: {
                promotion: {
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
                },
              },
            },
          },
        },
        category: true,
        service: true,
        faculty: true,
        department: true,
        promotion: true,
        attachments: true,
        history: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        responses: {
          where: user.role === "STUDENT" ? { isInternal: false } : {},
          include: {
            author: true,
            attachments: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!complaint) return null;

    // RBAC: un étudiant ne voit que la sienne
    if (user.role === "STUDENT" && complaint.studentId !== user.id) {
      throw new Error("Accès refusé : ce dossier appartient à un autre étudiant.");
    }

    return complaint;
  }

  /**
   * Récupère la liste des réclamations avec filtres selon le profil de l'utilisateur
   */
  static async getComplaintsList(
    user: UserSession,
    filters?: {
      search?: string;
      status?: string;
      priority?: string;
      categoryId?: string;
      serviceId?: string;
      facultyId?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const where: any = {};

    // Restriction selon le rôle
    if (user.role === "STUDENT") {
      where.studentId = user.id;
    } else if (user.role === "STAFF") {
      if (user.serviceId) {
        where.OR = [
          { serviceId: user.serviceId },
          { facultyId: user.facultyId || undefined },
        ];
      }
    }

    // Filtres dynamiques
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.serviceId) where.serviceId = filters.serviceId;
    if (filters?.facultyId) where.facultyId = filters.facultyId;

    if (filters?.search) {
      where.OR = [
        { reference: { contains: filters.search } },
        { subject: { contains: filters.search } },
        { student: { firstName: { contains: filters.search } } },
        { student: { lastName: { contains: filters.search } } },
        { student: { matricule: { contains: filters.search } } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.complaint.count({ where }),
      prisma.complaint.findMany({
        where,
        include: {
          student: {
            include: {
              studentProfile: {
                include: {
                  promotion: true,
                },
              },
            },
          },
          category: true,
          service: true,
          faculty: true,
          _count: {
            select: {
              responses: true,
              attachments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: filters?.limit || 20,
        skip: filters?.offset || 0,
      }),
    ]);

    return { total, items };
  }
}
