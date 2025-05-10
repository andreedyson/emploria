"use client";

import { LANDING_PAGE_LINKS } from "@/constants";
import { cn } from "@/lib/utils";
import { AlignJustify, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserAvatar from "../user-avatar";
import { ThemeToggle } from "../theme-toggle";

function MobileHeader() {
  const [openNav, setOpenNav] = useState<boolean>(false);
  const session = useSession();
  const pathname = usePathname();
  const pagename = "/" + pathname.split("/")[1];

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setOpenNav(false);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 md:mt-6">
      <nav className="bg-background relative flex w-full items-center justify-between border-b p-4 shadow-md md:hidden md:rounded-md">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              onClick={() => setOpenNav((prev) => !prev)}
              className="cursor-pointer"
            >
              {openNav ? <X size={24} /> : <AlignJustify size={24} />}
            </div>
            <div className="text-main-violet-500 text-xl font-bold">
              Emploria
            </div>
          </div>
        </div>

        {/* User Avatar & Sign In */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session.status === "unauthenticated" ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 text-sm font-medium lg:text-base">
                <Link
                  href={"/sign-in"}
                  className="duration-200 hover:text-slate-800 hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            <UserAvatar
              fullname="Andre Edyson"
              role="SUPER_ADMIN"
              email="andre@mail.com"
            />
          )}
        </div>

        <div
          className={`bg-background dark:bg-background absolute top-[60px] flex h-[92vh] w-full flex-col border p-4 duration-200 ${openNav ? "left-0" : "-left-[1000px]"}`}
        >
          <div className="flex flex-col gap-1">
            {LANDING_PAGE_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.url}
                className={cn(
                  "flex items-center gap-2 rounded-md p-2.5 text-xs font-semibold",
                  pagename === link.url &&
                    "bg-main-200 text-main-800 dark:bg-main-950 dark:text-main-300 font-semibold shadow-[0px_0px_10px_2px_#00000024] transition-all duration-300 ease-in-out",
                )}
                onClick={() => setOpenNav(false)}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default MobileHeader;
