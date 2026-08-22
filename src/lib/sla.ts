import { addDays, format, differenceInCalendarDays, isAfter } from "date-fns";
import { fr } from "date-fns/locale";

export interface SlaCalculation {
  isOverdue: boolean;
  daysRemaining: number;
  daysOverdue: number;
  targetDate: Date;
  formattedTargetDate: string;
  badgeLabel: string;
  badgeVariant: "emerald" | "amber" | "rose" | "slate";
}

export function calculateComplaintSla(
  createdAt: Date | string,
  slaDays = 3,
  status = "NEW",
  resolvedAt?: Date | string | null
): SlaCalculation {
  const created = new Date(createdAt);
  const targetDate = addDays(created, slaDays);
  const now = new Date();

  const formattedTargetDate = format(targetDate, "dd MMMM yyyy", { locale: fr });

  // Si la réclamation est déjà résolue ou clôturée
  if (["RESOLVED", "CLOSED", "REJECTED"].includes(status)) {
    const resolved = resolvedAt ? new Date(resolvedAt) : now;
    const wasOverdue = isAfter(resolved, targetDate);
    return {
      isOverdue: wasOverdue,
      daysRemaining: 0,
      daysOverdue: wasOverdue ? differenceInCalendarDays(resolved, targetDate) : 0,
      targetDate,
      formattedTargetDate,
      badgeLabel: wasOverdue ? "Traité avec retard" : "Traité dans les délais",
      badgeVariant: wasOverdue ? "amber" : "slate",
    };
  }

  const isOverdue = isAfter(now, targetDate);
  const diff = differenceInCalendarDays(targetDate, now);

  if (isOverdue) {
    const daysOverdue = differenceInCalendarDays(now, targetDate);
    return {
      isOverdue: true,
      daysRemaining: 0,
      daysOverdue,
      targetDate,
      formattedTargetDate,
      badgeLabel: `⚠️ SLA Dépassé (+${daysOverdue} j)`,
      badgeVariant: "rose",
    };
  }

  if (diff <= 1) {
    return {
      isOverdue: false,
      daysRemaining: diff,
      daysOverdue: 0,
      targetDate,
      formattedTargetDate,
      badgeLabel: `⏳ Échéance proche (J-${diff})`,
      badgeVariant: "amber",
    };
  }

  return {
    isOverdue: false,
    daysRemaining: diff,
    daysOverdue: 0,
    targetDate,
    formattedTargetDate,
    badgeLabel: `Dans les délais (SLA ${slaDays}j)`,
    badgeVariant: "emerald",
  };
}
