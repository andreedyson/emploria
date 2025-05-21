import { getImageUrl } from "@/lib/supabase";
import { RecentlyAddedUsersProps } from "@/types/super-admin/dashboard";
import Image from "next/image";

type RecentlyAddedUsersListsProps = {
  user: RecentlyAddedUsersProps;
};

function RecentlyAddedUsersLists({ user }: RecentlyAddedUsersListsProps) {
  const roleText = user.role.split("_").join(" ");
  return (
    <article>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Image
            src={
              getImageUrl(user.image as string, "users") ||
              "/assets/image-placeholder.svg"
            }
            width={80}
            height={80}
            alt={user.name}
            className="size-8 rounded-full border-2 md:size-10"
          />
          <div>
            <p className="line-clamp-1 text-xs font-bold md:text-sm">
              {user.name}
            </p>
            <p
              className={`${user.role.includes("SUPER_ADMIN") ? "text-red-500" : "text-picton-blue-500"} line-clamp-1 text-xs font-semibold`}
            >
              {roleText}
            </p>
          </div>
        </div>
        <p className="text-xs font-semibold">{user.company.name ?? "-"}</p>
      </div>
    </article>
  );
}

export default RecentlyAddedUsersLists;
