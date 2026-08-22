import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Veuillez saisir votre email institutionnel ou votre numéro matricule"),
  password: z
    .string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerStudentSchema = z
  .object({
    firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
    matricule: z
      .string()
      .min(4, "Le matricule est obligatoire pour les étudiants UPL")
      .regex(/^[A-Za-z0-9\/-@_.]+$/, "Format de matricule non valide"),
    email: z.string().email("Adresse email non valide").optional(),
    phone: z.string().optional(),
    promotionId: z.string().min(1, "Veuillez sélectionner votre promotion"),
    password: z
      .string()
      .min(6, "Le mot de passe doit comporter au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(6, "Le nouveau mot de passe doit comporter au moins 6 caractères"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
