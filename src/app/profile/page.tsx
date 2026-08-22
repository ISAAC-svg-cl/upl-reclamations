import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { User, Shield, GraduationCap, Building2, Mail, Phone, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Mon Profil & Sécurité</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Consultez vos informations personnelles et mettez à jour votre mot de passe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 shadow-xs border-primary/20 bg-primary/5">
          <CardHeader className="text-center pb-2">
            <div className="relative h-20 w-20 rounded-full bg-white shadow-md border p-0.5 mx-auto flex items-center justify-center overflow-hidden">
              <img
                src="/branding/logo-upl-officiel.png"
                alt="Logo UPL"
                className="object-contain w-full h-full rounded-full"
              />
            </div>
            <CardTitle className="text-base font-bold pt-3">{user.fullName}</CardTitle>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </CardHeader>

          <CardContent className="p-4 space-y-3 text-xs">
            <div className="p-2.5 rounded-lg bg-background border space-y-1">
              <p className="text-muted-foreground font-medium">Rôle système</p>
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                {user.role === "ADMIN" ? (
                  <Shield className="h-3.5 w-3.5 text-purple-600" />
                ) : user.role === "STAFF" ? (
                  <Building2 className="h-3.5 w-3.5 text-blue-600" />
                ) : (
                  <GraduationCap className="h-3.5 w-3.5 text-amber-600" />
                )}
                <span>{user.role}</span>
              </div>
            </div>

            {user.matricule && (
              <div className="p-2.5 rounded-lg bg-background border space-y-1">
                <p className="text-muted-foreground font-medium">Numéro Matricule</p>
                <p className="font-mono font-bold text-primary">{user.matricule}</p>
              </div>
            )}

            {user.facultyName && (
              <div className="p-2.5 rounded-lg bg-background border space-y-1">
                <p className="text-muted-foreground font-medium">Faculté</p>
                <p className="font-medium text-foreground">{user.facultyName}</p>
              </div>
            )}

            {user.promotionName && (
              <div className="p-2.5 rounded-lg bg-background border space-y-1">
                <p className="text-muted-foreground font-medium">Promotion</p>
                <p className="font-medium text-foreground">{user.promotionName}</p>
              </div>
            )}

            {user.serviceName && (
              <div className="p-2.5 rounded-lg bg-background border space-y-1">
                <p className="text-muted-foreground font-medium">Service UPL</p>
                <p className="font-medium text-foreground">{user.serviceName}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password Form */}
        <div className="md:col-span-2">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
