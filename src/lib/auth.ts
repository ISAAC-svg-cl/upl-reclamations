import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserSession, Role } from "@/types";
import { prisma } from "./db";

const JWT_SECRET = process.env.AUTH_SECRET || "upl_reclamations_secret_jwt_key_katanga_2026";
const COOKIE_NAME = "upl_session_token";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { userId: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 jours
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        service: true,
        faculty: true,
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

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      email: user.email,
      matricule: user.matricule,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role as Role,
      serviceId: user.serviceId,
      serviceName: user.service?.name,
      facultyId: user.facultyId || user.studentProfile?.promotion?.program.department.faculty.id,
      facultyName: user.faculty?.name || user.studentProfile?.promotion?.program.department.faculty.name,
      promotionName: user.studentProfile?.promotion?.name,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return null;
  }
}

export async function requireAuth(allowedRoles?: Array<"STUDENT" | "STAFF" | "ADMIN">): Promise<UserSession> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED: Session non valide ou expirée.");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN: Vous n'avez pas les autorisations nécessaires.");
  }

  return user;
}
