// components/StatsCard.tsx
import { cn } from "@/lib/utils";
import { StatsCardProps } from "@/types/super-admin/dashboard";

const StatsCard = ({ name, total, icon: Icon, bgColor }: StatsCardProps) => {
  return (
    <div
      className={cn(
        "bg-card flex items-center justify-between rounded-lg border-2 p-4",
        bgColor,
      )}
    >
      <div className="space-y-2 text-white">
        <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
          {name}
        </p>
        <h4 className="line-clamp-1 text-2xl font-bold lg:text-3xl">
          {total} <span className="text-muted text-xs font-medium">{name}</span>
        </h4>
      </div>
      <div>
        <Icon className="text-white lg:size-14 xl:size-18" />
      </div>
    </div>
  );
};

export default StatsCard;
