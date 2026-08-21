export type Role = "STUDENT" | "STAFF" | "ADMIN";

export type ComplaintPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type ComplaintStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "WAITING_INFO"
  | "FORWARDED"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";

export interface UserSession {
  id: string;
  email: string;
  matricule?: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  role: Role;
  serviceId?: string | null;
  serviceName?: string | null;
  facultyId?: string | null;
  facultyName?: string | null;
  promotionName?: string | null;
}

export interface ComplaintSummary {
  id: string;
  reference: string;
  subject: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    matricule?: string | null;
    email: string;
    promotion?: string | null;
    faculty?: string | null;
  };
  category: {
    id: string;
    name: string;
    code: string;
  };
  service?: {
    id: string;
    name: string;
    code: string;
  } | null;
  faculty?: {
    id: string;
    name: string;
    code: string;
  } | null;
  department?: {
    id: string;
    name: string;
  } | null;
  responsesCount: number;
  attachmentsCount: number;
}
