"use client";

import { useState } from "react";
import { UserSession } from "@/types";
import { addResponseAction } from "@/actions/complaint.actions";
import { formatTimeAgo, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Send, Lock, User, FileText, Download } from "lucide-react";

interface ResponseItem {
  id: string;
  message: string;
  isInternal: boolean;
  createdAt: Date | string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    service?: { name: string } | null;
  };
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>;
}

interface ResponseThreadProps {
  complaintId: string;
  currentUser: UserSession;
  responses: ResponseItem[];
  isClosed?: boolean;
}

export function ResponseThread({
  complaintId,
  currentUser,
  responses,
  isClosed = false,
}: ResponseThreadProps) {
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const res = await addResponseAction({
      complaintId,
      message: message.trim(),
      isInternal,
    });

    setIsSubmitting(false);
    if (!res.success) {
      setError(res.error || "Erreur lors de l'envoi");
    } else {
      setMessage("");
      setIsInternal(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Échanges et Réponses ({responses.length})</span>
          {isClosed && (
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2.5 py-1 rounded">
              Dossier clôturé
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Messages List */}
        {responses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Aucun message pour l'instant dans ce dossier.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((resp) => {
              const isMe = resp.author.id === currentUser.id;
              const isStaff = resp.author.role === "STAFF" || resp.author.role === "ADMIN";

              return (
                <div
                  key={resp.id}
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 shadow-xs ${
                      resp.isInternal
                        ? "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100"
                        : isMe
                        ? "bg-primary text-primary-foreground rounded-br-xs"
                        : isStaff
                        ? "bg-card border-2 border-primary/20 text-card-foreground rounded-bl-xs"
                        : "bg-muted text-foreground rounded-bl-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-xs opacity-90 border-b border-current/10 pb-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <User className="h-3.5 w-3.5" />
                        <span>{resp.author.firstName} {resp.author.lastName}</span>
                        {resp.isInternal && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded font-black">
                            <Lock className="h-2.5 w-2.5" /> NOTE INTERNE
                          </span>
                        )}
                        {resp.author.role === "STAFF" && !resp.isInternal && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                            STAFF UPL
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] shrink-0">{formatDate(resp.createdAt)}</span>
                    </div>

                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{resp.message}</p>

                    {resp.attachments && resp.attachments.length > 0 && (
                      <div className="pt-2 space-y-1">
                        {resp.attachments.map((att) => (
                          <a
                            key={att.id}
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded bg-background/20 hover:bg-background/40 transition-colors text-xs font-medium"
                          >
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="truncate flex-1">{att.fileName}</span>
                            <Download className="h-3.5 w-3.5 shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Input form if not closed */}
        {!isClosed && (
          <form onSubmit={handleSubmit} className="pt-4 border-t space-y-3">
            {error && <p className="text-xs text-destructive font-medium">{error}</p>}

            <Textarea
              placeholder={
                currentUser.role === "STUDENT"
                  ? "Rédigez votre réponse ou apportez un complément d'information..."
                  : "Rédigez une réponse officielle à l'étudiant ou une note interne..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[90px] text-sm"
              required
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              {currentUser.role !== "STUDENT" ? (
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-amber-600" />
                    Note interne (invisible pour l'étudiant)
                  </span>
                </label>
              ) : (
                <div />
              )}

              <Button type="submit" size="sm" isLoading={isSubmitting} className="gap-2">
                <Send className="h-4 w-4" />
                <span>Envoyer le message</span>
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
