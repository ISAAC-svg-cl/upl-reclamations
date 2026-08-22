"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AnalyticsChartsProps {
  categoryData: Array<{ name: string; count: number }>;
  statusData: Array<{ status: string; count: number }>;
  facultyData: Array<{ name: string; fullName: string; count: number }>;
}

const COLORS = ["#1E3A8A", "#D97706", "#059669", "#7C3AED", "#DC2626", "#0891B2"];

export function AnalyticsCharts({
  categoryData,
  statusData,
  facultyData,
}: AnalyticsChartsProps) {
  const statusLabels: Record<string, string> = {
    NEW: "Nouvelles",
    IN_PROGRESS: "En cours",
    WAITING_INFO: "Attente infos",
    FORWARDED: "Transmises",
    RESOLVED: "Traitées",
    CLOSED: "Clôturées",
    REJECTED: "Rejetées",
  };

  const formattedStatusData = statusData.map((d) => ({
    name: statusLabels[d.status] || d.status,
    value: d.count,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Répartition par statut */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">
            Répartition par Statut de Traitement
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {formattedStatusData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Aucune donnée à afficher
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {formattedStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Répartition par Filière */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">
            Volume de Réclamations par Filière
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {facultyData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Aucune donnée à afficher
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#888888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#1E3A8A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
