"use client";

import { getAllDepartments } from "@/lib/data/admin/department";
import { Department } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useDepartments(companyId: string) {
  const { data, isLoading, isError, error } = useQuery<Department[]>({
    queryKey: ["departments", companyId],
    queryFn: () => getAllDepartments(companyId),
    enabled: !!companyId,
  });

  return { data, isLoading, isError, error };
}
