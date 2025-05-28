"use client";

import {
  Banknote,
  CalendarDays,
  CalendarX,
  LayoutDashboard,
  LogOut,
  User,
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
    url: "/dashboard/user",
    icon: LayoutDashboard,
  },
  {
    title: "Attendance",
    url: "/dashboard/user/attendance",
    icon: CalendarDays,
  },
  {
    title: "Leave",
    url: "/dashboard/user/leave",
    icon: CalendarX,
  },
  {
    title: "Salary",
    url: "/dashboard/user/salary",
    icon: Banknote,
  },
  {
    title: "Profile",
    url: "/dashboard/user/profile",
    icon: User,
  },
];

export function UserSidebar() {
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
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span
                        className={`duration-200 ${
                          pathnameSplit === item.url
                            ? "text-picton-blue-700 font-semibold"
                            : "hover:text-picton-blue-500"
                        }`}
                      >
                        {item.title}
                      </span>
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
