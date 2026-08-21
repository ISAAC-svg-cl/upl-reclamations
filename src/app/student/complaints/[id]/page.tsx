import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ComplaintService } from "@/services/complaint.service";
import { StatusBadge } from "@/components/complaints/StatusBadge";
import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { TimelineHistory } from "@/components/complaints/TimelineHistory";
import { ResponseThread } from "@/components/complaints/ResponseThread";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, FileText, Download, User, Building, Layers } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StudentComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;

  const complaint = await ComplaintService.getComplaintById(user, id);
  if (!complaint) {
    notFound();
  }

  const isClosed = complaint.status === "CLOSED" || complaint.status === "REJECTED";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar with Reference & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Link href="/student/complaints">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black text-primary">
                {complaint.reference}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-muted-foreground">
                {complaint.category.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              {complaint.subject}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Thread */}
        <div className="lg:col-span-2 space-y-6">
          {/* Initial Complaint Card */}
          <Card className="shadow-xs border-primary/20">
            <CardHeader className="bg-primary/5 pb-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-primary">Déposé le {formatDate(complaint.createdAt)}</span>
                {complaint.service && (
                  <span className="font-medium bg-background px-2 py-0.5 rounded border">
                    Assigné à : {complaint.service.name}
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                  {complaint.description}
                </p>
              </div>

              {/* Pièces jointes initiales */}
              {complaint.attachments.length > 0 && (
                <div className="pt-4 border-t space-y-2">
                  <p className="text-xs font-bold text-foreground">
                    Pièces justificatives jointes ({complaint.attachments.length}) :
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {complaint.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted transition-colors text-xs font-medium group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="truncate">{att.fileName}</span>
                        </div>
                        <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Response Chat Thread */}
          <ResponseThread
            complaintId={complaint.id}
            currentUser={user}
            responses={complaint.responses as any}
            isClosed={isClosed}
          />
        </div>

        {/* Right Column: Information & Timeline */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold">Informations Dossier</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <p className="text-muted-foreground">Catégorie</p>
                <p className="font-semibold text-foreground">{complaint.category.name}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Service compétent UPL</p>
                <p className="font-semibold text-foreground">{complaint.service?.name || "En cours d'affectation"}</p>
              </div>

              {complaint.faculty && (
                <div>
                  <p className="text-muted-foreground">Faculté</p>
                  <p className="font-semibold text-foreground">{complaint.faculty.name}</p>
                </div>
              )}

              {complaint.promotion && (
                <div>
                  <p className="text-muted-foreground">Promotion</p>
                  <p className="font-semibold text-foreground">{complaint.promotion.name}</p>
                </div>
              )}

              <div className="pt-2 border-t text-[11px] text-muted-foreground space-y-1">
                <p>Création : {formatDate(complaint.createdAt)}</p>
                <p>Dernière mise à jour : {formatDate(complaint.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline History Stepper */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-bold">Historique du Traitement</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <TimelineHistory events={complaint.history as any} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
