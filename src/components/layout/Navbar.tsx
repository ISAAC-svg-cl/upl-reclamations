"use client";

import Link from "next/link";
import Image from "next/image";
import { UserSession } from "@/types";
import { UPL_INSTITUTION_CONFIG } from "@/config/institution";
import { logoutAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Menu, X, Shield, GraduationCap, Building2 } from "lucide-react";
import { useState } from "react";
import { NotificationBell } from "./NotificationBell";

interface NavbarProps {
  user: UserSession | null;
  unreadNotifications?: number;
}

export function Navbar({ user, unreadNotifications = 0 }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
            <Shield className="h-3 w-3" /> ADMIN UPL
          </span>
        );
      case "STAFF":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Building2 className="h-3 w-3" /> {user?.serviceName || "RESPONSABLE"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <GraduationCap className="h-3 w-3" /> ÉTUDIANT ({user?.matricule || "UPL"})
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo & Institution Name */}
        <Link
          href={user ? (user.role === "ADMIN" ? "/admin/dashboard" : user.role === "STAFF" ? "/staff/dashboard" : "/student/dashboard") : "/"}
          className="flex items-center gap-3 group transition-all"
        >
          <div className="relative h-12 w-12 flex items-center justify-center rounded-full bg-white shadow-xs border border-border/80 p-0.5 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
            <img
              src="/branding/logo-upl-officiel.png"
              alt="Logo Officiel UPL"
              className="object-contain w-full h-full rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg leading-tight tracking-tight text-primary group-hover:text-primary/90 transition-colors">
              {UPL_INSTITUTION_CONFIG.appFunctionalName}
            </span>
            <span className="text-[10.5px] text-muted-foreground hidden sm:inline-block font-semibold tracking-wide">
              {UPL_INSTITUTION_CONFIG.name}
            </span>
          </div>
        </Link>

        {/* User Navigation / Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {/* Notification Bell */}
              <NotificationBell initialCount={unreadNotifications} userRole={user.role} />

              {/* User Info Capsule */}
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="flex flex-col text-right">
                  <span className="text-sm font-semibold leading-tight">{user.fullName}</span>
                  <div className="mt-0.5">{getRoleBadge(user.role)}</div>
                </div>

                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="rounded-full" title="Mon Profil">
                    <UserIcon className="h-4 w-4" />
                  </Button>
                </Link>

                <form action={logoutAction}>
                  <Button variant="outline" size="sm" type="submit" className="text-muted-foreground hover:text-destructive gap-1.5">
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button size="sm" className="bg-primary text-primary-foreground font-semibold px-4 shadow-xs">
                  Connexion
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <NotificationBell initialCount={unreadNotifications} userRole={user.role} />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-card p-4 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          {user ? (
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                {getRoleBadge(user.role)}
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2">
                <Link
                  href={user.role === "ADMIN" ? "/admin/dashboard" : user.role === "STAFF" ? "/staff/dashboard" : "/student/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full justify-start">
                    Tableau de bord
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    Mon Profil
                  </Button>
                </Link>
                <form action={logoutAction} className="pt-2">
                  <Button variant="destructive" className="w-full gap-2">
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground font-semibold">
                  Connexion
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
