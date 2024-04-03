import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import ReactQueryProvider from "@/components/components/provider/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Libro",
  description: "나만의 작은 도서관",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ReactQueryProvider>
          <Suspense>
            <div className="App min-h-screen max-h-screen max-w-md relative bg-gray-100 mx-auto overscroll-y-none touch-none">
              <Header />
              <div className="pt-12"/>
              {children}
              <BottomNavigation />
              <Toaster />
            </div>
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
