
import { useState } from "react";
import { Bell, Check, ChevronDown, Menu, Search } from "lucide-react";
import { useDemoAuth } from "../context/DemoAuthContext.jsx";

export default function Topbar({ onMenuClick }) {
  const { role, switchRole, DEMO_ROLES } = useDemoAuth();
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="relative z-20 flex h-20 shrink-0 items-center justify-between border-b border-border bg-white px-5 sm:px-7 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-600 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        <label className="flex h-10 w-full max-w-[420px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 text-slate-400 transition-colors focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
          <Search size={18} className="shrink-0" />
          <input
            type="search"
            placeholder="Search your workspace..."
            aria-label="Search workspace"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden shrink-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-500 sm:inline-block">
            Ctrl K
          </kbd>
        </label>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-3 sm:gap-5">
        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-lg border border-border bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-brand-600"
          aria-label="Notifications"
          title="Notifications (demo)"
          onClick={() => window.alert("Notifications will be added later.")}
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 size-2 rounded-full border border-white bg-rose-500" />
        </button>

        <div className="h-9 w-px bg-slate-200" />

        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            onClick={() => setProfileOpen((open) => !open)}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-sm font-semibold text-brand-600">
              {role.charAt(0)}
            </span>

            <span className="hidden min-w-0 flex-col gap-0.5 sm:flex">
              <strong className="text-xs font-semibold text-slate-700">
                {role}
              </strong>
              <span className="text-[11px] text-slate-400">
                Demo account
              </span>
            </span>

            <ChevronDown
              size={16}
              className={`text-slate-500 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <>
              <button
                type="button"
                aria-label="Close profile menu"
                className="fixed inset-0 z-30 cursor-default"
                onClick={() => setProfileOpen(false)}
              />

              <div className="absolute right-0 top-full z-40 mt-3 w-60 overflow-hidden rounded-xl border border-border bg-white py-2 shadow-xl">
                <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch demo role
                </p>

                {DEMO_ROLES.map((demoRole) => {
                  const selected = role === demoRole;

                  return (
                    <button
                      type="button"
                      key={demoRole}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        selected
                          ? "bg-brand-50 font-semibold text-brand-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                      onClick={() => {
                        switchRole(demoRole);
                        setProfileOpen(false);
                      }}
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {demoRole.charAt(0)}
                      </span>

                      <span className="flex-1 text-left">{demoRole}</span>

                      {selected && (
                        <Check size={16} className="text-brand-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
