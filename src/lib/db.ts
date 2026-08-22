import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function getDatabaseUrl(): string | undefined {
  // Si une URL de base cloud (ex: PostgreSQL) est définie, on la respecte
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    return process.env.DATABASE_URL;
  }

  // Sur Vercel Serverless / AWS Lambda, le dossier source est en lecture seule.
  // SQLite nécessite les droits d'écriture (fichiers de verrous .journal), on copie donc dev.db vers /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = "/tmp/dev.db";
    const srcDbPath = path.join(process.cwd(), "prisma", "dev.db");

    if (!fs.existsSync(tmpDbPath) && fs.existsSync(srcDbPath)) {
      try {
        fs.copyFileSync(srcDbPath, tmpDbPath);
      } catch (err) {
        console.error("Erreur lors de la copie de la base SQLite vers /tmp:", err);
      }
    }
    return `file:${tmpDbPath}`;
  }

  return process.env.DATABASE_URL || "file:./dev.db";
}

const customDbUrl = getDatabaseUrl();

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: customDbUrl
      ? {
          db: {
            url: customDbUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
