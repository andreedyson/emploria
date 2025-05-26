"use client";

import { getAllEmployees } from "@/lib/data/admin/employee";
import { EmployeeColumnProps } from "@/types/admin/employee";
import { useQuery } from "@tanstack/react-query";

export function useEmployee(companyId: string) {
  const { data, isLoading, isError, error } = useQuery<EmployeeColumnProps[]>({
    queryKey: ["employees", companyId],
    queryFn: () => getAllEmployees(companyId),
    enabled: !!companyId,
  });

  return { data, isLoading, isError, error };
}
