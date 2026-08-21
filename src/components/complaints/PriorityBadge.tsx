import { ComplaintPriority } from "@/types";
import { getPriorityBadgeVariant, getPriorityLabel, cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, ArrowDown, Flame } from "lucide-react";

interface PriorityBadgeProps {
  priority: string | ComplaintPriority;
  className?: string;
  showIcon?: boolean;
}

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const typedPriority = priority as ComplaintPriority;
  const variant = getPriorityBadgeVariant(typedPriority);
  const label = getPriorityLabel(typedPriority);

  const renderIcon = () => {
    switch (typedPriority) {
      case "LOW":
        return <ArrowDown className="h-3 w-3" />;
      case "NORMAL":
        return <AlertCircle className="h-3 w-3" />;
      case "HIGH":
        return <AlertTriangle className="h-3 w-3 text-orange-600" />;
      case "URGENT":
        return <Flame className="h-3 w-3 text-red-600 animate-bounce" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors",
        variant.bg,
        variant.text,
        variant.border,
        className
      )}
    >
      {showIcon && renderIcon()}
      {label}
    </span>
  );
}
