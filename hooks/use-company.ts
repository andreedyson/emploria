"use client";

import { getAllCompanies } from "@/lib/data/super-admin/company";
import { AllCompaniesProps } from "@/types/super-admin/company";
import { useQuery } from "@tanstack/react-query";

export function useCompanies() {
  const { data, isLoading, isError, error } = useQuery<AllCompaniesProps[]>({
    queryKey: ["categories"],
    queryFn: () => getAllCompanies(),
  });

  return { data, isLoading, isError, error };
}
