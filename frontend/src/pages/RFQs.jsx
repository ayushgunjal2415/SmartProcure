import { getQuotationsForRfq } from "../services/mock/quotationService.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  FilePlus2,
  FileText,
  Search,
  Users,
} from "lucide-react";
import { getRfqs, updateRfqStatus } from "../services/mock/rfqService.js";
import { getVendors } from "../services/mock/vendorService.js";

const statusStyles = {
  Draft: "bg-slate-100 text-slate-700",
  Open: "bg-emerald-50 text-emerald-700",
  Closed: "bg-amber-50 text-amber-700",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getRfqVendorCounts(rfq) {
  const quotations = getQuotationsForRfq(rfq.id);

  const vendorIds = new Set([
    ...(rfq.invitedVendorIds || []),
    ...quotations.map((quotation) => quotation.vendorId).filter(Boolean),
  ]);

  return {
    invitedCount: vendorIds.size,
    receivedCount: quotations.length,
  };
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RFQs() {
  const [rfqs, setRfqs] = useState(getRfqs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    function refreshRfqs() {
      setRfqs(getRfqs());
    }

    window.addEventListener("focus", refreshRfqs);

    return () => window.removeEventListener("focus", refreshRfqs);
  }, []);

  const vendors = getVendors();
  const activeVendors = vendors.filter((vendor) => vendor.status === "Active");

  const filteredRfqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rfqs.filter((rfq) => {
      const matchesSearch =
        !query ||
        [rfq.id, rfq.title, rfq.category, rfq.requestId]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || rfq.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rfqs, search, statusFilter]);

  const counts = {
    total: rfqs.length,
    open: rfqs.filter((rfq) => rfq.status === "Open").length,
    draft: rfqs.filter((rfq) => rfq.status === "Draft").length,
    closed: rfqs.filter((rfq) => rfq.status === "Closed").length,
  };

  function handleStatusChange(rfqId, nextStatus) {
    setNotice("");
    setError("");

    const result = updateRfqStatus(rfqId, nextStatus);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setRfqs(getRfqs());
    setNotice(`${rfqId} status updated to ${nextStatus}.`);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Procurement Workspace / Vendors & RFQs
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
            RFQ Management
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Create and track quotation requests sent to eligible vendors.
          </p>
        </div>

        <Link
          to="/rfqs/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <FilePlus2 size={17} />
          Create RFQ
        </Link>
      </div>

      {notice && (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total RFQs", value: counts.total, icon: ClipboardList, color: "bg-blue-50 text-blue-600" },
          { label: "Open RFQs", value: counts.open, icon: FileText, color: "bg-emerald-50 text-emerald-600" },
          { label: "Drafts", value: counts.draft, icon: FilePlus2, color: "bg-violet-50 text-violet-600" },
          { label: "Active Vendors", value: activeVendors.length, icon: Users, color: "bg-amber-50 text-amber-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-text-secondary">{label}</span>
              <span className={`flex size-10 items-center justify-center rounded-xl ${color}`}>
                <Icon size={19} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tabular-nums text-text-primary">
              {String(value).padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-text-primary">Request for Quotation</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {filteredRfqs.length} RFQ(s) found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search RFQs..."
                aria-label="Search RFQs"
                className="min-h-11 w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter RFQs by status"
              className="min-h-11 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-brand-500"
            >
              <option value="All">All statuses</option>
              <option value="Draft">Draft</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-text-secondary">
  <tr>
    <th className="px-5 py-4 font-semibold">RFQ / Requirement</th>
    <th className="px-5 py-4 font-semibold">Linked Request</th>
    <th className="px-5 py-4 font-semibold">Budget</th>
    <th className="px-5 py-4 font-semibold">Deadline</th>
    <th className="px-5 py-4 font-semibold">Vendors</th>
    <th className="px-5 py-4 font-semibold">Quotation Responses</th>
    <th className="px-5 py-4 font-semibold">Status</th>
    <th className="px-5 py-4 font-semibold">Actions</th>
  </tr>
</thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRfqs.map((rfq) => (
                <tr key={rfq.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-text-primary">{rfq.title}</p>
                    <p className="mt-1 text-xs text-text-secondary">{rfq.id} · {rfq.category}</p>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">{rfq.requestId || "Standalone RFQ"}</td>
                  <td className="px-5 py-4 font-medium text-text-primary">{formatCurrency(rfq.budget)}</td>
                  <td className="px-5 py-4 text-text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={15} />
                      {formatDate(rfq.deadline)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-text-secondary">
  {getRfqVendorCounts(rfq).invitedCount} invited
</td>

<td className="px-5 py-4">
  <span className="font-semibold text-text-primary">
    {getRfqVendorCounts(rfq).receivedCount} of{" "}
    {getRfqVendorCounts(rfq).invitedCount} received
  </span>
</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[rfq.status] || statusStyles.Draft}`}>
                      {rfq.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <Link
  to={`/quotations?rfqId=${encodeURIComponent(rfq.id)}`}
  className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
>
  View Quotations
</Link>
                      {rfq.status === "Draft" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(rfq.id, "Open")}
                          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:bg-slate-50"
                        >
                          Open RFQ
                        </button>
                      )}
                      {rfq.status === "Open" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(rfq.id, "Closed")}
                          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:bg-slate-50"
                        >
                          Close RFQ
                        </button>
                      )}
                      
{rfq.status === "Closed" && (
  <button
    type="button"
    onClick={() => handleStatusChange(rfq.id, "Open")}
    className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
  >
    Reopen RFQ
  </button>
)}

                    </div>
                  </td>
                </tr>
              ))}

              {filteredRfqs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <ClipboardList size={28} className="mx-auto text-slate-400" />
                    <p className="mt-3 font-semibold text-text-primary">No RFQs found</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Try another search or create a new RFQ.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
