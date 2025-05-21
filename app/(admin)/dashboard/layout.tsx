import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { SuperAdminSidebar } from "@/components/sidebars/super-admin-sidebar";
import AdminHeader from "@/components/layout/admin-header";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Geist } from "next/font/google";
import { SuperAdminCompanySidebar } from "@/components/sidebars/super-admin-company-sidebar";
import { UserSidebar } from "@/components/sidebars/user-sidebar";

export const metadata: Metadata = {
  title: {
    template: "%s | Dashboard",
    default: "Dashboard",
  },
  description:
    "SAP Dashboard for employee management from salary, attendance, leave, and much more.",
};

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    // ⚠️ Wraps the dashboard with React Query so all pages inside can use hooks like `useQuery`
    <ReactQueryProvider>
      <SidebarProvider>
        {session.user.role === "SUPER_ADMIN" ? (
          <SuperAdminSidebar />
        ) : session.user.role === "SUPER_ADMIN_COMPANY" ? (
          <SuperAdminCompanySidebar />
        ) : (
          <UserSidebar />
        )}
        <main className={`w-full antialiased ${geist.className}`}>
          <AdminHeader
            name={session.user.name as string}
            email={session.user.email as string}
            role={session.user.role}
          />
          <div className="m-4">{children}</div>
        </main>
        <Toaster position="bottom-right" />
      </SidebarProvider>
    </ReactQueryProvider>
  );
}
