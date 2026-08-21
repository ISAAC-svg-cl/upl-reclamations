import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Redirection si l'utilisateur est staff ou admin et visite /student
  // Les admins ont aussi le droit d'inspecter l'espace étudiant
  if (user.role === "STAFF") {
    redirect("/staff/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      <Sidebar user={user} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {children}
      </div>
    </div>
  );
}
