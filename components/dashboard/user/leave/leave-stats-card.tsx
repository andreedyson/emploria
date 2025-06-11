import { cn } from "@/lib/utils";
import { LeaveStatsCardProps } from "@/types/user/leave";

function LeaveStatsCard({
  type,
  total,
  icon: Icon,
  textColor,
}: LeaveStatsCardProps) {
  return (
    <div className="bg-card flex items-center justify-between rounded-lg border-2 p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("opacity-80 lg:size-4 xl:size-6", textColor)} />
          <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
            {type}
          </p>
        </div>
        <h4
          className={cn(
            "line-clamp-1 text-2xl font-bold lg:text-3xl",
            textColor,
          )}
        >
          {total}
        </h4>
      </div>
    </div>
  );
}

export default LeaveStatsCard;
