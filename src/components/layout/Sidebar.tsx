"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserSession } from "@/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  User,
  Users,
  Building2,
  GraduationCap,
  BarChart3,
  ShieldAlert,
  Inbox,
  FolderTree,
} from "lucide-react";

interface SidebarProps {
  user: UserSession;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const getLinks = () => {
    switch (user.role) {
      case "STUDENT":
        return [
          { title: "Tableau de bord", href: "/student/dashboard", icon: LayoutDashboard },
          { title: "Mes réclamations", href: "/student/complaints", icon: FileText },
          { title: "Nouvelle réclamation", href: "/student/complaints/new", icon: PlusCircle },
          { title: "Notifications", href: "/student/notifications", icon: Bell },
          { title: "Mon profil", href: "/profile", icon: User },
        ];
      case "STAFF":
        return [
          { title: "Tableau de bord", href: "/staff/dashboard", icon: LayoutDashboard },
          { title: "File des réclamations", href: "/staff/complaints", icon: Inbox },
          { title: "Notifications", href: "/staff/notifications", icon: Bell },
          { title: "Mon profil", href: "/profile", icon: User },
        ];
      case "ADMIN":
        return [
          { title: "Tour de contrôle", href: "/admin/dashboard", icon: LayoutDashboard },
          { title: "Toutes les réclamations", href: "/admin/complaints", icon: FileText },
          { title: "Gestion des utilisateurs", href: "/admin/users", icon: Users },
          { title: "Facultés & Départements", href: "/admin/faculties", icon: GraduationCap },
          { title: "Services & Catégories", href: "/admin/services", icon: Building2 },
          { title: "Statistiques & Rapports", href: "/admin/analytics", icon: BarChart3 },
          { title: "Notifications", href: "/admin/notifications", icon: Bell },
          { title: "Mon profil", href: "/profile", icon: User },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card/60 backdrop-blur-xs min-h-[calc(100vh-4rem)] p-4 space-y-6">
      {/* Mini Institution Header */}
      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/60">
        <div className="relative h-9 w-9 rounded-lg bg-white p-0.5 shadow-xs border flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src="/branding/logo.png"
            alt="Logo UPL"
            className="object-contain w-full h-full"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-foreground truncate">
            Univ. Protestante Lubumbashi
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            {user.role === "ADMIN"
              ? "Tour de Contrôle"
              : user.role === "STAFF"
              ? "Service Décanat"
              : "Portail Étudiant"}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        <nav className="space-y-1.5 pt-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/student/dashboard" && link.href !== "/admin/dashboard" && link.href !== "/staff/dashboard" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {user.role === "STUDENT" && (
        <div className="mt-auto p-4 rounded-xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15">
          <p className="text-xs font-bold text-primary">Besoin d'aide ?</p>
          <p className="text-xs text-muted-foreground mt-1">
            Consultez le guide de dépôt ou contactez le support académique de l'UPL.
          </p>
          <Link href="/student/complaints/new" className="mt-3 block">
            <button className="w-full text-xs bg-primary text-white font-semibold py-1.5 px-3 rounded-md hover:bg-primary/90 transition-all shadow-xs">
              + Déposer une requête
            </button>
          </Link>
        </div>
      )}
    </aside>
  );
}
