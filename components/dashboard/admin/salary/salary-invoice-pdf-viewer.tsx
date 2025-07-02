"use client";

import { useEffect, useState } from "react";
import SalaryInvoicePDF from "@/components/dashboard/admin/salary/salary-invoice-pdf";
import { getSalaryById } from "@/lib/data/admin/salary";
import { SalaryColumnsProps } from "@/types/admin/salary";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Receipt } from "lucide-react";

type Props = { id: string };

export default function SalaryInvoicePDFViewer({ id }: Props) {
  const [data, setData] = useState<SalaryColumnsProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalaryById(id).then((salary) => {
      setData(salary);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div>Loading PDF...</div>;
  if (!data) return <div className="text-red-500">Failed to load data</div>;

  // Custom filename depending on the employee data
  const fileName =
    `Salary-${data.employee.name}-${data.month}-${data.year}`
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]/g, "") + ".pdf";

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
