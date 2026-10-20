import { useDemoAuth } from "../context/DemoAuthContext.jsx";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRequests } from "../services/mock/requestService.js";
import {
  Search,
  Plus,
  Eye,
  FileText,
  Clock3,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

const sampleRequests = [
  {
    id: "PR-2026-0142",
    item: "Workstation equipment",
    date: "14 Oct 2026",
    amount: 85000,
    status: "In Progress",
  },
  {
    id: "PR-2026-0139",
    item: "Office networking supplies",
    date: "12 Oct 2026",
    amount: 32500,
    status: "Pending",
  },
  {
    id: "PR-2026-0134",
    item: "Safety equipment",
    date: "10 Oct 2026",
    amount: 18200,
    status: "Approved",
  },
  {
    id: "PR-2026-0128",
    item: "Printer cartridges",
    date: "08 Oct 2026",
    amount: 9600,
    status: "Rejected",
  },
  {
    id: "PR-2026-0121",
    item: "Office furniture",
    date: "05 Oct 2026",
    amount: 42000,
    status: "Revision Required",
  },
];

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
  "Revision Required": "bg-violet-50 text-violet-700",
};

const summaryCards = [
  {
    label: "Total Requests",
    icon: FileText,
    value: (requests) => requests.length,
    iconStyle: "bg-brand-50 text-brand-600",
  },
  {
    label: "Pending",
    icon: Clock3,
    value: (requests) =>
      requests.filter((r) => r.status === "Pending").length,
    iconStyle: "bg-amber-50 text-amber-600",
  },
  {
    label: "Approved",
    icon: CheckCircle2,
    value: (requests) =>
      requests.filter((r) => r.status === "Approved").length,
    iconStyle: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Needs Attention",
    icon: CircleAlert,
    value: (requests) =>
      requests.filter((r) =>
        ["Rejected", "Revision Required"].includes(r.status)
      ).length,
    iconStyle: "bg-red-50 text-red-600",
  },
];

function getSubmittedRequests() {
  return getRequests().map((request) => ({
    ...request,
    item: request.itemName || request.item || "Untitled request",
    date: request.createdAt
      ? new Date(request.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : request.date || "—",
    amount: Number(
      request.estimatedAmount ?? request.amount ?? 0
    ),
    status: request.status || "Pending",
  }));
}

export default function Requests() {
  const { role } = useDemoAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const allRequests = useMemo(() => {
    const submittedRequests = getSubmittedRequests();
    const submittedIds = new Set(
      submittedRequests.map((request) => request.id)
    );

    return [
      ...submittedRequests,
      ...sampleRequests.filter(
        (request) => !submittedIds.has(request.id)
      ),
    ];
  }, []);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allRequests.filter((request) => {
      const matchesSearch =
        request.id.toLowerCase().includes(query) ||
        request.item.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || request.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [allRequests, search, status]);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  function handleViewRequest(request) {
  navigate(`/requests/${encodeURIComponent(request.id)}`);
}

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-text-secondary">
            PROCUREMENT WORKSPACE
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
  {role === "Officer" ? "Procurement Requests" : "My Requests"}
</h1>

<p className="mt-2 max-w-lg text-sm leading-6 text-text-secondary">
  {role === "Officer"
    ? "Review employee requests and manage procurement approvals."
    : "View and track your procurement requests in one place."}
</p>
        </div>

        {role === "Employee" && (
  <Link
    to="/requests/new"
    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:self-center"
  >
    <Plus size={17} />
    Create Request
  </Link>
)}
      </div>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Request summary"
      >
        {summaryCards.map(({ label, icon: Icon, value, iconStyle }) => (
          <article
            key={label}
            className="flex min-h-24 items-center gap-3 rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5"
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
            >
              <Icon size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-secondary">
                {label}
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
                {value(allRequests)}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              All Requests
            </h2>
            <p className="mt-1.5 text-sm text-text-secondary">
              Search and filter your submitted requests.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3 text-slate-400 transition-colors focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 sm:min-w-[230px] lg:w-[260px]">
              <Search size={18} className="shrink-0" />
              <input
                type="search"
                placeholder="Search by ID or item..."
                aria-label="Search requests by ID or item"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-slate-400"
              />
            </label>

            <select
              aria-label="Filter requests by status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 min-w-0 rounded-lg border border-border bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:w-[185px]"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Revision Required">Revision Required</option>
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500 sm:px-6">
                  Request ID
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">
                  Item / Requirement
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">
                  Submitted
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">
                  Estimated Amount
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                  >
                    <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                      <strong className="text-xs font-semibold text-text-primary">
                        {request.id}
                      </strong>
                    </td>
                    <td className="px-5 py-4 text-xs text-text-secondary">
                      {request.item}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-text-secondary">
                      {request.date}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-text-primary">
                      {formatAmount(request.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${
                          statusStyles[request.status] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        className="request-view-button"
                        aria-label={`View ${request.id}`}
                        onClick={() => handleViewRequest(request)}
                      >
                        <Eye size={12} strokeWidth={1.8} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-text-secondary"
                  >
                    No requests match your search or selected status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>
            Showing {filteredRequests.length} of {allRequests.length} requests
          </span>
          <span>All amounts in INR (₹)</span>
        </div>
      </section>
    </section>
  );
}
