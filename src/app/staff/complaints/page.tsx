import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ComplaintService } from "@/services/complaint.service";
import { AcademicService } from "@/services/academic.service";
import { StatusBadge } from "@/components/complaints/StatusBadge";
import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { SlaBadge } from "@/components/complaints/SlaBadge";
import { ExportComplaintsButton } from "@/components/complaints/ExportComplaintsButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import { Search, Inbox, MessageSquare, Paperclip } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StaffComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; priority?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  const { items: complaints, total } = await ComplaintService.getComplaintsList(user, {
    search: params.search,
    status: params.status,
    priority: params.priority,
  });

  const exportData = complaints.map((c) => ({
    reference: c.reference,
    createdAt: c.createdAt,
    studentName: `${c.student.lastName} ${c.student.firstName}`,
    matricule: c.student.matricule || "N/A",
    filiere: "Sciences Informatiques",
    promotion: "BAC",
    category: c.category.name,
    priority: c.priority,
    status: c.status,
    subject: c.subject,
    service: c.service?.name || user.serviceName || "Décanat FSI",
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">
            File des Réclamations — {user.serviceName || "Service"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {total} dossier(s) assigné(s) à votre entité pour instruction et traitement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportComplaintsButton data={exportData} filename="dossiers_decanat_fsi.csv" />
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-4">
          <form method="GET" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Input
                name="search"
                placeholder="Recherche (réf, nom étudiant, objet)..."
                defaultValue={params.search || ""}
                className="pl-8 text-xs sm:text-sm"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <select
                name="status"
                defaultValue={params.status || ""}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Tous les statuts</option>
                <option value="NEW">Nouvelles</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="WAITING_INFO">En attente d'infos</option>
                <option value="FORWARDED">Transmises</option>
                <option value="RESOLVED">Traitées</option>
                <option value="CLOSED">Clôturées</option>
                <option value="REJECTED">Rejetées</option>
              </select>
            </div>

            <div className="flex gap-2">
              <select
                name="priority"
                defaultValue={params.priority || ""}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Toutes les priorités</option>
                <option value="URGENT">Urgente</option>
                <option value="HIGH">Élevée</option>
                <option value="NORMAL">Normale</option>
                <option value="LOW">Faible</option>
              </select>

              <Button type="submit" size="sm" variant="secondary" className="shrink-0 px-4">
                Filtrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-3">
        {complaints.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground shadow-xs">
            <Inbox className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">Aucun dossier trouvé</p>
            <p className="text-xs">Aucune réclamation ne correspond aux filtres appliqués.</p>
          </Card>
        ) : (
          complaints.map((comp) => (
            <Link
              key={comp.id}
              href={`/staff/complaints/${comp.id}`}
              className="block"
            >
              <Card className="p-4 sm:p-5 hover:border-primary/40 hover:shadow-md transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {comp.reference}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {comp.student.firstName} {comp.student.lastName} ({comp.student.matricule || "UPL"})
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {comp.category.name}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {comp.subject}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {comp.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      <span>Reçu le {formatDateShort(comp.createdAt)}</span>
                      {comp._count.responses > 0 && (
                        <span className="flex items-center gap-1 font-medium">
                          <MessageSquare className="h-3.5 w-3.5 text-primary" />
                          {comp._count.responses} message(s)
                        </span>
                      )}
                      {comp._count.attachments > 0 && (
                        <span className="flex items-center gap-1 font-medium">
                          <Paperclip className="h-3.5 w-3.5" />
                          {comp._count.attachments} pièce(s)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                    <StatusBadge status={comp.status} />
                    <PriorityBadge priority={comp.priority} />
                    <SlaBadge
                      createdAt={comp.createdAt}
                      status={comp.status}
                      resolvedAt={comp.resolvedAt}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
