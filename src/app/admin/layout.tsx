import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect(user.role === "STAFF" ? "/staff/dashboard" : "/student/dashboard");
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
