import Link from "next/link";
import { UPL_INSTITUTION_CONFIG } from "@/config/institution";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Layers,
  Search,
  CheckCircle2,
  Lock,
  Building,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b bg-linear-to-b from-primary/10 via-background to-background py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Logo Officiel UPL */}
            <div className="flex justify-center">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 p-1 rounded-full bg-white shadow-xl border border-border flex items-center justify-center">
                <img
                  src="/branding/logo-upl-officiel.png"
                  alt="Logo officiel UPL"
                  className="object-contain w-full h-full rounded-full drop-shadow-sm"
                />
              </div>
            </div>

            {/* Tag institutionnel */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{UPL_INSTITUTION_CONFIG.name} — « Vérité et liberté »</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
              Gestion et Suivi Centralisé des{" "}
              <span className="text-primary underline decoration-secondary decoration-4 underline-offset-4">
                Réclamations Étudiantes
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {UPL_INSTITUTION_CONFIG.description} Déposez votre requête en ligne, joignez vos pièces justificatives et suivez l'avancement de votre dossier en temps réel.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 gap-2 shadow-lg shadow-primary/25">
                  <FileText className="h-5 w-5" />
                  <span>Déposer une réclamation</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                  Accéder à mon espace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 ÉTAPES CLÉS */}
      <section id="procedure" className="py-16 sm:py-20 bg-muted/30 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Comment fonctionne le processus ?
            </h2>
            <p className="text-sm text-muted-foreground">
              Un cycle de traitement clair, transparent et traçable en 4 étapes simples.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Dépôt en ligne",
                desc: "Remplissez le formulaire guidé, choisissez la catégorie et rattachez vos pièces justificatives.",
                icon: FileText,
              },
              {
                step: "02",
                title: "Numérotation unique",
                desc: "Un identifiant officiel UPL-REC est généré immédiatement pour garantir la traçabilité de votre dossier.",
                icon: Search,
              },
              {
                step: "03",
                title: "Instruction par le service",
                desc: "Le Décanat ou le service compétent prend en charge le dossier, vérifie les procès-verbaux et instruit la requête.",
                icon: Building,
              },
              {
                step: "04",
                title: "Résolution & Clôture",
                desc: "Vous recevez une notification avec la réponse officielle et la décision motivée de l'administration.",
                icon: CheckCircle2,
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative rounded-2xl border bg-card p-6 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <span className="text-3xl font-black text-primary/25">{s.step}</span>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AVANTAGES & SÉCURITÉ */}
      <section className="py-16 sm:py-20 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase">
                <ShieldCheck className="h-4 w-4" />
                <span>Garanties & Engagements UPL</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
                Une gouvernance académique basée sur la rigueur et l'équité
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fini les fiches égarées et les démarches informelles. La plateforme UPL Réclamations apporte une réponse informatique structurée répondant aux exigences des standards universitaires modernes.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Protection intégrale de la confidentialité des données académiques",
                  "Historique inaltérable et audit trail pour chaque transition d'état",
                  "Respect des délais d'instruction (SLA) par catégorie de réclamation",
                  "Canal de discussion direct et officiel avec les responsables habilités",
                ].map((adv, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte de contact & Localisation */}
            <div id="contact" className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 rounded-full bg-white border p-0.5 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src="/branding/logo-upl-officiel.png"
                    alt="Logo UPL"
                    className="object-contain w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{UPL_INSTITUTION_CONFIG.name}</h3>
                  <p className="text-xs text-muted-foreground">Coordination des Réclamations & Décanats</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-muted-foreground border-t pt-4">
                <p>
                  <strong className="text-foreground">Adresse : </strong>
                  {UPL_INSTITUTION_CONFIG.address.fullFormatted}
                </p>
                <p>
                  <strong className="text-foreground">E-mail académique : </strong>
                  {UPL_INSTITUTION_CONFIG.contacts.academicEmail}
                </p>
                <p>
                  <strong className="text-foreground">Support technique : </strong>
                  {UPL_INSTITUTION_CONFIG.contacts.supportEmail}
                </p>
                <p>
                  <strong className="text-foreground">Téléphone : </strong>
                  {UPL_INSTITUTION_CONFIG.contacts.phone}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Seuls les étudiants régulièrement inscrits à l'UPL disposant d'un numéro matricule valide peuvent créer un compte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
