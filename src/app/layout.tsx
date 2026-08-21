import type { Metadata } from "next";
import "./globals.css";
import { UPL_INSTITUTION_CONFIG } from "@/config/institution";
import { getCurrentUser } from "@/lib/auth";
import { NotificationService } from "@/services/notification.service";
import { Navbar } from "@/components/layout/Navbar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: `${UPL_INSTITUTION_CONFIG.appFunctionalName} | ${UPL_INSTITUTION_CONFIG.shortName}`,
    template: `%s | ${UPL_INSTITUTION_CONFIG.appFunctionalName}`,
  },
  description: UPL_INSTITUTION_CONFIG.description,
  keywords: [
    "UPL",
    "Université Protestante de Lubumbashi",
    "Réclamations étudiants",
    "Lubumbashi",
    "Haut-Katanga",
    "RDC",
    "Portail Académique",
  ],
  authors: [{ name: "Université Protestante de Lubumbashi" }],
  icons: {
    icon: "/branding/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const unreadCount = user ? await NotificationService.getUnreadCount(user) : 0;

  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar user={user} unreadNotifications={unreadCount} />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
