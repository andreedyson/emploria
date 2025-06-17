"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getImageUrl } from "@/lib/supabase";
import {
  ChartBarStacked,
  House,
  LogOutIcon,
  Settings2,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type UserAvatarProps = {
  fullname: string;
  role: string;
  email: string;
  image: string | null;
};

function UserAvatar({ fullname, role, email, image }: UserAvatarProps) {
  const pathname = usePathname();
  const nameParts = fullname.trim().split(" ");
  const userInitial = nameParts
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  const isUserAdmin = role === "SUPER_ADMIN" || role === "SUPER_ADMIN_COMPANY";

  const isOnDashboard = pathname.includes("/dashboard");
  const linkHref = isUserAdmin
    ? isOnDashboard
      ? "/"
      : "/dashboard"
    : "/dashboard/user/profile";

  const linkLabel = isUserAdmin
    ? isOnDashboard
      ? "Main Page"
      : "Dashboard"
    : "Profile";

  const linkIcon = isUserAdmin ? (
    isOnDashboard ? (
      <House />
    ) : (
      <ChartBarStacked />
    )
  ) : (
    <User />
  );

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
              className="border-background z-[99] rounded-full border-4"
            />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[100] w-56" align="end" forceMount>
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
              {isUserAdmin ? "Admin" : "User"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={linkHref} className="flex w-full items-center gap-2">
              {linkIcon}
              {linkLabel}
            </Link>
          </DropdownMenuItem>
          {isUserAdmin && (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href={`/dashboard/${role === "SUPER_ADMIN" ? "super-admin" : "admin"}/settings`}
                className="flex w-full items-center gap-2"
              >
                <Settings2 />
                Settings
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ redirect: true })}
            className="cursor-pointer font-semibold text-red-500"
          >
            Log out
            <DropdownMenuShortcut className="text-red-500">
              <LogOutIcon size={20} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserAvatar;
