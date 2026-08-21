import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { StatsService } from "@/services/stats.service";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusBadge } from "@/components/complaints/StatusBadge";
import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import { redirect } from "next/navigation";
import { FileText, Clock, CheckCircle2, AlertCircle, PlusCircle, ArrowRight, FolderOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const stats = await StatsService.getStudentDashboardStats(user);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-linear-to-r from-primary/15 via-primary/5 to-background border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-2xl bg-white shadow-md border p-1.5 shrink-0 hidden sm:flex items-center justify-center overflow-hidden">
            <img
              src="/branding/logo.png"
              alt="Logo UPL"
              className="object-contain w-full h-full"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                Bonjour, {user.firstName} 👋
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary">
                UPL
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Portail Réclamations UPL • Matricule :{" "}
              <strong className="text-foreground">{user.matricule || "Non renseigné"}</strong> •{" "}
              {user.promotionName || "Étudiant UPL"}
            </p>
          </div>
        </div>

        <Link href="/student/complaints/new">
          <Button size="lg" className="gap-2 shadow-md">
            <PlusCircle className="h-5 w-5" />
            <span>Nouvelle réclamation</span>
          </Button>
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Déposées"
          value={stats.total}
          subtitle="Historique complet"
          icon={FileText}
          variant="slate"
        />
        <MetricCard
          title="En attente / Nouvelles"
          value={stats.newCount}
          subtitle="Non encore assignées"
          icon={AlertCircle}
          variant="blue"
        />
        <MetricCard
          title="En cours d'instruction"
          value={stats.inProgress + stats.waitingInfo}
          subtitle="Traitement actif"
          icon={Clock}
          variant="amber"
        />
        <MetricCard
          title="Résolues & Clôturées"
          value={stats.resolved + stats.closed}
          subtitle="Dossiers finalisés"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Dernières réclamations & Actions */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <span>Vos Dernières Réclamations</span>
          </CardTitle>

          <Link href="/student/complaints">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <span>Voir tout</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {stats.recentComplaints.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Aucune réclamation enregistrée
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Vous n'avez soumis aucune requête pour le moment. En cas de contestation ou de difficulté académique, créez un dossier.
              </p>
              <Link href="/student/complaints/new" className="inline-block pt-2">
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Déposer ma première réclamation</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {stats.recentComplaints.map((comp) => (
                <Link
                  key={comp.id}
                  href={`/student/complaints/${comp.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 hover:bg-muted/40 px-2 rounded-lg transition-colors group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        {comp.reference}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {comp.category.name}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {comp.subject}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <PriorityBadge priority={comp.priority} />
                    <StatusBadge status={comp.status} />
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {formatDateShort(comp.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
