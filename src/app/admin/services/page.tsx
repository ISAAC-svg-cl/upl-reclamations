import { AcademicService } from "@/services/academic.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2, Tag, Clock, Users, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const [services, categories] = await Promise.all([
    AcademicService.getServices(),
    AcademicService.getCategories(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-foreground">Services & Catégories</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Configuration des entités de traitement et des typologies de doléances
        </p>
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <span>Services Institutionnels UPL ({services.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv) => (
            <Card key={srv.id} className="p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{srv.name}</h3>
                  <span className="font-mono text-xs font-bold text-primary">{srv.code}</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {srv._count.complaints} réclamation(s)
                </span>
              </div>

              {srv.description && (
                <p className="text-xs text-muted-foreground">{srv.description}</p>
              )}

              <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span>Contact : {srv.email || "Non renseigné"}</span>
                <span className="flex items-center gap-1 font-medium">
                  <Users className="h-3.5 w-3.5" />
                  {srv._count.users} agent(s)
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Tag className="h-5 w-5 text-amber-600" />
          <span>Catégories de Réclamations & Délais SLA ({categories.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">{cat.name}</h3>
                <span className="font-mono text-[11px] font-bold bg-muted px-1.5 py-0.5 rounded">
                  {cat.code}
                </span>
              </div>

              {cat.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {cat.description}
                </p>
              )}

              <div className="pt-2 border-t space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Service par défaut :</span>
                  <span className="font-medium text-foreground">
                    {cat.defaultService?.name || "Général"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Délai estimé (SLA) :</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {cat.slaDays} jours ouvrés
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
