import { AcademicService } from "@/services/academic.service";
import { NewComplaintForm } from "@/components/complaints/NewComplaintForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function NewComplaintPage() {
  const categories = await AcademicService.getCategories();

  const formattedCats = categories.map((c) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    description: c.description,
    slaDays: c.slaDays,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/student/complaints">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-foreground">
            Déposer une Nouvelle Réclamation
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Formulez votre demande avec précision afin de faciliter son instruction par l'UPL
          </p>
        </div>
      </div>

      <NewComplaintForm categories={formattedCats} />
    </div>
  );
}
