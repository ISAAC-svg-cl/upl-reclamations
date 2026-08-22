"use client";

import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";
import { exportComplaintsToCsv, ExportComplaintRow } from "@/lib/export";

interface ExportComplaintsButtonProps {
  data: ExportComplaintRow[];
  filename?: string;
}

export function ExportComplaintsButton({ data, filename }: ExportComplaintsButtonProps) {
  const handleExport = () => {
    exportComplaintsToCsv(data, filename);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className="gap-2 text-xs font-semibold h-9 border-slate-300 dark:border-slate-700 hover:bg-muted"
    >
      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
      <span>Exporter en Excel / CSV ({data.length})</span>
    </Button>
  );
}
