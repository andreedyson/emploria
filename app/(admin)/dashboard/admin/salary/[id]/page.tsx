import SalaryInvoicePDFViewer from "@/components/dashboard/admin/salary/salary-invoice-pdf-viewer";

export default async function SalaryByIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div className="h-screen">
      <SalaryInvoicePDFViewer id={id} />
    </div>
  );
}
