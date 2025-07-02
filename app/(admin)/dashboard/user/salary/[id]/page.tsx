import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SalaryInvoicePDFViewer from "@/components/dashboard/admin/salary/salary-invoice-pdf-viewer";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function UserSalaryByIdPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const user = session.user;
  return (
    <div className="h-screen">
      <SalaryInvoicePDFViewer id={id} user={user} />
    </div>
  );
}
