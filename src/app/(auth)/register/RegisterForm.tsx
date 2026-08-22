"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerStudentAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, User, Mail, Lock, Phone, GraduationCap } from "lucide-react";

interface PromoItem {
  id: string;
  name: string;
  yearLevel: string;
  filiere: string;
  facultyName: string;
}

interface RegisterFormProps {
  promotions: PromoItem[];
}

export function RegisterForm({ promotions }: RegisterFormProps) {
  const router = useRouter();

  // Liste unique des filières
  const filieres = Array.from(new Set(promotions.map((p) => p.filiere)));
  const defaultFiliere = filieres[0] || "Génie Logiciel";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matricule, setMatricule] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState(defaultFiliere);
  
  // Promotions de la filière sélectionnée
  const availablePromos = promotions.filter((p) => p.filiere === selectedFiliere);
  const [promotionId, setPromotionId] = useState(availablePromos[0]?.id || promotions[0]?.id || "");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour la promotion quand la filière change
  const handleFiliereChange = (filiere: string) => {
    setSelectedFiliere(filiere);
    const matched = promotions.filter((p) => p.filiere === filiere);
    if (matched.length > 0) {
      setPromotionId(matched[0].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await registerStudentAction({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      matricule: matricule.trim(),
      phone: phone.trim() || undefined,
      promotionId,
      password,
      confirmPassword,
    });

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Erreur lors de l'inscription.");
    } else if (res.redirectUrl) {
      router.push(res.redirectUrl);
      router.refresh();
    }
  };

  return (
    <Card className="shadow-lg border-border/80">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-lg font-bold">Renseignements de l'étudiant</CardTitle>
        <CardDescription className="text-xs">
          Faculté des Sciences Informatiques — Coordonnées académiques
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Prénom(s)</label>
              <Input
                placeholder="Ex: ISAAC"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Nom de famille</label>
              <Input
                placeholder="Ex: EDMOND NKUNA"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="text-xs sm:text-sm uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Numéro Matricule UPL</label>
              <Input
                placeholder="Ex: 2024022105"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                required
                className="text-xs sm:text-sm uppercase font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Téléphone / WhatsApp</label>
              <Input
                placeholder="+243 99 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* SÉPARATION FILIÈRE & PROMOTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>Filière</span>
              </label>
              <select
                value={selectedFiliere}
                onChange={(e) => handleFiliereChange(e.target.value)}
                required
                className="w-full h-11 px-3 rounded-lg border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                {filieres.map((filiere) => (
                  <option key={filiere} value={filiere} className="py-1">
                    {filiere}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>Promotion</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {availablePromos.length} niveaux
                </span>
              </label>
              <select
                value={promotionId}
                onChange={(e) => setPromotionId(e.target.value)}
                required
                className="w-full h-11 px-3 rounded-lg border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold text-primary"
              >
                {availablePromos.map((p) => (
                  <option key={p.id} value={p.id} className="py-1 font-semibold text-foreground">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Confirmer mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-xs sm:text-sm"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-2">
          <Button type="submit" isLoading={isLoading} className="w-full">
            Créer mon compte étudiant
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Vous possédez déjà un compte ?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
