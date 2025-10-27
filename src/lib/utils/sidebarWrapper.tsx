"use client";
import AppSidebar from "@/components/navbar/app-sidebar";
import Header from "@/components/navbar/header";
import { ReactNode, useState } from "react";

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header onSidebarOpen={() => setSidebarOpen(true)} />
      <div className="flex pt-14 h-[calc(100vh-56px)]">
        <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 bg-white lg:pl-64">{children}</main>
      </div>
    </>
  );
}
