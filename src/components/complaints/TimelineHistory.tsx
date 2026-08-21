import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getStatusLabel, getStatusBadgeVariant } from "@/lib/utils";
import { CheckCircle2, Clock, FileEdit, HelpCircle, ArrowRightCircle, XCircle } from "lucide-react";

interface TimelineEvent {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  reason: string | null;
  createdAt: Date | string;
  author: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface TimelineHistoryProps {
  events: TimelineEvent[];
}

export function TimelineHistory({ events }: TimelineHistoryProps) {
  if (!events || events.length === 0) {
    return <p className="text-sm text-muted-foreground italic">Aucun historique disponible.</p>;
  }

  const getIcon = (status: string) => {
    switch (status) {
      case "NEW":
        return <FileEdit className="h-4 w-4 text-blue-600" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-amber-600 animate-spin" />;
      case "WAITING_INFO":
        return <HelpCircle className="h-4 w-4 text-purple-600" />;
      case "RESOLVED":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-rose-600" />;
      default:
        return <ArrowRightCircle className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
      {events.map((event, index) => {
        const dateFormatted = format(new Date(event.createdAt), "dd MMM yyyy 'à' HH:mm", {
          locale: fr,
        });
        const statusLabel = getStatusLabel(event.toStatus as any);
        const variant = getStatusBadgeVariant(event.toStatus as any);

        return (
          <div key={event.id} className="relative group">
            {/* Dot / Icon */}
            <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-background border ring-4 ring-background shadow-xs">
              {getIcon(event.toStatus)}
            </div>

            <div className="bg-card border rounded-lg p-3 shadow-xs space-y-1.5 transition-all group-hover:border-primary/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${variant.bg} ${variant.text}`}>
                    {statusLabel}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    par <strong className="text-foreground">{event.author.firstName} {event.author.lastName}</strong> ({event.author.role})
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">{dateFormatted}</span>
              </div>

              {event.reason && (
                <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border border-border/50">
                  <span className="font-medium text-foreground">Note : </span>
                  {event.reason}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
