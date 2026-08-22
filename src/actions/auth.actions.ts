"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  setSessionCookie,
  clearSessionCookie,
  getCurrentUser,
} from "@/lib/auth";
import {
  loginSchema,
  registerStudentSchema,
  changePasswordSchema,
  LoginInput,
  RegisterStudentInput,
  ChangePasswordInput,
} from "@/schemas/auth.schema";

export async function loginAction(input: LoginInput) {
  try {
    const validated = loginSchema.parse(input);

    const candidateUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: validated.identifier.toLowerCase() },
          { email: validated.identifier },
          { matricule: validated.identifier },
          { matricule: validated.identifier.toLowerCase() },
        ],
      },
    });

    if (!candidateUsers || candidateUsers.length === 0) {
      return { success: false, error: "Identifiant ou mot de passe incorrect." };
    }

    let user = null;
    for (const candidate of candidateUsers) {
      const isValid = await verifyPassword(validated.password, candidate.passwordHash);
      if (isValid) {
        user = candidate;
        break;
      }
    }

    if (!user) {
      return { success: false, error: "Identifiant ou mot de passe incorrect." };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: "Votre compte est désactivé. Veuillez contacter l'administration de l'UPL.",
      };
    }

    const token = generateToken({ userId: user.id });
    await setSessionCookie(token);

    // Déterminer la redirection selon le rôle
    let redirectUrl = "/student/dashboard";
    if (user.role === "ADMIN") {
      redirectUrl = "/admin/dashboard";
    } else if (user.role === "STAFF") {
      redirectUrl = "/staff/dashboard";
    }

    return { success: true, redirectUrl };
  } catch (error: any) {
    return { success: false, error: error.message || "Une erreur est survenue lors de la connexion." };
  }
}

export async function registerStudentAction(input: RegisterStudentInput) {
  try {
    const validated = registerStudentSchema.parse(input);

    // Déterminer l'email institutionnel automatique
    const studentEmail = validated.email
      ? validated.email.toLowerCase()
      : `${validated.matricule.toLowerCase().replace(/[^a-z0-9]/g, "")}@etudiant.upl-univ.ac`;

    // Vérifier unicité email et matricule
    const existingEmail = await prisma.user.findUnique({
      where: { email: studentEmail },
    });
    if (existingEmail) {
      return { success: false, error: "Un compte avec cet identifiant/email existe déjà." };
    }

    const existingMatricule = await prisma.user.findFirst({
      where: { matricule: validated.matricule, role: "STUDENT" },
    });
    if (existingMatricule) {
      return { success: false, error: "Ce numéro de matricule UPL est déjà utilisé par un étudiant." };
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        email: studentEmail,
        matricule: validated.matricule,
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone,
        role: "STUDENT",
        passwordHash,
        studentProfile: {
          create: {
            promotionId: validated.promotionId,
            academicYear: "2025-2026",
          },
        },
      },
    });

    const token = generateToken({ userId: user.id });
    await setSessionCookie(token);

    return { success: true, redirectUrl: "/student/dashboard" };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de la création du compte." };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

export async function changePasswordAction(input: ChangePasswordInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
    }

    const validated = changePasswordSchema.parse(input);

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return { success: false, error: "Utilisateur introuvable." };
    }

    const isValid = await verifyPassword(validated.currentPassword, dbUser.passwordHash);
    if (!isValid) {
      return { success: false, error: "Le mot de passe actuel est incorrect." };
    }

    const newHash = await hashPassword(validated.newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    revalidatePath("/profile");
    return { success: true, message: "Mot de passe modifié avec succès." };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors du changement de mot de passe." };
  }
}
