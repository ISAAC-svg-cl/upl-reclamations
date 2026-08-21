"use client";

import { useState } from "react";
import { changePasswordAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const res = await changePasswordAction({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Erreur lors du changement de mot de passe.");
    } else {
      setSuccess("Votre mot de passe a été modifié avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <span>Modifier le mot de passe</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Assurez-vous de choisir un mot de passe robuste d'au moins 6 caractères
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Mot de passe actuel</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Nouveau mot de passe</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Confirmer le nouveau mot de passe</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="text-xs sm:text-sm"
            />
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/10 p-4 flex justify-end">
          <Button type="submit" isLoading={isLoading} size="sm">
            Enregistrer le mot de passe
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
