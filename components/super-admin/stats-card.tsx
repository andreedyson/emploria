// components/StatsCard.tsx
import { cn } from "@/lib/utils";
import { StatsCardProps } from "@/types/super-admin/dashboard";

const StatsCard = ({ name, total, icon: Icon, bgGradient }: StatsCardProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg bg-gradient-to-tr p-4 text-white",
        bgGradient,
      )}
    >
      <div className="space-y-2">
        <p className="line-clamp-1 text-xs font-semibold uppercase">{name}</p>
        <h4 className="line-clamp-1 text-2xl font-bold lg:text-3xl">
          {total} <span className="text-xs font-medium">{name}</span>
        </h4>
      </div>
      <div>
        <Icon className="opacity-80 lg:size-14 xl:size-18" />
      </div>
    </div>
  );
};

export default StatsCard;
