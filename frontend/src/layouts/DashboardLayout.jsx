
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { useDemoAuth } from "../context/DemoAuthContext.jsx";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  const { role } = useDemoAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen min-w-0 bg-page text-text-primary">
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
  className={`fixed inset-y-0 left-0 z-50 h-dvh w-fit transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
        <Sidebar
          role={role}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar
          onMenuClick={() => setMobileMenuOpen((value) => !value)}
        />

        <main className="w-full min-w-0 flex-1 bg-page px-5 py-6 sm:px-7 sm:py-8 lg:px-8">
          <Outlet />
        </main>

        <footer className="flex flex-col gap-1 border-t border-border bg-white px-5 py-4 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8">
          <span className="font-semibold text-text-primary">
            SmartProcure
          </span>
          <span>Intelligent procurement. Human-led decisions.</span>
        </footer>
      </div>
    </div>
  );
}
