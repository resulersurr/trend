import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <AdminSidebar />
        <div className="flex-1">
          <header className="border-b border-border bg-card/60 px-4 py-4 md:px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-semibold text-foreground md:text-lg">Yonetim Alani</h1>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">beta</span>
            </div>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
