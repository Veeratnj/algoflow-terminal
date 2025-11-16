import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("af_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("af_sidebar_collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar: collapsed on desktop, toggled drawer on mobile */}
      <Sidebar collapsed={collapsed} mobile={mobileOpen} onClose={() => setMobileOpen(false)} onToggle={() => setCollapsed((s) => !s)} />

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Top bar inside main content */}
        <header className="flex items-center gap-2 px-4 py-3 border-b bg-background/80">
          <button
            className="md:hidden p-2 rounded hover:bg-accent/10"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* desktop collapse button removed - use footer control in sidebar */}

          <div className="flex-1" />
        </header>

        <main className="flex-1 overflow-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
};
