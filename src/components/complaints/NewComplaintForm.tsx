"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createComplaintAction } from "@/actions/complaint.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  code: string;
  description: string | null;
  slaDays: number;
}

interface NewComplaintFormProps {
  categories: CategoryOption[];
}

export function NewComplaintForm({ categories }: NewComplaintFormProps) {
  const router = useRouter();

  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState<"LOW" | "NORMAL" | "HIGH" | "URGENT">("NORMAL");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [attachments, setAttachments] = useState<
    Array<{ fileName: string; fileUrl: string; fileSize: number; mimeType: string }>
  >([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Échec du téléversement");
        }

        setAttachments((prev) => [...prev, data.file]);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors du téléversement du fichier.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError("Veuillez sélectionner la catégorie de votre réclamation.");
      return;
    }
    if (subject.length < 5) {
      setError("L'objet doit comporter au moins 5 caractères.");
      return;
    }
    if (description.length < 20) {
      setError("La description détaillée doit comporter au moins 20 caractères.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await createComplaintAction({
      categoryId,
      priority,
      subject: subject.trim(),
      description: description.trim(),
      attachments,
    });

    setSubmitting(false);

    if (!res.success) {
      setError(res.error || "Une erreur est survenue lors de l'enregistrement.");
    } else {
      router.push(`/student/complaints/${res.complaintId}`);
    }
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Sélection Catégorie */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            1. Catégorie de la réclamation
          </CardTitle>
          <CardDescription>
            Choisissez le domaine précis auquel se rattache votre doléance à l'UPL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <p className="font-bold text-sm text-foreground">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  <div className="mt-2 text-[10px] text-primary font-semibold flex items-center gap-1">
                    <span>Délai estimé : {cat.slaDays} jours ouvrés</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. Priorité et Objet */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            2. Objet & Degré d'urgence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Degré de priorité :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: "LOW", label: "Faible", desc: "Non bloquant" },
                { value: "NORMAL", label: "Normale", desc: "Traitement standard" },
                { value: "HIGH", label: "Élevée", desc: "Délai serré" },
                { value: "URGENT", label: "Urgente", desc: "Bloquant (Ex: examen imminent)" },
              ].map((p) => {
                const isSelected = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value as any)}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground font-bold"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <p className="text-xs">{p.label}</p>
                    <p className={`text-[10px] ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Objet synthétique de la réclamation :
            </label>
            <Input
              placeholder="Ex: Omission de note en Génie Logiciel - Session Février"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Description détaillée et circonstances :
            </label>
            <Textarea
              placeholder="Exposez clairement les faits : nom du cours, enseignant, date de passation, numéro de bordereau bancaire, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[140px]"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Pièces Jointes */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
            <span>3. Pièces justificatives (Optionnel)</span>
            <span className="text-xs font-normal text-muted-foreground">PDF, JPG, PNG (Max 5 Mo)</span>
          </CardTitle>
          <CardDescription>
            Joignez les documents attestant de votre situation (bordereau de paiement, copie de fiche d'émargement, photo de carte)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 text-center cursor-pointer relative bg-muted/20 transition-all">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <UploadCloud className="h-8 w-8 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                {uploading ? "Téléversement en cours..." : "Cliquez ou glissez-déposez vos justificatifs ici"}
              </p>
              <p className="text-xs text-muted-foreground">Formats acceptés : PDF, PNG, JPG (jusqu'à 5 Mo)</p>
            </div>
          </div>

          {/* Liste des pièces jointes ajoutées */}
          {attachments.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-foreground">Fichiers rattachés ({attachments.length}) :</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate font-medium">{att.fileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="text-muted-foreground hover:text-destructive p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t bg-muted/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Une référence unique (ex: <code className="font-mono font-bold text-primary">UPL-REC-2026-XXXXXX</code>) sera générée.
          </p>
          <Button type="submit" size="lg" isLoading={submitting} className="w-full sm:w-auto px-8 gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Soumettre la réclamation</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
