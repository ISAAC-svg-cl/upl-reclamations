import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function saveUploadedFile(file: File): Promise<{
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Format de fichier non supporté. Seuls les PDF, JPG et PNG sont autorisés.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Le fichier est trop volumineux (Taille maximale autorisée : 5 Mo).");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const fileExt = path.extname(file.name) || ".bin";
  const sanitizedOriginalName = path
    .basename(file.name, fileExt)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 30);

  const randomId = Math.random().toString(36).substring(2, 10);
  const safeFileName = `${Date.now()}_${sanitizedOriginalName}_${randomId}${fileExt}`;
  const filePath = path.join(uploadDir, safeFileName);

  await writeFile(filePath, buffer);

  return {
    fileName: file.name,
    fileUrl: `/uploads/${safeFileName}`,
    fileSize: file.size,
    mimeType: file.type,
  };
}
