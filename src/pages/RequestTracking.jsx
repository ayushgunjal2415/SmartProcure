
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileText,
  ArrowRight,
  PackageCheck,
} from "lucide-react";
import { getRequests } from "../services/mock/requestService.js";

const sampleRequests = [
  {
    id: "PR-2026-0142",
    itemName: "Workstation equipment",
    status: "In Progress",
    createdAt: "2026-10-14",
  },
  {
    id: "PR-2026-0139",
    itemName: "Office networking supplies",
    status: "Pending",
    createdAt: "2026-10-12",
  },
  {
    id: "PR-2026-0134",
    itemName: "Safety equipment",
    status: "Approved",
    createdAt: "2026-10-10",
  },
  {
    id: "PR-2026-0128",
    itemName: "Printer cartridges",
    status: "Rejected",
    createdAt: "2026-10-08",
  },
  {
    id: "PR-2026-0121",
    itemName: "Office furniture",
    status: "Revision Required",
    createdAt: "2026-10-05",
  },
];

const statusConfig = {
  Pending: {
    icon: Clock3,
    badge: "bg-amber-50 text-amber-700",
    description: "Waiting for procurement review.",
  },
  "In Progress": {
    icon: RefreshCw,
    badge: "bg-blue-50 text-blue-700",
    description: "The procurement team is processing this request.",
  },
  Approved: {
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-700",
    description: "The request has been approved.",
  },
  Rejected: {
    icon: XCircle,
    badge: "bg-red-50 text-red-700",
    description: "The request was rejected.",
  },
  "Revision Required": {
    icon: RefreshCw,
    badge: "bg-violet-50 text-violet-700",
    description: "Changes are required before processing can continue.",
  },
};

const stages = [
  "Request Submitted",
  "Procurement Review",
  "Manager Approval",
  "Purchase Order",
];

function getStageIndex(status) {
  if (status === "Pending") return 0;
  if (status === "In Progress") return 1;
  if (status === "Approved") return 2;
  if (status === "Rejected" || status === "Revision Required") return 1;
  return 0;
}

export default function RequestTracking() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const requests = useMemo(() => {
    const saved = getRequests();
    const savedIds = new Set(saved.map((request) => request.id));

    return [
      ...saved,
      ...sampleRequests.filter((request) => !savedIds.has(request.id)),
    ].map((request) => ({
      ...request,
      itemName: request.itemName || request.item || "Untitled request",
      status: request.status || "Pending",
    }));
  }, []);

  const filteredRequests = requests.filter((request) => {
    const query = search.trim().toLowerCase();

    return (
      request.id.toLowerCase().includes(query) ||
      request.itemName.toLowerCase().includes(query)
    );
  });

  const selectedRequest =
    requests.find((request) => request.id === selectedId) ||
    filteredRequests[0];

  const status = selectedRequest?.status || "Pending";
  const config = statusConfig[status] || statusConfig.Pending;
  const StatusIcon = config.icon;
  const currentStage = getStageIndex(status);
  const isClosed = status === "Rejected" || status === "Revision Required";

  return (
    <section className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-text-secondary">
          PROCUREMENT WORKSPACE / TRACKING
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Request Status Tracking
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Track procurement progress and review the latest status of your requests.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Requests",
            value: requests.length,
            icon: FileText,
            color: "bg-brand-50 text-brand-600",
          },
          {
            label: "Pending",
            value: requests.filter((r) => r.status === "Pending").length,
            icon: Clock3,
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "In Progress",
            value: requests.filter((r) => r.status === "In Progress").length,
            icon: RefreshCw,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "Approved",
            value: requests.filter((r) => r.status === "Approved").length,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-700",
          },
        ].map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-xl border border-border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-text-secondary">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold text-text-primary">
                    {metric.value}
                  </p>
                </div>
                <span className={`flex size-11 items-center justify-center rounded-xl ${metric.color}`}>
                  <Icon size={21} />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-text-primary">My Requests</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Select a request to view its progress.
            </p>

            <div className="relative mt-4">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by request ID or item..."
                className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-sm text-text-secondary">
                No requests match your search.
              </div>
            ) : (
              filteredRequests.map((request) => {
                const itemConfig =
                  statusConfig[request.status] || statusConfig.Pending;
                const Icon = itemConfig.icon;
                const isSelected = selectedRequest?.id === request.id;

                return (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => setSelectedId(request.id)}
                    className={`flex w-full items-start gap-3 p-4 text-left transition hover:bg-slate-50 ${
                      isSelected ? "bg-brand-50/70 ring-1 ring-inset ring-brand-100" : ""
                    }`}
                  >
                    <span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${itemConfig.badge}`}>
                      <Icon size={18} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-text-primary">
                        {request.itemName}
                      </span>
                      <span className="mt-1 block text-xs text-text-secondary">
                        {request.id}
                      </span>
                      <span className="mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold">
                        <span className={`rounded-full px-2.5 py-1 ${itemConfig.badge}`}>
                          {request.status}
                        </span>
                      </span>
                    </span>

                    <ArrowRight
                      size={17}
                      className={`mt-2 shrink-0 ${isSelected ? "text-brand-600" : "text-slate-400"}`}
                    />
                  </button>
                );
              })
            )}
          </div>
        </section>

        {selectedRequest ? (
          <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-secondary">
                  REQUEST DETAILS
                </p>
                <h2 className="mt-2 break-words text-xl font-bold text-text-primary">
                  {selectedRequest.itemName}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {selectedRequest.id}
                </p>
              </div>

              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${config.badge}`}>
                <StatusIcon size={15} />
                {status}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-text-secondary">
              {config.description}
            </p>

            <div className="mt-7">
              <h3 className="text-sm font-bold text-text-primary">
                Procurement timeline
              </h3>

              <div className="mt-5 space-y-0">
                {stages.map((stage, index) => {
                  const completed = !isClosed && index < currentStage;
                  const active = !isClosed && index === currentStage;
                  const StageIcon = completed ? CheckCircle2 : active ? Clock3 : PackageCheck;

                  return (
                    <div key={stage} className="flex gap-3">
                      <div className="flex w-6 shrink-0 flex-col items-center">
                        <span
                          className={`flex size-6 items-center justify-center rounded-full ${
                            completed
                              ? "bg-emerald-100 text-emerald-700"
                              : active
                                ? "bg-brand-100 text-brand-700"
                                : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <StageIcon size={14} />
                        </span>
                        {index < stages.length - 1 && (
                          <span
                            className={`my-1 min-h-9 w-0.5 ${
                              completed ? "bg-emerald-300" : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>

                      <div className="pb-5">
                        <p
                          className={`text-sm font-semibold ${
                            completed || active
                              ? "text-text-primary"
                              : "text-text-secondary"
                          }`}
                        >
                          {stage}
                        </p>
                        <p className="mt-1 text-xs text-text-secondary">
                          {completed
                            ? "Completed"
                            : active
                              ? "Current stage"
                              : "Not started"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {isClosed && (
                <div className={`mt-2 rounded-lg p-3 text-sm ${
                  status === "Rejected"
                    ? "bg-red-50 text-red-700"
                    : "bg-violet-50 text-violet-700"
                }`}>
                  {status === "Rejected"
                    ? "This request has been rejected. Contact the procurement team if you need clarification."
                    : "Please review the requested changes before resubmitting."}
                </div>
              )}
            </div>

            <div className="mt-2 border-t border-slate-100 pt-4">
              <Link
                to={`/requests/${encodeURIComponent(selectedRequest.id)}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
              >
                View full request details
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-border bg-white p-8 text-center text-sm text-text-secondary shadow-sm">
            Select a request to see its tracking information.
          </section>
        )}
      </div>
    </section>
  );
}
