import { format } from "date-fns";

export interface ExportComplaintRow {
  reference: string;
  createdAt: Date | string;
  studentName: string;
  matricule: string;
  filiere: string;
  promotion: string;
  category: string;
  priority: string;
  status: string;
  subject: string;
  service: string;
}

export function exportComplaintsToCsv(rows: ExportComplaintRow[], filename = "reclamations_upl.csv") {
  const headers = [
    "Référence",
    "Date de Dépôt",
    "Étudiant",
    "Matricule",
    "Filière",
    "Promotion",
    "Catégorie",
    "Priorité",
    "Statut",
    "Objet",
    "Service Assigné",
  ];

  const escapeCsv = (str: string) => `"${(str || "").replace(/"/g, '""')}"`;

  const csvRows = [
    headers.join(";"),
    ...rows.map((row) =>
      [
        escapeCsv(row.reference),
        escapeCsv(format(new Date(row.createdAt), "dd/MM/yyyy HH:mm")),
        escapeCsv(row.studentName),
        escapeCsv(row.matricule),
        escapeCsv(row.filiere),
        escapeCsv(row.promotion),
        escapeCsv(row.category),
        escapeCsv(row.priority),
        escapeCsv(row.status),
        escapeCsv(row.subject),
        escapeCsv(row.service),
      ].join(";")
    ),
  ];

  const csvContent = "\uFEFF" + csvRows.join("\r\n"); // UTF-8 BOM pour Excel
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
