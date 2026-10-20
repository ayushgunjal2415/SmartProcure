
import { NavLink } from "react-router-dom";
import {
  Activity,
  BellRing,
  BrainCircuit,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  PackageCheck,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";

const navigationByRole = {
  Employee: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "My Requests", path: "/requests", icon: FileText },
    { label: "Create Request", path: "/requests/new", icon: ShoppingCart },
    { label: "Request Tracking", path: "/request-tracking", icon: Activity },
  ],
  Officer: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Requests", path: "/requests", icon: FileText },
    { label: "Vendors & RFQs", path: "/vendors", icon: Building2 },
    { label: "Quotation Evaluations", path: "/evaluations", icon: BrainCircuit },
    { label: "Purchase Orders", path: "/purchase-orders", icon: PackageCheck },
    { label: "Order Tracking", path: "/tracking", icon: Truck },
  ],
  Manager: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Approvals", path: "/approvals", icon: ClipboardCheck },
    { label: "Evaluations", path: "/evaluations", icon: BrainCircuit },
    { label: "Purchase Orders", path: "/purchase-orders", icon: PackageCheck },
    { label: "Reports", path: "/reports", icon: Activity },
  ],
  Vendor: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", path: "/vendor/orders", icon: PackageCheck },
    { label: "Shipments", path: "/vendor/shipments", icon: Truck },
    { label: "My Profile", path: "/vendor/profile", icon: Users },
  ],
  Admin: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "User Management", path: "/admin/users", icon: Users },
    { label: "Role Requests", path: "/admin/role-requests", icon: ShieldCheck },
    { label: "Vendor Accounts", path: "/admin/vendors", icon: Building2 },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ],
};

export default function Sidebar({
  role = "Employee",
  collapsed = false,
  onToggle,
}) {
  const navigation = navigationByRole[role] ?? navigationByRole.Employee;

  const linkClasses = ({ isActive }) =>
    `flex min-h-12 items-center gap-3 rounded-lg px-3.5 text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "bg-brand-600 text-white shadow-sm"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside
      className={`flex h-dvh min-h-0 flex-col overflow-hidden bg-navy-900 text-white transition-[width] duration-200 ${
        collapsed ? "w-[76px]" : "w-[272px]"
      }`}
    >
      <div
        className={`flex min-h-[76px] shrink-0 items-center gap-3 px-5 ${
          collapsed ? "justify-center px-2" : ""
        }`}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
          <PackageCheck size={23} />
        </span>

        {!collapsed && (
          <span className="whitespace-nowrap text-lg font-bold tracking-tight">
            SmartProcure
          </span>
        )}
      </div>

      <div
        className={`mx-4 border-b border-white/10 py-5 ${
          collapsed ? "mx-2 flex justify-center" : ""
        }`}
      >
        {!collapsed ? (
          <div className="flex flex-col gap-2 px-3">
            <span className="text-[10px] font-bold tracking-[0.16em] text-slate-400">
              WORKSPACE
            </span>
            <span className="text-sm font-semibold">{role} Portal</span>
          </div>
        ) : (
          <span
            className="size-2 rounded-full bg-brand-500"
            title={`${role} Portal`}
          />
        )}
      </div>

          <nav
          className="min-h-0 flex-1 overflow-y-auto px-4 py-6"
          aria-label="Main navigation"
>
        {!collapsed && (
          <span className="mb-4 block px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">
            MENU
          </span>
        )}

        <div className="flex flex-col gap-1.5">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              title={collapsed ? label : undefined}
              aria-label={collapsed ? label : undefined}
              className={(state) =>
                `${linkClasses(state)} ${
                  collapsed ? "justify-center px-0" : ""
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <NavLink
            to="/notifications"
            title={collapsed ? "Notifications" : undefined}
            aria-label={collapsed ? "Notifications" : undefined}
            className={(state) =>
              `${linkClasses(state)} ${
                collapsed ? "justify-center px-0" : ""
              }`
            }
          >
            <BellRing size={19} strokeWidth={1.8} className="shrink-0" />
            {!collapsed && <span>Notifications</span>}
          </NavLink>
        </div>
      </nav>

     <div className={`mt-auto shrink-0 border-t border-white/10 bg-navy-900 p-3 ${collapsed ? "px-2" : ""}`}>

        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : undefined}
          className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white ${
            collapsed ? "px-0" : "px-3"
          }`}
        >
          {collapsed ? (
            <ChevronRight size={17} />
          ) : (
            <>
              <ChevronLeft size={17} />
              <span>Collapse sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
