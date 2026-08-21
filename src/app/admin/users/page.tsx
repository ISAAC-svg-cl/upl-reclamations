import { AcademicService } from "@/services/academic.service";
import { UserTable } from "./UserTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string }>;
}) {
  const params = await searchParams;
  const users = await AcademicService.getAllUsers(params.search, params.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Gestion des Utilisateurs</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Supervision des comptes étudiants, responsables de service et administrateurs UPL
        </p>
      </div>

      <UserTable initialUsers={users as any} />
    </div>
  );
}
