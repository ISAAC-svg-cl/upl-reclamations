"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth.actions";
import { UPL_INSTITUTION_CONFIG } from "@/config/institution";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Lock, User, AlertCircle, CheckCircle, Shield, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await loginAction({
      identifier: identifier.trim(),
      password,
    });

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Identifiants invalides");
    } else if (res.redirectUrl) {
      router.push(res.redirectUrl);
      router.refresh();
    }
  };

  const setTestAccount = (userIdent: string, pass: string) => {
    setIdentifier(userIdent);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-muted/20">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
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
              {UPL_INSTITUTION_CONFIG.appFunctionalName}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {UPL_INSTITUTION_CONFIG.tagline}
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-border/80">
          <CardHeader className="space-y-1 pb-4 border-b bg-muted/20">
            <CardTitle className="text-lg font-bold">Espace de Connexion</CardTitle>
            <CardDescription className="text-xs">
              Saisissez votre matricule étudiant ou votre email institutionnel UPL
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Email institutionnel ou Matricule UPL
                </label>
                <div className="relative">
                  <Input
                    placeholder="ex: john.kasongo@etudiant.upl-rdc.net ou UPL/2023/0481"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="pl-9 text-xs sm:text-sm"
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Mot de passe
                  </label>
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-9 text-xs sm:text-sm"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button type="submit" isLoading={isLoading} className="w-full gap-2">
                <span>Se connecter</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Nouvel étudiant ?{" "}
                <Link href="/register" className="text-primary font-bold hover:underline">
                  Créer un compte étudiant
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Quick Demo Accès PFE (Décanat & Admin) */}
        <div className="p-4 rounded-xl border bg-card/60 text-xs space-y-2">
          <p className="font-bold text-foreground flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-primary" />
            Comptes Administrateurs & Décanat :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setTestAccount("decanat.fsi@upl-rdc.net", "staff123")}
              className="p-2.5 rounded-lg border bg-background hover:border-primary text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="font-bold text-xs text-blue-700 dark:text-blue-400 group-hover:text-primary transition-colors">
                  Décanat FSI
                </p>
                <p className="text-[10px] text-muted-foreground">decanat.fsi@upl-rdc.net</p>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                Staff
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTestAccount("admin@upl-rdc.net", "admin123")}
              className="p-2.5 rounded-lg border bg-background hover:border-primary text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="font-bold text-xs text-purple-700 dark:text-purple-400 group-hover:text-primary transition-colors">
                  Administrateur UPL
                </p>
                <p className="text-[10px] text-muted-foreground">admin@upl-rdc.net</p>
              </div>
              <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded">
                Admin
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
