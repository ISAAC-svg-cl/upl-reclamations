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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (let registration of registrations) {
                    registration.unregister();
                  }
                });
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (let name of names) caches.delete(name);
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans relative">
        {/* Filigrane d'arrière-plan officiel UPL permanent pour TOUTES les pages */}
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
          <div className="relative w-[480px] h-[480px] sm:w-[680px] sm:h-[680px] lg:w-[860px] lg:h-[860px] opacity-[0.08] dark:opacity-[0.06] select-none">
            <img
              src="/branding/logo-upl-officiel.png"
              alt=""
              aria-hidden="true"
              className="object-contain w-full h-full"
            />
          </div>
        </div>

        <Navbar user={user} unreadNotifications={unreadCount} />
        <main className="flex-1 flex flex-col relative z-10">{children}</main>
      </body>
    </html>
  );
}
