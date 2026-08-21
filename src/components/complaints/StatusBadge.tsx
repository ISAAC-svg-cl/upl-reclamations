import { ComplaintStatus } from "@/types";
import { getStatusBadgeVariant, getStatusLabel, cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string | ComplaintStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const typedStatus = status as ComplaintStatus;
  const variant = getStatusBadgeVariant(typedStatus);
  const label = getStatusLabel(typedStatus);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs transition-colors",
        variant.bg,
        variant.text,
        variant.border,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", variant.dot)} />
      {label}
    </span>
  );
}
