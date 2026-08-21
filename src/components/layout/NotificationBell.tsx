"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationBellProps {
  initialCount: number;
  userRole: string;
}

export function NotificationBell({ initialCount, userRole }: NotificationBellProps) {
  const notifUrl =
    userRole === "STUDENT"
      ? "/student/notifications"
      : userRole === "STAFF"
      ? "/staff/notifications"
      : "/admin/notifications";

  return (
    <Link href={notifUrl}>
      <Button variant="ghost" size="icon" className="relative rounded-full text-foreground/80 hover:text-foreground">
        <Bell className="h-5 w-5" />
        {initialCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-pulse">
            {initialCount > 9 ? "9+" : initialCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
