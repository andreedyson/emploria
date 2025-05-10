"use client";

import { Check, Home, LogOut, Settings2, User } from "lucide-react";

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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

// Menu items. Change according to the needs of your applications
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: User,
  },
  {
    title: "Tasks",
    url: "/dashboard/tasks",
    icon: Check,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings2,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const pathnameSplit = pathname.split("/").slice(0, 3).join("/");

  return (
    <Sidebar collapsible="icon" className="border-r-4">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg font-bold italic">
                  E
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
                      className={`hover:text-main-violet-500 duration-200 ${pathnameSplit === item.url ? "text-main-violet-700 font-semibold" : ""}`}
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
                className="my-3 flex cursor-pointer items-center justify-center gap-2 font-semibold text-red-500 duration-200 hover:bg-red-200"
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
