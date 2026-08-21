import { AcademicService } from "@/services/academic.service";
import { RegisterForm } from "./RegisterForm";
import { UPL_INSTITUTION_CONFIG } from "@/config/institution";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const promotions = await AcademicService.getPromotionsList();

  const formattedPromos = promotions.map((p) => ({
    id: p.id,
    name: p.name,
    facultyName: p.program.department.faculty.name,
  }));

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-muted/20">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="relative h-20 w-20 p-2 rounded-2xl bg-white shadow-lg border border-border flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <img
                src="/branding/logo.png"
                alt="Logo Officiel Université Protestante de Lubumbashi"
                className="object-contain w-full h-full"
              />
            </div>
            <div className="mt-3 space-y-1">
              <span className="font-extrabold text-sm text-primary tracking-wide block">
                UNIVERSITÉ PROTESTANTE DE LUBUMBASHI
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                « Vérité et liberté »
              </span>
            </div>
          </Link>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Inscription Étudiant UPL
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Créez votre compte pour soumettre et suivre vos réclamations académiques
            </p>
          </div>
        </div>

        <RegisterForm promotions={formattedPromos} />
      </div>
    </div>
  );
}
