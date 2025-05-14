"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";
import UserAvatar from "../user-avatar";

function AdminHeader() {
  const pathname = usePathname();
  const pageName =
    pathname.split("/").length >= 3
      ? pathname.split("/")[1]
      : pathname.split("/")[0];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h2 className="font-bold capitalize">{pageName}</h2>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserAvatar
          fullname="Andre"
          role="SUPER_ADMIN"
          email={"andre@mail.com"}
        />
      </div>
    </header>
  );
}

export default AdminHeader;
