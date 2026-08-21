"use client";

import { useState } from "react";
import { toggleUserStatusAction } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import { Shield, GraduationCap, Building2, Search, CheckCircle, Ban } from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  matricule: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date | string;
  service?: { name: string } | null;
  faculty?: { name: string } | null;
  studentProfile?: {
    promotion?: { name: string } | null;
  } | null;
}

export function UserTable({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const handleToggle = async (userId: string) => {
    const res = await toggleUserStatusAction(userId);
    if (res.success && res.isActive !== undefined) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: res.isActive! } : u))
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      search === "" ||
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.matricule && u.matricule.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <Card className="p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Input
              placeholder="Recherche par nom, matricule ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs sm:text-sm"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous les rôles</option>
              <option value="STUDENT">Étudiants</option>
              <option value="STAFF">Responsables de service</option>
              <option value="ADMIN">Administrateurs</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b text-muted-foreground uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">Utilisateur</th>
                <th className="p-3.5">Matricule / Identifiant</th>
                <th className="p-3.5">Rôle</th>
                <th className="p-3.5">Entité rattachée</th>
                <th className="p-3.5">Statut</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-foreground">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{u.email}</p>
                    </td>

                    <td className="p-3.5 font-mono font-medium text-foreground">
                      {u.matricule || "-"}
                    </td>

                    <td className="p-3.5">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          <Shield className="h-3 w-3" /> ADMIN
                        </span>
                      ) : u.role === "STAFF" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          <Building2 className="h-3 w-3" /> STAFF
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          <GraduationCap className="h-3 w-3" /> ÉTUDIANT
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-muted-foreground">
                      {u.service?.name ||
                        u.studentProfile?.promotion?.name ||
                        u.faculty?.name ||
                        "-"}
                    </td>

                    <td className="p-3.5">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="h-3 w-3" /> Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <Ban className="h-3 w-3" /> Désactivé
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <Button
                        variant={u.isActive ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggle(u.id)}
                        className="text-xs h-8"
                      >
                        {u.isActive ? "Désactiver" : "Activer"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
