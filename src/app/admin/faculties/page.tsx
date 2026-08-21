import { AcademicService } from "@/services/academic.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap, FolderTree, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminFacultiesPage() {
  const faculties = await AcademicService.getFaculties();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Facultés & Départements</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Arborescence académique de l'Université Protestante de Lubumbashi
        </p>
      </div>

      <div className="space-y-6">
        {faculties.map((fac) => (
          <Card key={fac.id} className="shadow-xs overflow-hidden">
            <CardHeader className="bg-primary/5 pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">{fac.name}</CardTitle>
                    <p className="text-xs text-muted-foreground font-mono">Code officiel : {fac.code}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Actif
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-4">
              {fac.description && (
                <p className="text-xs text-muted-foreground">{fac.description}</p>
              )}

              <div className="space-y-3">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <FolderTree className="h-4 w-4 text-primary" />
                  Départements rattachés ({fac.departments.length}) :
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fac.departments.map((dept) => (
                    <div key={dept.id} className="p-3 rounded-lg border bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground">{dept.name}</p>
                        <span className="text-[10px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded">
                          {dept.code}
                        </span>
                      </div>

                      {dept.programs.length > 0 && (
                        <div className="text-[11px] text-muted-foreground space-y-1 pt-1 border-t">
                          {dept.programs.map((prog) => (
                            <div key={prog.id} className="flex items-center gap-1.5">
                              <BookOpen className="h-3 w-3 text-primary" />
                              <span>{prog.name} ({prog.promotions.map((p) => p.name).join(", ")})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
