"use client";

import { Avatar } from "@/components/ui/avatar";
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
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  email: string;
};

function UserAvatar({ fullname, role, email }: UserAvatarProps) {
  const pathname = usePathname();
  const nameParts = fullname.trim().split(" ");
  const userInitial = nameParts
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  const isUserAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const isOnDashboard = pathname.includes("/dashboard");
  const linkHref = isUserAdmin
    ? isOnDashboard
      ? "/"
      : "/dashboard"
    : "/profile";

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
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-8 rounded-full border-2 md:size-10"
        >
          <Avatar className="bg-main-violet-300 flex items-center justify-center font-semibold">
            {userInitial}
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
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href={"/dashboard/settings"}
              className="flex w-full items-center gap-2"
            >
              <Settings2 />
              Settings
            </Link>
          </DropdownMenuItem>
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
