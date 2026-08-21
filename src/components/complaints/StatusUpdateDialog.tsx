"use client";

import { useState } from "react";
import { ComplaintStatus, UserSession } from "@/types";
import { updateStatusAction } from "@/actions/complaint.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Forward, XCircle, HelpCircle, ArrowRightCircle } from "lucide-react";

interface StatusUpdateDialogProps {
  complaintId: string;
  currentStatus: ComplaintStatus;
  user: UserSession;
  services?: Array<{ id: string; name: string }>;
  currentServiceId?: string | null;
  onSuccess?: () => void;
}

export function StatusUpdateDialog({
  complaintId,
  currentStatus,
  user,
  services = [],
  currentServiceId,
  onSuccess,
}: StatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(currentStatus);
  const [reason, setReason] = useState("");
  const [assignedServiceId, setAssignedServiceId] = useState<string>(currentServiceId || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const availableStatuses: Array<{
    value: ComplaintStatus;
    label: string;
    description: string;
    icon: any;
    color: string;
  }> = [
    {
      value: "IN_PROGRESS",
      label: "En cours d'instruction",
      description: "Prendre en charge le dossier pour analyse",
      icon: ArrowRightCircle,
      color: "text-amber-600",
    },
    {
      value: "WAITING_INFO",
      label: "En attente d'informations",
      description: "Demander des pièces justificatives supplémentaires à l'étudiant",
      icon: HelpCircle,
      color: "text-purple-600",
    },
    {
      value: "FORWARDED",
      label: "Transmise à un autre service",
      description: "Transférer vers une autre entité académique ou administrative",
      icon: Forward,
      color: "text-indigo-600",
    },
    {
      value: "RESOLVED",
      label: "Traitée avec succès",
      description: "Problème réglé ou décision finale validée",
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    {
      value: "REJECTED",
      label: "Rejetée / Irrecevable",
      description: "Dépôt hors délais ou contestation infondée",
      icon: XCircle,
      color: "text-rose-600",
    },
    {
      value: "CLOSED",
      label: "Clôturer définitivement",
      description: "Archivage final du dossier",
      icon: CheckCircle,
      color: "text-slate-600",
    },
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    const res = await updateStatusAction({
      complaintId,
      status: selectedStatus,
      reason: reason.trim() || undefined,
      assignedServiceId: assignedServiceId || undefined,
    });

    setIsLoading(false);
    if (!res.success) {
      setError(res.error || "Erreur lors de la mise à jour");
    } else {
      setSuccessMsg("Statut mis à jour avec succès !");
      setReason("");
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-muted/20 pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <span>Gestion du statut & Assignation</span>
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleUpdate}>
        <CardContent className="p-4 sm:p-6 space-y-4">
          {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
          {successMsg && <p className="text-xs font-semibold text-emerald-600">{successMsg}</p>}

          {/* Status Selection Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nouveau statut :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableStatuses.map((st) => {
                const Icon = st.icon;
                const isSelected = selectedStatus === st.value;

                return (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => setSelectedStatus(st.value)}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${st.color}`} />
                    <div>
                      <p className="text-xs font-bold text-foreground">{st.label}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{st.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Reassignment (Staff or Admin) */}
          {(user.role === "ADMIN" || selectedStatus === "FORWARDED") && services.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-foreground">
                Service assigné à la réclamation :
              </label>
              <select
                value={assignedServiceId}
                onChange={(e) => setAssignedServiceId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sélectionner un service UPL...</option>
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reason / Note Textarea */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-foreground">
              Motif de l'action / Note explicative (enregistrée dans l'historique) :
            </label>
            <Textarea
              placeholder="Expliquez la raison de ce changement de statut..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="text-xs"
            />
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/10 p-4 flex justify-end gap-2">
          <Button type="submit" isLoading={isLoading} size="sm">
            Appliquer le changement
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
