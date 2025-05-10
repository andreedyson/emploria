import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Emploria",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>{children}</div>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
        }}
      />
    </div>
  );
}
