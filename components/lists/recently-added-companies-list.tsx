import { getImageUrl } from "@/lib/supabase";
import { RecentlyAddedCompaniesProps } from "@/types/super-admin/dashboard";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatDate } from "@/lib/utils";

type RecentlyAddedCompaniesListProps = {
  company: RecentlyAddedCompaniesProps;
};

function RecentlyAddedCompaniesList({
  company,
}: RecentlyAddedCompaniesListProps) {
  return (
    <article>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Image
            src={
              getImageUrl(company.image as string, "companies") ||
              "/assets/image-placeholder.svg"
            }
            width={80}
            height={80}
            alt={company.name}
            className="size-8 rounded-md border-2 md:size-12"
          />
          <div className="text-xs md:text-sm">
            <p className="line-clamp-1 font-bold">{company.name}</p>
            <p className="text-muted-foreground line-clamp-1 hidden md:block">
              {company.id}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Badge
            className={`border-2 font-semibold ${
              company.isActive
                ? "border-green-500 bg-green-400/30 text-green-600"
                : "border-gray-500 bg-gray-400/30 text-gray-600"
            }`}
          >
            {company.isActive ? "Active" : "Inactvie"}
          </Badge>
          <p className="text-xs md:text-sm">{formatDate(company.createdAt)}</p>
        </div>
      </div>
    </article>
  );
}

export default RecentlyAddedCompaniesList;
