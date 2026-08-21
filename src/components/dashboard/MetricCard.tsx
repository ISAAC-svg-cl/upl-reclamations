import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "blue" | "amber" | "emerald" | "rose" | "purple" | "slate";
  trend?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "blue",
  trend,
}: MetricCardProps) {
  const variantStyles = {
    blue: {
      bg: "bg-blue-50/70 dark:bg-blue-950/30",
      border: "border-blue-200/80 dark:border-blue-900/50",
      iconBg: "bg-blue-600 text-white shadow-blue-600/30",
      text: "text-blue-950 dark:text-blue-100",
    },
    amber: {
      bg: "bg-amber-50/70 dark:bg-amber-950/30",
      border: "border-amber-200/80 dark:border-amber-900/50",
      iconBg: "bg-amber-600 text-white shadow-amber-600/30",
      text: "text-amber-950 dark:text-amber-100",
    },
    emerald: {
      bg: "bg-emerald-50/70 dark:bg-emerald-950/30",
      border: "border-emerald-200/80 dark:border-emerald-900/50",
      iconBg: "bg-emerald-600 text-white shadow-emerald-600/30",
      text: "text-emerald-950 dark:text-emerald-100",
    },
    rose: {
      bg: "bg-rose-50/70 dark:bg-rose-950/30",
      border: "border-rose-200/80 dark:border-rose-900/50",
      iconBg: "bg-rose-600 text-white shadow-rose-600/30",
      text: "text-rose-950 dark:text-rose-100",
    },
    purple: {
      bg: "bg-purple-50/70 dark:bg-purple-950/30",
      border: "border-purple-200/80 dark:border-purple-900/50",
      iconBg: "bg-purple-600 text-white shadow-purple-600/30",
      text: "text-purple-950 dark:text-purple-100",
    },
    slate: {
      bg: "bg-slate-50/70 dark:bg-slate-900/40",
      border: "border-slate-200 dark:border-slate-800",
      iconBg: "bg-slate-700 text-white shadow-slate-700/30",
      text: "text-slate-950 dark:text-slate-100",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 transition-all duration-200 hover:shadow-md",
        style.bg,
        style.border
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className={cn("text-3xl font-black tracking-tight", style.text)}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground font-medium pt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md",
            style.iconBg
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
