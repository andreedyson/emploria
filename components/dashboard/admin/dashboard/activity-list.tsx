import { Activity } from "@prisma/client";
import { format } from "date-fns";

type ActivityListProps = {
  activity: Activity;
};

function ActivityList({ activity }: ActivityListProps) {
  const formattedTimestamp = format(activity.timestamp, "d MMM, HH:mm");

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0 dark:border-gray-700">
      <div className="flex flex-col">
        <p className="mb-1 text-sm font-semibold text-gray-800 md:text-base dark:text-gray-100">
          {activity.action.split("_").join(" ")}{" "}
          <span className="text-blue-600 dark:text-blue-400">
            {activity.targetType}
          </span>
        </p>
        <p
          title={activity.description}
          className="line-clamp-2 max-w-[230px] text-xs text-gray-600 md:max-w-[400px] md:text-sm dark:text-gray-300"
        >
          {activity.description}
        </p>
      </div>
      <div className="flex-shrink-0 text-right text-xs text-gray-500 md:text-sm dark:text-gray-400">
        <p>{formattedTimestamp}</p>
      </div>
    </div>
  );
}

export default ActivityList;
