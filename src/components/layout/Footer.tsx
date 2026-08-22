import { UPL_INSTITUTION_CONFIG } from "@/config/institution";
import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck, GraduationCap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Institution Presentation */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 flex items-center justify-center rounded-full bg-white shadow-xs border p-0.5 shrink-0 overflow-hidden">
                <img
                  src="/branding/logo-upl-officiel.png"
                  alt="Logo UPL"
                  className="object-contain w-full h-full rounded-full"
                />
              </div>
              <span className="font-bold text-lg text-primary">
                {UPL_INSTITUTION_CONFIG.appFunctionalName}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {UPL_INSTITUTION_CONFIG.tagline}. Un outil moderne dédié à l'excellence académique, à l'équité de traitement et à la transparence des délibérations.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Plateforme conforme aux standards informatiques et académiques UPL</span>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Coordonnées Officielles</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{UPL_INSTITUTION_CONFIG.address.fullFormatted}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href={`mailto:${UPL_INSTITUTION_CONFIG.contacts.email}`} className="hover:text-primary transition-colors">
                  {UPL_INSTITUTION_CONFIG.contacts.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{UPL_INSTITUTION_CONFIG.contacts.phone}</span>
              </li>
            </ul>
          </div>

          {/* Quick links & Portal */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Liens Utiles</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a
                  href={UPL_INSTITUTION_CONFIG.web.officialSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1.5"
                >
                  <GraduationCap className="h-3.5 w-3.5" /> Site officiel de l'UPL
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Portail de connexion
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Inscription compte étudiant
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>
            © {currentYear} {UPL_INSTITUTION_CONFIG.name} ({UPL_INSTITUTION_CONFIG.shortName}). Tous droits réservés.
          </p>
          <p className="italic">
            Projet de Fin d'Études en Informatique — Lubumbashi, RDC
          </p>
        </div>
      </div>
    </footer>
  );
}
