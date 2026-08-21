import { StatsService } from "@/services/stats.service";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle2, Flame, Clock, BarChart3, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const stats = await StatsService.getAdminDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-foreground">Statistiques & Rapports Décanaux</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Indicateurs de performance institutionnelle et analyse décisionnelle UPL
        </p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total des dossiers"
          value={stats.totalComplaints}
          subtitle="Toutes sessions"
          icon={FileText}
          variant="slate"
        />
        <MetricCard
          title="Taux de Résolution"
          value={`${stats.resolutionRate}%`}
          subtitle={`${stats.resolvedComplaints} résolues`}
          icon={CheckCircle2}
          variant="emerald"
        />
        <MetricCard
          title="En attente"
          value={stats.newComplaints}
          subtitle="Non prises en charge"
          icon={Clock}
          variant="purple"
        />
        <MetricCard
          title="Cas critiques"
          value={stats.urgentComplaints}
          subtitle="Priorité urgente"
          icon={Flame}
          variant="rose"
        />
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts
        categoryData={stats.categoryDistribution}
        statusData={stats.statusDistribution}
        facultyData={stats.facultyDistribution}
      />

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-xs">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-bold">Répartition par Catégorie</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3 text-left">Catégorie</th>
                  <th className="p-3 text-center">Code</th>
                  <th className="p-3 text-right">Dossiers</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.categoryDistribution.map((cat, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="p-3 font-medium text-foreground">{cat.name}</td>
                    <td className="p-3 text-center font-mono text-muted-foreground">{cat.code}</td>
                    <td className="p-3 text-right font-bold text-primary">{cat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-bold">Répartition par Faculté</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 border-b text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3 text-left">Faculté</th>
                  <th className="p-3 text-center">Sigle</th>
                  <th className="p-3 text-right">Dossiers</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.facultyDistribution.map((fac, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="p-3 font-medium text-foreground">{fac.fullName}</td>
                    <td className="p-3 text-center font-mono text-muted-foreground">{fac.name}</td>
                    <td className="p-3 text-right font-bold text-primary">{fac.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
