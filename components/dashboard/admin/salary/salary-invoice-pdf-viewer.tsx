"use client";

import { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import SalaryInvoicePDF from "@/components/dashboard/admin/salary/salary-invoice-pdf";
import { SalaryColumnsProps } from "@/types/admin/salary";
import { getSalaryById } from "@/lib/data/admin/salary";

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
        {({ loading }) => (loading ? "Preparing document…" : "⬇️ Download PDF")}
      </PDFDownloadLink>

      <PDFViewer width="100%" height="80%">
        <SalaryInvoicePDF data={data} />
      </PDFViewer>
    </>
  );
}
