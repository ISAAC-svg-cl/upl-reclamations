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
import { Search, Files, MessageSquare, Paperclip, Building, Eye } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    categoryId?: string;
    serviceId?: string;
  }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  const [categories, services, { items: complaints, total }] = await Promise.all([
    AcademicService.getCategories(),
    AcademicService.getServices(),
    ComplaintService.getComplaintsList(user, {
      search: params.search,
      status: params.status,
      priority: params.priority,
      categoryId: params.categoryId,
      serviceId: params.serviceId,
    }),
  ]);

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
    service: c.service?.name || "Non assigné",
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">
            Supervision Globale des Réclamations UPL
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {total} réclamation(s) enregistrée(s) dans le système institutionnel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportComplaintsButton data={exportData} filename="rapport_reclamations_upl.csv" />
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-4">
          <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <Input
                name="search"
                placeholder="Recherche (réf, étudiant, objet)..."
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
                <option value="WAITING_INFO">Attente infos</option>
                <option value="FORWARDED">Transmises</option>
                <option value="RESOLVED">Traitées</option>
                <option value="CLOSED">Clôturées</option>
                <option value="REJECTED">Rejetées</option>
              </select>
            </div>

            <div>
              <select
                name="serviceId"
                defaultValue={params.serviceId || ""}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Tous les services</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <select
                name="categoryId"
                defaultValue={params.categoryId || ""}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Toutes catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
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
            <Files className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">Aucune réclamation trouvée</p>
            <p className="text-xs">Modifiez vos critères de recherche ou réinitialisez les filtres.</p>
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
                      {comp.service && (
                        <span className="text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          Service : {comp.service.name}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {comp.subject}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {comp.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      <span>Déposé le {formatDateShort(comp.createdAt)}</span>
                      {comp._count.responses > 0 && (
                        <span className="flex items-center gap-1 font-medium">
                          <MessageSquare className="h-3.5 w-3.5 text-primary" />
                          {comp._count.responses} réponse(s)
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
                      slaDays={comp.category.slaDays}
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
