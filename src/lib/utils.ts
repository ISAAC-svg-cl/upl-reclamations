import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ComplaintPriority, ComplaintStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return format(d, "dd MMMM yyyy 'à' HH:mm", { locale: fr });
}

export function formatDateShort(date: Date | string | number | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return format(d, "dd/MM/yyyy", { locale: fr });
}

export function formatTimeAgo(date: Date | string | number | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
}

export function getStatusLabel(status: ComplaintStatus): string {
  switch (status) {
    case "NEW":
      return "Nouvelle";
    case "IN_PROGRESS":
      return "En cours";
    case "WAITING_INFO":
      return "En attente d'infos";
    case "FORWARDED":
      return "Transmise";
    case "RESOLVED":
      return "Traitée";
    case "CLOSED":
      return "Clôturée";
    case "REJECTED":
      return "Rejetée";
    default:
      return status;
  }
}

export function getStatusBadgeVariant(status: ComplaintStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case "NEW":
      return {
        bg: "bg-blue-50 dark:bg-blue-950/40",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800",
        dot: "bg-blue-500",
      };
    case "IN_PROGRESS":
      return {
        bg: "bg-amber-50 dark:bg-amber-950/40",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500 animate-pulse",
      };
    case "WAITING_INFO":
      return {
        bg: "bg-purple-50 dark:bg-purple-950/40",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-200 dark:border-purple-800",
        dot: "bg-purple-500",
      };
    case "FORWARDED":
      return {
        bg: "bg-indigo-50 dark:bg-indigo-950/40",
        text: "text-indigo-700 dark:text-indigo-300",
        border: "border-indigo-200 dark:border-indigo-800",
        dot: "bg-indigo-500",
      };
    case "RESOLVED":
      return {
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
      };
    case "CLOSED":
      return {
        bg: "bg-slate-100 dark:bg-slate-800",
        text: "text-slate-700 dark:text-slate-300",
        border: "border-slate-200 dark:border-slate-700",
        dot: "bg-slate-400",
      };
    case "REJECTED":
      return {
        bg: "bg-rose-50 dark:bg-rose-950/40",
        text: "text-rose-700 dark:text-rose-300",
        border: "border-rose-200 dark:border-rose-800",
        dot: "bg-rose-500",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
        dot: "bg-gray-400",
      };
  }
}

export function getPriorityLabel(priority: ComplaintPriority): string {
  switch (priority) {
    case "LOW":
      return "Faible";
    case "NORMAL":
      return "Normale";
    case "HIGH":
      return "Élevée";
    case "URGENT":
      return "Urgente";
    default:
      return priority;
  }
}

export function getPriorityBadgeVariant(priority: ComplaintPriority): {
  bg: string;
  text: string;
  border: string;
} {
  switch (priority) {
    case "LOW":
      return {
        bg: "bg-slate-100 dark:bg-slate-800",
        text: "text-slate-700 dark:text-slate-300",
        border: "border-slate-200 dark:border-slate-700",
      };
    case "NORMAL":
      return {
        bg: "bg-blue-50 dark:bg-blue-950/30",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800",
      };
    case "HIGH":
      return {
        bg: "bg-orange-50 dark:bg-orange-950/30",
        text: "text-orange-700 dark:text-orange-300",
        border: "border-orange-200 dark:border-orange-800",
      };
    case "URGENT":
      return {
        bg: "bg-red-100 dark:bg-red-950/50",
        text: "text-red-700 dark:text-red-300 font-semibold",
        border: "border-red-300 dark:border-red-700",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
      };
  }
}
