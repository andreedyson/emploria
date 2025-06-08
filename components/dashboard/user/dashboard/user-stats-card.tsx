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
      <div className="bg-card flex items-center gap-3 rounded-lg border-2 p-4">
        <div>
          <Icon1
            className={cn(
              "opacity-80 lg:size-10 xl:size-12",
              stats[0].textColor,
            )}
          />
        </div>
        <div className="space-y-1">
          <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
            {stats[0].title}
          </p>
          <h4
            className={cn(
              "line-clamp-1 text-sm font-bold lg:text-base",
              stats[0].textColor,
            )}
          >
            {stats[0].text}
          </h4>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-card flex items-center gap-3 rounded-lg border-2 p-4">
        <div>
          <Icon2
            className={cn(
              "opacity-80 lg:size-10 xl:size-12",
              stats[1].textColor,
            )}
          />
        </div>
        <div className="space-y-1">
          <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
            {stats[1].title}
          </p>
          <h4
            className={cn(
              "line-clamp-1 text-sm font-bold lg:text-base",
              stats[1].textColor,
            )}
          >
            {stats[1].text}
          </h4>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-card flex items-center gap-3 rounded-lg border-2 p-4">
        <div>
          <Icon3
            className={cn(
              "opacity-80 lg:size-10 xl:size-12",
              stats[2].textColor,
            )}
          />
        </div>
        <div className="space-y-1">
          <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
            {stats[2].title}
          </p>

          {stats[2].data ? (
            <div>
              <h4
                className={cn(
                  "line-clamp-1 text-sm font-bold lg:text-base",
                  stats[2].textColor,
                )}
              >
                {convertRupiah(stats[2].data?.total ?? 0)}
              </h4>
              <p className="text-muted-foreground text-xs font-medium">
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
      <div className="bg-card flex items-center gap-3 rounded-lg border-2 p-4">
        <div>
          <Icon4
            className={cn(
              "opacity-80 lg:size-10 xl:size-12",
              stats[3].textColor,
            )}
          />
        </div>
        <div className="space-y-1">
          <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
            {stats[3].title}
          </p>
          <h4
            className={cn(
              "line-clamp-1 text-sm font-bold lg:text-base",
              stats[3].textColor,
            )}
          >
            {stats[3].text}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default UserStatsCard;
