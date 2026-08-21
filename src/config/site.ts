import { UPL_INSTITUTION_CONFIG } from "./institution";

export const siteConfig = {
  name: UPL_INSTITUTION_CONFIG.appFunctionalName,
  description: UPL_INSTITUTION_CONFIG.description,
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/branding/og-image.png",
  links: {
    officialSite: UPL_INSTITUTION_CONFIG.web.officialSite,
  },
  nav: {
    public: [
      { title: "Accueil", href: "/" },
      { title: "Guide & Procédure", href: "/#procedure" },
      { title: "Contact", href: "/#contact" },
    ],
    student: [
      { title: "Tableau de bord", href: "/student/dashboard", icon: "LayoutDashboard" },
      { title: "Mes réclamations", href: "/student/complaints", icon: "FileText" },
      { title: "Nouvelle réclamation", href: "/student/complaints/new", icon: "PlusCircle" },
      { title: "Notifications", href: "/student/notifications", icon: "Bell" },
      { title: "Mon profil", href: "/profile", icon: "User" },
    ],
    staff: [
      { title: "Tableau de bord", href: "/staff/dashboard", icon: "LayoutDashboard" },
      { title: "File du service", href: "/staff/complaints", icon: "Inbox" },
      { title: "Notifications", href: "/staff/notifications", icon: "Bell" },
      { title: "Mon profil", href: "/profile", icon: "User" },
    ],
    admin: [
      { title: "Tour de contrôle", href: "/admin/dashboard", icon: "LayoutDashboard" },
      { title: "Toutes les réclamations", href: "/admin/complaints", icon: "Files" },
      { title: "Utilisateurs", href: "/admin/users", icon: "Users" },
      { title: "Facultés & Départements", href: "/admin/faculties", icon: "GraduationCap" },
      { title: "Services & Catégories", href: "/admin/services", icon: "Building2" },
      { title: "Statistiques & Rapports", href: "/admin/analytics", icon: "BarChart3" },
      { title: "Audit & Sécurité", href: "/admin/audit", icon: "ShieldAlert" },
      { title: "Paramètres", href: "/admin/settings", icon: "Settings" },
    ],
  },
};
