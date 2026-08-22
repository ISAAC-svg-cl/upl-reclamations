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
import { Inbox, Clock, CheckCircle2, Flame, ArrowRight, Building2, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StaffDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const stats = await StatsService.getStaffDashboardStats(user);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-linear-to-r from-blue-900/10 via-primary/5 to-background border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full bg-white shadow-md border p-0.5 shrink-0 hidden sm:flex items-center justify-center overflow-hidden">
            <img
              src="/branding/logo-upl-officiel.png"
              alt="Logo UPL"
              className="object-contain w-full h-full rounded-full"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {user.serviceName || "Service Décanat UPL"}
              </span>
              {user.facultyName && (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-muted text-muted-foreground">
                  {user.facultyName}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              Tableau de bord — Décanat / Service
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Connecté en tant que <strong>{user.firstName} {user.lastName}</strong> • Université Protestante de Lubumbashi
            </p>
          </div>
        </div>

        <Link href="/staff/complaints">
          <Button size="lg" className="gap-2 shadow-md">
            <Inbox className="h-5 w-5" />
            <span>Ouvrir la file active</span>
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="File du Service"
          value={stats.totalAssigned}
          subtitle="Dossiers assignés"
          icon={Inbox}
          variant="blue"
        />
        <MetricCard
          title="Nouvelles requêtes"
          value={stats.newCount}
          subtitle="À instruire en priorité"
          icon={FileText}
          variant="purple"
        />
        <MetricCard
          title="Cas Urgents"
          value={stats.urgentCount}
          subtitle="Délais critiques"
          icon={Flame}
          variant="rose"
        />
        <MetricCard
          title="Résolues par le service"
          value={stats.resolved}
          subtitle="Dossiers traités"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Recent Assigned Complaints */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Réclamations Récentes dans la File</span>
          </CardTitle>

          <Link href="/staff/complaints">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <span>Voir toute la file</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {stats.recentComplaints.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Inbox className="h-10 w-10 mx-auto text-muted-foreground/60 mb-2" />
              <p className="font-semibold text-foreground text-sm">Aucun dossier en attente</p>
              <p className="text-xs">Toutes les réclamations de votre service ont été instruites.</p>
            </div>
          ) : (
            <div className="divide-y">
              {stats.recentComplaints.map((comp) => (
                <Link
                  key={comp.id}
                  href={`/staff/complaints/${comp.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 hover:bg-muted/40 px-2 rounded-lg transition-colors group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">
                        {comp.reference}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-medium text-foreground">
                        {comp.student.firstName} {comp.student.lastName} ({comp.student.matricule || "UPL"})
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
