import "./globals.css";
import type { Metadata } from "next";
import type React from "react";
import { ToastProvider } from "@/components/Toast";
import { ConfirmDialogProvider } from "@/components/ConfirmDialog";

export const metadata: Metadata = {
  title: "Products App",
  description: "Product Form with dynamic Variants",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="bg-[#f5f5f5] text-[#111827]">
        <ToastProvider>
          <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

