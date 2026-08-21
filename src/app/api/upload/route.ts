import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const uploaded = await saveUploadedFile(file);
    return NextResponse.json({ success: true, file: uploaded });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur lors du téléversement" },
      { status: 400 }
    );
  }
}
