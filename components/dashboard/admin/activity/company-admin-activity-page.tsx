"use client";

import { Activity } from "@prisma/client";
import { ChartColumnStacked } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ActivityList from "../dashboard/activity-list";
import { Button } from "@/components/ui/button";

type Props = {
  activities: Activity[];
};

export default function CompanyAdminActivityClientPage({ activities }: Props) {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(activities.length / pageSize);
  const topRef = useRef<HTMLDivElement>(null);

  const paginatedActivities = activities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Scroll to top on page change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  return (
    <section className="space-y-4" ref={topRef}>
      <div className="bg-card relative space-y-3 rounded-lg border-2 p-4">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full space-y-2">
            <h2 className="flex items-center gap-2 text-2xl leading-none font-bold md:text-3xl">
              <ChartColumnStacked className="size-6 md:size-8" />
              Activity
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm leading-5 md:text-base">
              View all of the activity logs from this company.
            </p>
          </div>
        </div>

        {/* Activity List */}
        <div>
          {paginatedActivities.map((act) => (
            <ActivityList key={act.id} activity={act} />
          ))}
        </div>

        {/* Sticky Pagination Controls */}
        <div className="bg-card sticky bottom-0 mt-6 flex flex-wrap items-center justify-center gap-2 py-3 backdrop-blur-sm">
          <Button
            variant={"secondary"}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded-md border px-3 py-1 text-sm ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant={"secondary"}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-md border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
