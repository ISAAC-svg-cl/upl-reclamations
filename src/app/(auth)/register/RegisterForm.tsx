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
  facultyName: string;
}

interface RegisterFormProps {
  promotions: PromoItem[];
}

export function RegisterForm({ promotions }: RegisterFormProps) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matricule, setMatricule] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promotionId, setPromotionId] = useState(promotions[0]?.id || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      email: email.trim(),
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

  const groupedPromotions = promotions.reduce<Record<string, PromoItem[]>>((acc, p) => {
    const faculty = p.facultyName || "Autres filières";
    if (!acc[faculty]) {
      acc[faculty] = [];
    }
    acc[faculty].push(p);
    return acc;
  }, {});

  return (
    <Card className="shadow-lg border-border/80">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Renseignements de l'étudiant</CardTitle>
        <CardDescription className="text-xs">
          Veuillez renseigner vos coordonnées académiques exactes à l'UPL
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
              <label className="text-xs font-semibold">Prénom(s) *</label>
              <Input
                placeholder="Ex: Edmond Isaac"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Nom de famille *</label>
              <Input
                placeholder="Ex: NKUNA"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="text-xs sm:text-sm uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Numéro Matricule UPL *</label>
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

          <div className="space-y-1">
            <label className="text-xs font-semibold">Email Institutionnel ou Personnel *</label>
            <Input
              type="email"
              placeholder="edmond.nkuna@etudiant.upl-rdc.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold flex items-center justify-between">
              <span>Faculté & Filière UPL *</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                {promotions.length} filières disponibles
              </span>
            </label>
            <select
              value={promotionId}
              onChange={(e) => setPromotionId(e.target.value)}
              required
              className="w-full h-11 px-3 rounded-lg border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            >
              {Object.entries(groupedPromotions).map(([faculty, list]) => (
                <optgroup key={faculty} label={`🎓 ${faculty}`} className="font-bold text-primary">
                  {list.map((p) => (
                    <option key={p.id} value={p.id} className="font-normal text-foreground py-1">
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Mot de passe *</label>
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
              <label className="text-xs font-semibold">Confirmer mot de passe *</label>
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
