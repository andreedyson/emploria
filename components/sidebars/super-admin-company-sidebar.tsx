"use client";

import {
  Banknote,
  Building2,
  CalendarDays,
  CalendarX,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Employee",
    url: "/dashboard/admin/employee",
    icon: Users,
  },
  {
    title: "Department",
    url: "/dashboard/admin/department",
    icon: Building2,
  },
  {
    title: "Attendance",
    url: "/dashboard/admin/attendance",
    icon: CalendarDays,
  },
  {
    title: "Leave",
    url: "/dashboard/admin/leave",
    icon: CalendarX,
  },
  {
    title: "Salary",
    url: "/dashboard/admin/salary",
    icon: Banknote,
  },
  {
    title: "Settings",
    url: "/dashboard/admin/settings",
    icon: Settings,
  },
];

export function SuperAdminCompanySidebar() {
  const pathname = usePathname();
  const pathnameSplit = pathname.split("/").slice(0, 4).join("/");

  return (
    <Sidebar collapsible="icon" className="border-r-4">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg font-bold italic">
                  <Image
                    src={"/assets/emploria-logo.svg"}
                    width={80}
                    height={80}
                    alt="Emploria Logo"
                  />
                </div>
                <div className="leading-none">
                  <span className="font-semibold italic">Emploria</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 duration-200 ${
                        pathnameSplit === item.url
                          ? "text-picton-blue-700 dark:text-picton-blue-500 font-semibold"
                          : "hover:text-picton-blue-500 hover:dark:text-picton-blue-400"
                      }`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="my-3 flex cursor-pointer items-center justify-center gap-2 font-semibold text-red-500 duration-200 hover:text-red-800"
                onClick={() => {
                  signOut({ redirect: true });
                }}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
