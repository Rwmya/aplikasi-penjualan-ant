import SideMenu from "@/components/SideMenu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aplikasi Penjualan",
  description: "Aplikasi Penjualan",
};

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <SideMenu />
          <div className="flex flex-col flex-1">
            <main className="flex-1 overflow-y-auto p-5">{children}</main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
