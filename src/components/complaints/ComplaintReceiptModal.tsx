"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, X, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { generateQrCodeUrl } from "@/lib/qr";
import { UPL_INSTITUTION_CONFIG } from "@/config/institution";

interface ComplaintReceiptModalProps {
  complaint: {
    id: string;
    reference: string;
    subject: string;
    description: string;
    priority: string;
    status: string;
    createdAt: Date | string;
    student: {
      firstName: string;
      lastName: string;
      matricule?: string | null;
      email: string;
      phone?: string | null;
      studentProfile?: {
        currentLevel?: string | null;
        promotion?: {
          name: string;
          program?: {
            name: string;
            department?: {
              name: string;
              faculty?: {
                name: string;
              } | null;
            } | null;
          } | null;
        } | null;
      } | null;
    };
    category: {
      name: string;
      code: string;
      slaDays: number;
    };
    service?: {
      name: string;
      code: string;
    } | null;
  };
}

export function ComplaintReceiptModal({ complaint }: ComplaintReceiptModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const qrUrl = generateQrCodeUrl(
    `UPL-VERIFY:${complaint.reference}|ETUDIANT:${complaint.student.firstName} ${complaint.student.lastName}|DATE:${complaint.createdAt}`
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 border-primary/30 text-primary hover:bg-primary/5 font-semibold text-xs sm:text-sm"
      >
        <Printer className="h-4 w-4" />
        <span>Récépissé Officiel (PDF / Imprimer)</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Actions Bar (hidden when printing) */}
            <div className="print:hidden flex items-center justify-between px-6 py-3 bg-slate-900 text-white">
              <div className="flex items-center gap-2 text-xs font-bold">
                <FileText className="h-4 w-4 text-amber-400" />
                <span>RÉCÉPISSÉ OFFICIEL DE RÉCLAMATION UPL</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handlePrint}
                  className="bg-primary hover:bg-primary/90 text-white gap-1.5 text-xs h-8"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Imprimer / Sauvegarder en PDF</span>
                </Button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Area */}
            <div className="p-6 sm:p-10 space-y-6 text-slate-900 bg-white font-sans printable-receipt">
              {/* Header Institutionnel */}
              <div className="flex items-center justify-between border-b-2 border-primary pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src="/branding/logo-upl-officiel.png"
                    alt="Logo UPL"
                    className="h-16 w-16 object-contain rounded-full border border-slate-200 p-0.5"
                  />
                  <div>
                    <h1 className="text-sm font-black tracking-wide text-primary uppercase">
                      UNIVERSITÉ PROTESTANTE DE LUBUMBASHI
                    </h1>
                    <p className="text-[11px] font-semibold text-amber-700">
                      « {UPL_INSTITUTION_CONFIG.motto} »
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {UPL_INSTITUTION_CONFIG.address.fullFormatted} | {UPL_INSTITUTION_CONFIG.contacts.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block p-1 border rounded-lg bg-slate-50">
                    <img src={qrUrl} alt="QR Code Vérification" className="h-16 w-16 object-contain" />
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">Authenticité certifiée</p>
                </div>
              </div>

              {/* Titre Document & Référence */}
              <div className="text-center space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                  Accusé d'Enregistrement Officiel
                </span>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  FICHE DE RÉCLAMATION ACADÉMIQUE
                </h2>
                <p className="font-mono text-sm font-extrabold text-primary">
                  N° RÉFÉRENCE : {complaint.reference}
                </p>
                <p className="text-[11px] text-slate-500">
                  Déposée le {format(new Date(complaint.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
              </div>

              {/* Grid: Informations Étudiant & Structure */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                  <p className="font-bold text-slate-700 border-b pb-1 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Identité de l'Étudiant
                  </p>
                  <p>
                    <span className="text-slate-500">Nom & Prénom : </span>
                    <strong className="text-slate-900">{complaint.student.lastName} {complaint.student.firstName}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">N° Matricule : </span>
                    <strong className="font-mono text-primary">{complaint.student.matricule || "N/A"}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Email UPL : </span>
                    <span>{complaint.student.email}</span>
                  </p>
                  {complaint.student.phone && (
                    <p>
                      <span className="text-slate-500">Téléphone : </span>
                      <span>{complaint.student.phone}</span>
                    </p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                  <p className="font-bold text-slate-700 border-b pb-1 text-[11px] uppercase tracking-wider">
                    Cursus & Affectation
                  </p>
                  <p>
                    <span className="text-slate-500">Faculté : </span>
                    <strong>Faculté des Sciences Informatiques</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Filière / Dép. : </span>
                    <strong>{complaint.student.studentProfile?.promotion?.program?.department?.name || "Sciences Informatiques"}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Promotion : </span>
                    <strong className="text-primary font-bold">{complaint.student.studentProfile?.promotion?.name || "BAC"}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Service d'instruction : </span>
                    <span>{complaint.service?.name || "Décanat FSI"}</span>
                  </p>
                </div>
              </div>

              {/* Détails de la Requête */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Catégorie</span>
                    <strong className="text-slate-900">{complaint.category.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase text-right">Délai estimé (SLA)</span>
                    <strong className="text-amber-700 font-bold">{complaint.category.slaDays} jours ouvrés</strong>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Objet de la doléance</span>
                  <p className="font-bold text-sm text-slate-900 mt-0.5">{complaint.subject}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Description & Circonstances</span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border mt-0.5">
                    {complaint.description}
                  </p>
                </div>
              </div>

              {/* Volet de Décharge & Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-dashed border-slate-300 text-xs">
                <div className="space-y-8">
                  <p className="text-[11px] font-bold text-slate-600">
                    Visa & Décharge de l'Étudiant :
                  </p>
                  <p className="text-[10px] text-slate-400 italic">Signature de l'étudiant</p>
                </div>

                <div className="space-y-8 text-right">
                  <p className="text-[11px] font-bold text-slate-600">
                    Sceau & Cachet du Décanat / Secrétariat :
                  </p>
                  <p className="text-[10px] text-slate-400 italic">Fait à Lubumbashi, le {format(new Date(), "dd/MM/yyyy")}</p>
                </div>
              </div>

              {/* Footer Notice */}
              <div className="text-center text-[10px] text-slate-400 border-t pt-3">
                <p>Ce document certifie la prise en compte de votre requête dans le système numérique UPL Réclamations.</p>
                <p>Conservez ce récépissé pour tout suivi physique ou consultation lors des jurys de délibération.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
