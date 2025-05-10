import { AppSidebar } from "@/components/app-sidebar";
import AdminHeader from "@/components/layout/admin-header";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    // Add metadata to each page with a title to use this page title template
    template: "%s | Dashboard",
    default: "Dashboard",
  },
  description:
    "Next.js starter kit template that help developer to kickstart their development journey.",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ⚠️ Wraps the dashboard with React Query so all pages inside can use hooks like `useQuery`
    <ReactQueryProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className={`w-full antialiased`}>
          <AdminHeader />
          <div className="m-4">{children}</div>
        </main>
      </SidebarProvider>
    </ReactQueryProvider>
  );
}
