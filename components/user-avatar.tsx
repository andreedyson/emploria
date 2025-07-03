"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getImageUrl } from "@/lib/supabase";
import { House, LogOutIcon, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

type UserAvatarProps = {
  fullname: string;
  role: string;
  email: string;
  image: string | null;
};

function UserAvatar({ fullname, role, email, image }: UserAvatarProps) {
  const nameParts = fullname.trim().split(" ");
  const userInitial = nameParts
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  const isUserAdmin = role === "SUPER_ADMIN" || role === "SUPER_ADMIN_COMPANY";

  const dashboardLinkHref = isUserAdmin
    ? `/dashboard/${role === "SUPER_ADMIN" ? "super-admin" : "admin"}`
    : "/dashboard/user";

  const profileLinkHref = isUserAdmin
    ? `/dashboard/${role === "SUPER_ADMIN" ? "super-admin" : "admin"}/profile`
    : "/dashboard/user/profile";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button
          variant="ghost"
          className="relative size-8 rounded-full border-2 md:size-10"
        >
          <Avatar className="bg-main-violet-300 flex items-center justify-center font-semibold">
            <AvatarImage
              src={
                getImageUrl(image as string, "users") ||
                "/assets/image-placeholder.svg"
              }
              width={100}
              height={100}
              alt={userInitial || "User Profile"}
              className="border-background z-[99] rounded-full object-cover"
            />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[100] w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 text-right">
            <p className="text-sm leading-none font-semibold">{fullname}</p>
            <p className="text-muted-foreground text-sm leading-none font-medium">
              {email}
            </p>
            <p
              className={`text-sm leading-none font-medium ${
                isUserAdmin ? "text-red-500" : "text-slate-400"
              }`}
            >
              {isUserAdmin ? "Admin" : "Employee"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          {/* Main Dashboard Button */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href={dashboardLinkHref}
              className="flex w-full items-center gap-2"
            >
              <div className="grid size-7 place-items-center rounded-full bg-slate-200">
                <House className="dark:text-background text-foreground" />
              </div>
              <div>
                <p className="text-sm">Dashboard</p>
                <p className="text-muted-foreground text-xs">
                  View main dashboard
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
          {/* Profile Button */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href={profileLinkHref}
              className="flex w-full items-center gap-2"
            >
              <div className="grid size-7 place-items-center rounded-full bg-slate-200">
                <User className="dark:text-background text-foreground" />
              </div>
              <div>
                <p className="text-sm">Profile</p>
                <p className="text-muted-foreground text-xs">
                  View your user profile
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
          {/* Logout Button */}
          <DropdownMenuItem
            onClick={() => signOut({ redirect: true })}
            className="cursor-pointer text-red-500"
          >
            <div className="grid size-7 place-items-center rounded-full bg-slate-200 font-semibold">
              <LogOutIcon className="text-red-500" />
            </div>
            <div>
              <p className="text-sm">Log Out</p>
              <p className="text-muted-foreground text-xs">
                Sign out from your account
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserAvatar;
