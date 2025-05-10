import AuthProvider from "@/auth-provider";
import LandingHeader from "@/components/layout/landing-header";
import type { Metadata } from "next";
import "../globals.css";
import MobileHeader from "@/components/layout/mobile-header";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Next.js Template",
  description: "Next.js boilerplate for website project.",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthProvider>
        <LandingHeader />
        <MobileHeader />
        <div className="my-4 max-w-[1920px] antialiased max-md:mx-4 md:mx-[80px] lg:mx-[144px] 2xl:mx-auto">
          {children}
        </div>
      </AuthProvider>
      <Footer />
    </div>
  );
}
