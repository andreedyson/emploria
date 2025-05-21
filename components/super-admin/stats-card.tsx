// components/StatsCard.tsx
import { cn } from "@/lib/utils";
import { StatsCardProps } from "@/types/super-admin/dashboard";

const StatsCard = ({ name, total, icon: Icon, textColor }: StatsCardProps) => {
  return (
    <div className="bg-background flex items-center justify-between rounded-lg border-2 bg-gradient-to-tr p-4">
      <div className="space-y-2">
        <p className="line-clamp-1 text-xs font-semibold tracking-tight uppercase">
          {name}
        </p>
        <h4
          className={cn(
            "line-clamp-1 text-2xl font-bold lg:text-3xl",
            textColor,
          )}
        >
          {total}{" "}
          <span className="text-muted-foreground text-xs font-medium">
            {name}
          </span>
        </h4>
      </div>
      <div>
        <Icon className={cn("opacity-80 lg:size-14 xl:size-18", textColor)} />
      </div>
    </div>
  );
};

export default StatsCard;
