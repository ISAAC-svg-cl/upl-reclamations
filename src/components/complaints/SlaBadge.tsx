"use client";

import { calculateComplaintSla } from "@/lib/sla";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SlaBadgeProps {
  createdAt: Date | string;
  slaDays?: number;
  status: string;
  resolvedAt?: Date | string | null;
  showIcon?: boolean;
  className?: string;
}

export function SlaBadge({
  createdAt,
  slaDays = 3,
  status,
  resolvedAt,
  showIcon = true,
  className = "",
}: SlaBadgeProps) {
  const sla = calculateComplaintSla(createdAt, slaDays, status, resolvedAt);

  const variantStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 animate-pulse",
    rose: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 font-bold animate-pulse",
    slate: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow-xs ${variantStyles[sla.badgeVariant]} ${className}`}
      title={`Échéance SLA estimée : ${sla.formattedTargetDate}`}
    >
      {showIcon && (
        <>
          {sla.badgeVariant === "rose" && <AlertTriangle className="h-3 w-3 shrink-0" />}
          {sla.badgeVariant === "amber" && <Clock className="h-3 w-3 shrink-0" />}
          {sla.badgeVariant === "emerald" && <CheckCircle2 className="h-3 w-3 shrink-0" />}
          {sla.badgeVariant === "slate" && <Clock className="h-3 w-3 shrink-0" />}
        </>
      )}
      <span>{sla.badgeLabel}</span>
    </span>
  );
}
