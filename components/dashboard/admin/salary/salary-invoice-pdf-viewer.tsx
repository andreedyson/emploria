"use client";

import SalaryInvoicePDF from "@/components/dashboard/admin/salary/salary-invoice-pdf";
import SalaryInvoicePageSkeletons from "@/components/skeletons/user/salary-invoice-page-skeletons";
import { getSalaryById } from "@/lib/data/admin/salary";
import { logActivity } from "@/lib/log-activity";
import { SalaryColumnsProps } from "@/types/admin/salary";
import { ActivityAction, ActivityTarget } from "@prisma/client";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { Receipt } from "lucide-react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type SalaryInvoicePDFViewerProps = { id: string; user: User };

export default function SalaryInvoicePDFViewer({
  id,
  user,
}: SalaryInvoicePDFViewerProps) {
  const { data, isLoading, isError } = useQuery<SalaryColumnsProps | null>({
    queryKey: ["salary-invoice", id],
    queryFn: async () => await getSalaryById(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000,
  });
  const router = useRouter();

  useEffect(() => {
    if (
      data &&
      user.role !== "SUPER_ADMIN_COMPANY" &&
      data.employee.userId !== user.id
    ) {
      router.push(
        `/dashboard/${user.role === "SUPER_ADMIN_COMPANY" ? "admin" : "user"}/salary`,
      );
    }
  }, [data, user.id, user.role, router]);

  if (isLoading)
    return (
      <div>
        <SalaryInvoicePageSkeletons />
      </div>
    );
  if (!data || isError)
    return <div className="text-red-500">Failed to load data</div>;

  // Custom filename depending on the employee data
  const fileName =
    `Salary-${data.employee.name}-${data.month}-${data.year}`
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]/g, "") + ".pdf";

  const logExportActivity = async () => {
    await logActivity({
      userId: user.id,
      companyId: data.company.id,
      action: ActivityAction.EXPORT,
      targetType: ActivityTarget.SALARY,
      targetId: data.id,
      description: `User ${user.email} exported salary invoice for ${data.employee.name} - ${data.month}/${data.year}`,
      metadata: {
        employeeId: data.employee.id,
        month: data.month,
        year: data.year,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="size-6 md:size-10" />
          <div>
            <h3 className="font-bold">Generate Payslip</h3>
            <p className="text-muted-foreground text-sm font-medium">
              Export salary data into PDF
            </p>
          </div>
        </div>
        <div>
          <PDFDownloadLink
            document={<SalaryInvoicePDF data={data} />}
            fileName={fileName}
            style={{
              marginBottom: 16,
              display: "inline-block",
              padding: "8px 12px",
              background: "#59b4f7",
              color: "white",
              borderRadius: 4,
              fontWeight: 500,
            }}
            onClick={async () => {
              await logExportActivity();
            }}
          >
            {({ loading }) =>
              loading ? "Preparing document…" : "⬇️ Download PDF"
            }
          </PDFDownloadLink>
        </div>
      </div>

      <PDFViewer width="100%" height="80%">
        <SalaryInvoicePDF data={data} />
      </PDFViewer>
    </>
  );
}
