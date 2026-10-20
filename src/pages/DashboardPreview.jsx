import {
  ArrowUpRight,
  ClipboardList,
  Clock3,
  PackageCheck,
  Plus,
  Users,
  Building2,
  FileSearch,
  ShoppingCart,
  Eye,
} from "lucide-react";

import { useDemoAuth } from "../context/DemoAuthContext.jsx";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getRequests } from "../services/mock/requestService.js";
import { getRfqs } from "../services/mock/rfqService.js";
import { getQuotations } from "../services/mock/quotationService.js";


const sampleRequests = [
  {
    id: "PR-2026-0142",
    itemName: "Workstation equipment",
    createdAt: "2026-10-14T09:00:00",
    estimatedAmount: 85000,
    status: "In Progress",
  },
  {
    id: "PR-2026-0139",
    itemName: "Office networking supplies",
    createdAt: "2026-10-12T09:00:00",
    estimatedAmount: 32500,
    status: "Pending",
  },
  {
    id: "PR-2026-0134",
    itemName: "Safety equipment",
    createdAt: "2026-10-10T09:00:00",
    estimatedAmount: 18200,
    status: "Approved",
  },
  {
    id: "PR-2026-0128",
    itemName: "Printer cartridges",
    createdAt: "2026-10-08T09:00:00",
    estimatedAmount: 9600,
    status: "Rejected",
  },
  {
    id: "PR-2026-0121",
    itemName: "Office furniture",
    createdAt: "2026-10-05T09:00:00",
    estimatedAmount: 42000,
    status: "Revision Required",
  },
];


const metricTones = {
  blue: "bg-brand-50 text-brand-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
};

const statusTones = {
  "In Progress": "bg-blue-50 text-blue-700",
  Pending: "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
  "Revision Required": "bg-violet-50 text-violet-700",
};

function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPreview() {
  const { role } = useDemoAuth();
  const requests = useMemo(() => {
    const savedRequests = getRequests();
    const savedIds = new Set(savedRequests.map((request) => request.id));

    const combined = [
      ...savedRequests,
      ...sampleRequests.filter((request) => !savedIds.has(request.id)),
    ];

    return combined
      .map((request) => ({
        ...request,
        title: request.itemName || request.title || "Untitled request",
        date: formatDate(request.createdAt || request.date),
        amount: formatAmount(
          request.estimatedAmount ?? request.amount
        ),
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  }, []);

  const metrics = [
    {
      label: "My Requests",
      value: String(requests.length).padStart(2, "0"),
      detail: "Requests submitted",
      icon: ClipboardList,
      tone: "blue",
    },
    {
      label: "Pending",
      value: String(
        requests.filter((request) => request.status === "Pending").length
      ).padStart(2, "0"),
      detail: "Awaiting processing",
      icon: Clock3,
      tone: "amber",
    },
    {
      label: "In Progress",
      value: String(
        requests.filter((request) => request.status === "In Progress").length
      ).padStart(2, "0"),
      detail: "Currently being processed",
      icon: PackageCheck,
      tone: "violet",
    },
  ];

  const totalRequestCount = requests.length;
  const recentRequests = requests.slice(0, 3);

  if (role === "Officer") {
  const officerMetrics = [
    {
      label: "Requests to Process",
      value: requests.filter((r) => r.status === "Pending").length,
      detail: "Awaiting procurement review",
      icon: ClipboardList,
      tone: "blue",
    },
    {
  label: "Active RFQs",
  value: getRfqs().filter((rfq) => rfq.status === "Open").length,
  detail: "Open quotation requests",
  icon: FileSearch,
  tone: "amber",
},
    {
  label: "Quotations to Evaluate",
  value: getQuotations().filter(
    (quotation) => quotation.status === "Submitted"
  ).length,
  detail: "Awaiting comparison",
  icon: Building2,
  tone: "violet",
},
    {
  label: "Active Purchase Orders",
  value: 0,
  detail: "Orders being processed",
  icon: ShoppingCart,
  tone: "blue",
},
  ];

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 text-xs font-medium text-text-secondary">
            Workspace / Officer Dashboard
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Good morning, Officer
          </h1>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Monitor procurement operations, requests, quotations and orders.
          </p>
        </div>

        <Link
          to="/vendors"
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Building2 size={17} />
           Manage Vendors
        </Link>
      </div>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Procurement operations summary"
      >
        {officerMetrics.map(({ label, value, detail, icon: Icon, tone }) => (
          <article
            key={label}
            className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-text-secondary">
                {label}
              </span>
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${metricTones[tone]}`}
              >
                <Icon size={19} />
              </span>
            </div>
            <div className="mt-5 text-3xl font-bold tracking-tight text-text-primary">
              {String(value).padStart(2, "0")}
            </div>
            <div className="mt-2 text-xs text-text-secondary">{detail}</div>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-text-primary">
          Procurement work queue
        </h2>
        <p className="mt-1.5 text-sm text-text-secondary">
          Review requests waiting for procurement processing.
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Request
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Estimated cost
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {requests
                .filter((request) => request.status === "Pending")
                .slice(0, 5)
                .map((request) => (
                  <tr key={request.id} className="border-t border-slate-100">
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-text-primary">
                        {request.title}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary">
                        {request.id}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-text-primary">
                      {request.amount}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
  to={`/requests/${encodeURIComponent(request.id)}`}
  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary transition-colors hover:bg-slate-50"
>
  <Eye size={12} strokeWidth={1.8} />
  Review
</Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
          <Link
            to="/vendors"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-slate-50"
          >
            <Users size={17} />
            Vendors &amp; RFQs
          </Link>
          <Link
            to="/evaluations"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-slate-50"
          >
            <FileSearch size={17} />
            Quotation evaluations
          </Link>
          <Link
            to="/purchase-orders"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-slate-50"
          >
            <ShoppingCart size={17} />
            Purchase orders
          </Link>
        </div>
      </section>
    </div>
  );
}

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 text-xs font-medium text-text-secondary">
            Workspace / Dashboard
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Good morning, Employee
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Here's an overview of your procurement activities.
          </p>
        </div>

        <Link
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:self-center"
          to="/requests/new"
        >
          <Plus size={17} />
          New request
        </Link>
      </div>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Request summary"
      >
        {metrics.map(({ label, value, detail, icon: Icon, tone }) => (
          <article
            className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
            key={label}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-text-secondary">
                {label}
              </span>

              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${metricTones[tone]}`}
              >
                <Icon size={19} />
              </span>
            </div>

            <div className="mt-5 text-3xl font-bold tracking-tight text-text-primary">
              {value}
            </div>

            <div className="mt-2 text-xs text-text-secondary">{detail}</div>
          </article>
        ))}
      </section>

      <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Recent requests
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-text-secondary">
              Track the latest updates on your submissions.
            </p>
          </div>

          <Link
            className="inline-flex items-center gap-1 self-start text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 sm:self-center"
            to="/requests"
          >
            View all
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500 sm:px-6">
                  Request
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">
                  Submitted
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">
                  Estimated cost
                </th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <strong className="block text-xs font-semibold text-text-primary">
                        {request.title}
                      </strong>

                      <span className="mt-1.5 block text-xs text-text-secondary">
                        {request.id}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-text-secondary">
                      {request.date}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs font-semibold text-text-primary">
                      {request.amount}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${
                          statusTones[request.status] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-text-secondary"
                  >
                    No requests have been submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
