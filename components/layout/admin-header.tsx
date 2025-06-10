"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";
import UserAvatar from "../user-avatar";

type AdminHeaderProps = {
  name: string;
  email: string;
  role: string;
};

function AdminHeader({ name, email, role }: AdminHeaderProps) {
  const pathname = usePathname();
  const pageName =
    pathname.split("/").length >= 4
      ? pathname.split("/")[3]
      : pathname.split("/")[1];

  return (
    <header className="bg-background flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h2 className="font-bold capitalize">{pageName}</h2>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserAvatar fullname={name} role={role} email={email} />
      </div>
    </header>
  );
}

export default AdminHeader;
