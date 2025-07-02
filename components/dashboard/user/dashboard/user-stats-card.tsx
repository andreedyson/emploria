import { months } from "@/constants";
import { cn, convertRupiah } from "@/lib/utils";
import { UserStatsCardDataProps } from "@/types/user/dashboard";
import React from "react";

type UserStatsCardProps = {
  stats: UserStatsCardDataProps[];
};

function UserStatsCard({ stats }: UserStatsCardProps) {
  const Icon1 = stats[0].icon;
  const Icon2 = stats[1].icon;
  const Icon3 = stats[2].icon;
  const Icon4 = stats[3].icon;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Card 1 */}
      <div
        className={cn(
          "bg-card flex items-center gap-3 rounded-lg border-2 p-4",
          stats[0].bgColor,
        )}
      >
        <div>
          <Icon1 className="text-white lg:size-10 xl:size-12" />
        </div>
        <div className="space-y-1 text-white">
          <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
            {stats[0].title}
          </p>
          <h4 className="line-clamp-1 text-sm font-bold lg:text-base">
            {stats[0].text}
          </h4>
        </div>
      </div>

      {/* Card 2 */}
      <div
        className={cn(
          "bg-card flex items-center gap-3 rounded-lg border-2 p-4",
          stats[1].bgColor,
        )}
      >
        <div>
          <Icon2 className="text-white lg:size-10 xl:size-12" />
        </div>
        <div className="space-y-1 text-white">
          <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
            {stats[1].title}
          </p>
          <h4 className="line-clamp-1 text-sm font-bold lg:text-base">
            {stats[1].text}
          </h4>
        </div>
      </div>

      {/* Card 3 */}
      <div
        className={cn(
          "bg-card flex items-center gap-3 rounded-lg border-2 p-4",
          stats[2].bgColor,
        )}
      >
        <div>
          <Icon3 className="text-white lg:size-10 xl:size-12" />
        </div>
        <div className="space-y-1 text-white">
          <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
            {stats[2].title}
          </p>

          {stats[2].data ? (
            <div className="text-white">
              <h4 className="line-clamp-1 text-sm font-bold lg:text-base">
                {convertRupiah(stats[2].data?.total ?? 0)}
              </h4>
              <p className="text-muted text-xs font-medium">
                {
                  months.find((month) => month.value === stats[2].data?.month)
                    ?.label
                }{" "}
                {stats[2].data.year}
              </p>
            </div>
          ) : (
            "-"
          )}
        </div>
      </div>

      {/* Card 4 */}
      <div
        className={cn(
          "bg-card flex items-center gap-3 rounded-lg border-2 p-4",
          stats[3].bgColor,
        )}
      >
        <div>
          <Icon4 className="text-white lg:size-10 xl:size-12" />
        </div>
        <div className="space-y-1 text-white">
          <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
            {stats[3].title}
          </p>
          <h4 className="line-clamp-1 text-sm font-bold lg:text-base">
            {stats[3].text}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default UserStatsCard;
