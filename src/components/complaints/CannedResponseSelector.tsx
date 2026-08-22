"use client";

import { MessageSquare, Sparkles } from "lucide-react";

interface CannedResponseSelectorProps {
  onSelect: (text: string) => void;
}

export const CANNED_RESPONSES = [
  {
    title: "Accusé de réception & Prise en charge",
    text: "Bonjour. Votre réclamation a bien été reçue par le Décanat de la Faculté des Sciences Informatiques. Votre dossier est actuellement ouvert et en cours d'instruction.",
  },
  {
    title: "Vérification auprès de la chaire d'enseignement",
    text: "Nous procédons à la vérification physique des feuilles d'émargement et des copies d'examen auprès du titulaire du cours. Nous revenons vers vous dès confirmation.",
  },
  {
    title: "Demande de justificatif bancaire / bordereau",
    text: "Pour poursuivre l'instruction de votre dossier, veuillez joindre une copie lisible ou photo nette de votre bordereau de versement bancaire original.",
  },
  {
    title: "Régularisation confirmée & Note validée",
    text: "Après vérification auprès de la commission des jurys, votre note a été rectifiée sur la grille officielle de délibération de la session.",
  },
  {
    title: "Invitation au secrétariat du décanat",
    text: "Vous êtes prié(e) de vous présenter au secrétariat de la Faculté des Sciences Informatiques muni(e) de votre carte d'étudiant pour finalisation de votre recours.",
  },
];

export function CannedResponseSelector({ onSelect }: CannedResponseSelectorProps) {
  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
        <Sparkles className="h-3 w-3 text-amber-500" />
        <span>Modèles de réponses rapides (Secrétariat & Décanat) :</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CANNED_RESPONSES.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(item.text)}
            className="text-[11px] px-2.5 py-1 rounded-lg border bg-muted/40 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all text-left font-medium"
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
