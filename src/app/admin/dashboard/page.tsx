import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { StatsService } from "@/services/stats.service";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ShieldAlert,
  Users,
  GraduationCap,
  FileText,
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
  TrendingUp,
  Settings,
} from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const stats = await StatsService.getAdminDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-linear-to-r from-purple-900/10 via-primary/5 to-background border border-purple-500/20">
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
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                Administration Centrale UPL
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-muted text-muted-foreground">
                Projet PFE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              Tour de Contrôle des Réclamations
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Supervision globale, indicateurs de performance et traçabilité institutionnelle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/complaints">
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              <span>Voir toutes les réclamations</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Row 1: Global metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Réclamations"
          value={stats.totalComplaints}
          subtitle="Faculté des Sciences Informatiques"
          icon={FileText}
          variant="slate"
        />
        <MetricCard
          title="Nouvelles à Affecter"
          value={stats.newComplaints}
          subtitle="En attente de prise en charge"
          icon={Clock}
          variant="purple"
        />
        <MetricCard
          title="En Cours d'Instruction"
          value={stats.inProgressComplaints}
          subtitle="Instruction active"
          icon={TrendingUp}
          variant="amber"
        />
        <MetricCard
          title="Taux de Résolution"
          value={`${stats.resolutionRate}%`}
          subtitle={`${stats.resolvedComplaints} dossiers résolus`}
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Analytics Recharts Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Indicateurs Graphiques en Temps Réel</h2>
        <AnalyticsCharts
          categoryData={stats.categoryDistribution}
          statusData={stats.statusDistribution}
          facultyData={stats.departmentDistribution}
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/users" className="block group">
          <Card className="p-5 hover:border-primary/40 transition-all hover:shadow-md h-full">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  Utilisateurs ({stats.totalUsers})
                </h3>
                <p className="text-xs text-muted-foreground">{stats.totalStudents} étudiants inscrits</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/faculties" className="block group">
          <Card className="p-5 hover:border-primary/40 transition-all hover:shadow-md h-full">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  Facultés & Départements
                </h3>
                <p className="text-xs text-muted-foreground">Organisation académique</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/services" className="block group">
          <Card className="p-5 hover:border-primary/40 transition-all hover:shadow-md h-full">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  Services & Catégories
                </h3>
                <p className="text-xs text-muted-foreground">Paramétrage des délais SLA</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
