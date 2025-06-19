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
import { Company, Employee, LeavePolicy } from "@prisma/client";
import { getImageUrl } from "@/lib/supabase";

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

type SuperAdminCompanySidebarProps = {
  company:
    | (Company & { LeavePolicy: LeavePolicy[]; employee: Employee[] })
    | null;
};

export function SuperAdminCompanySidebar({
  company,
}: SuperAdminCompanySidebarProps) {
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
          <div className="rounded border-2 p-1">
            <div className="flex items-center gap-2">
              <Image
                src={
                  getImageUrl(company?.image as string, "companies") ||
                  "/assets/image-placeholder.svg"
                }
                width={100}
                height={100}
                alt={company?.name || "Company"}
                className="size-10"
              />
              <div className="text-sm">
                <p className="line-clamp-1 font-semibold">{company?.name}</p>
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                  <Users size={12} />
                  <p>{company?.employee.length} Members</p>
                </div>
              </div>
            </div>
          </div>
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
