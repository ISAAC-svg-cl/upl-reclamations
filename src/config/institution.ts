/**
 * Configuration Institutionnelle Centralisée de l'Université Protestante de Lubumbashi (UPL)
 * 
 * Toutes les informations institutionnelles officielles ou configurables sont centralisées ici.
 * Si l'administration modifie un contact, une adresse ou une couleur, seule cette configuration est impactée.
 */

export interface InstitutionalConfig {
  name: string;
  shortName: string;
  appFunctionalName: string;
  tagline: string;
  motto: string;
  description: string;
  address: {
    street: string;
    commune: string;
    city: string;
    province: string;
    country: string;
    fullFormatted: string;
  };
  contacts: {
    email: string;
    academicEmail: string;
    supportEmail: string;
    phone: string;
    phoneAlternative?: string;
  };
  web: {
    officialSite: string;
    portalStudent?: string;
  };
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  academic: {
    currentAcademicYear: string;
    referencePrefix: string;
    defaultSlaDays: number;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoLight: string;
    logoDark: string;
    favicon: string;
  };
}

export const UPL_INSTITUTION_CONFIG: InstitutionalConfig = {
  name: "Université Protestante de Lubumbashi",
  shortName: "UPL",
  appFunctionalName: "UPL Réclamations",
  tagline: "Plateforme numérique de gestion et de suivi des réclamations étudiantes",
  motto: "Vérité et liberté",
  description: "Système institutionnel sécurisé de soumission, d'instruction et de traçabilité des réclamations académiques et administratives à l'UPL.",
  address: {
    street: "2179, Av. 30 Juin Coin Kimbangu",
    commune: "Commune de Lubumbashi",
    city: "Lubumbashi",
    province: "Haut-Katanga",
    country: "République Démocratique du Congo",
    fullFormatted: "2179, Av. 30 Juin Coin Kimbangu, Commune de Lubumbashi, Haut-Katanga, RDC",
  },
  contacts: {
    email: "info@upl-univ.ac",
    academicEmail: "reclamations@upl-univ.ac",
    supportEmail: "support-informatique@upl-univ.ac",
    phone: "+243 99 980 4055",
    phoneAlternative: "+243 81 000 0000",
  },
  web: {
    officialSite: "https://upl-univ.ac",
  },
  socialLinks: {
    facebook: "https://web.facebook.com/OfficielUPL",
    linkedin: "https://www.linkedin.com/school/upl-univ",
    youtube: "https://www.instagram.com/officiel_upl",
  },
  academic: {
    currentAcademicYear: "2025-2026",
    referencePrefix: "UPL-REC",
    defaultSlaDays: 5, // Délai moyen de traitement estimé en jours ouvrés
  },
  branding: {
    primaryColor: "#1E3A8A",   // Bleu institutionnel UPL
    secondaryColor: "#D97706", // Accent doré / ocre
    accentColor: "#059669",    // Vert émeraude validation
    logoLight: "/branding/logo-upl-officiel.png",
    logoDark: "/branding/logo-upl-officiel.png",
    favicon: "/branding/logo-upl-officiel.png",
  },
};
