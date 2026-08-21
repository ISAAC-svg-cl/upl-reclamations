import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ComplaintService } from "@/services/complaint.service";
import { AcademicService } from "@/services/academic.service";
import { StatusBadge } from "@/components/complaints/StatusBadge";
import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import { PlusCircle, Search, Filter, FileText, MessageSquare, Paperclip } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StudentComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; categoryId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  const [categories, { items: complaints, total }] = await Promise.all([
    AcademicService.getCategories(),
    ComplaintService.getComplaintsList(user, {
      search: params.search,
      status: params.status,
      categoryId: params.categoryId,
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Mes Réclamations</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Consultez et suivez l'ensemble de vos dossiers déposés auprès des services de l'UPL
          </p>
        </div>

        <Link href="/student/complaints/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Déposer une réclamation</span>
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-4">
          <form method="GET" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Input
                name="search"
                placeholder="Recherche (référence, objet)..."
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
                <option value="WAITING_INFO">En attente d'informations</option>
                <option value="RESOLVED">Traitées</option>
                <option value="CLOSED">Clôturées</option>
                <option value="REJECTED">Rejetées</option>
              </select>
            </div>

            <div className="flex gap-2">
              <select
                name="categoryId"
                defaultValue={params.categoryId || ""}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Toutes les catégories</option>
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
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">Aucune réclamation trouvée</p>
            <p className="text-xs">Aucun dossier ne correspond à vos critères de recherche.</p>
          </Card>
        ) : (
          complaints.map((comp) => (
            <Link
              key={comp.id}
              href={`/student/complaints/${comp.id}`}
              className="block"
            >
              <Card className="p-4 sm:p-5 hover:border-primary/40 hover:shadow-md transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {comp.reference}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {comp.category.name}
                      </span>
                      {comp.service && (
                        <span className="text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          {comp.service.name}
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
                      <span>Déposée le {formatDateShort(comp.createdAt)}</span>
                      {comp._count.responses > 0 && (
                        <span className="flex items-center gap-1 font-medium">
                          <MessageSquare className="h-3.5 w-3.5 text-primary" />
                          {comp._count.responses} échange(s)
                        </span>
                      )}
                      {comp._count.attachments > 0 && (
                        <span className="flex items-center gap-1 font-medium">
                          <Paperclip className="h-3.5 w-3.5" />
                          {comp._count.attachments} justificatif(s)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                    <StatusBadge status={comp.status} />
                    <PriorityBadge priority={comp.priority} />
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
