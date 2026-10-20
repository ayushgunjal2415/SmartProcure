import { syncApprovedRegistration } from "../services/mock/vendorService.js";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  RotateCcw,
  X,
} from "lucide-react";

const STORAGE_KEY = "smartprocure_vendor_registrations";

const initialRegistrations = [
  {
    id: "REG-2026-001",
    companyName: "NextGen IT Solutions",
    contactPerson: "Rohan Mehta",
    email: "rohan@nextgen.example",
    phone: "9876501201",
    category: "IT Equipment",
    city: "Pune",
    submittedAt: "2026-10-15",
    status: "Pending",
    notes: "Registration submitted for IT equipment procurement opportunities.",
    documents: [
      { name: "Business registration proof", status: "Submitted" },
      { name: "Tax registration details", status: "Submitted" },
      { name: "Company profile", status: "Missing" },
    ],
  },
  {
    id: "REG-2026-002",
    companyName: "Prime Industrial Supplies",
    contactPerson: "Sneha Joshi",
    email: "sneha@primeindustrial.example",
    phone: "9876501202",
    category: "Safety Equipment",
    city: "Mumbai",
    submittedAt: "2026-10-16",
    status: "Pending",
    notes: "Supplier registration for industrial and workplace safety products.",
    documents: [
      { name: "Business registration proof", status: "Submitted" },
      { name: "Tax registration details", status: "Submitted" },
      { name: "Company profile", status: "Submitted" },
    ],
  },
  {
    id: "REG-2026-003",
    companyName: "Modern Office Systems",
    contactPerson: "Karan Shah",
    email: "karan@modernoffice.example",
    phone: "9876501203",
    category: "Office Supplies",
    city: "Nashik",
    submittedAt: "2026-10-17",
    status: "Pending",
    notes: "Registration for office supplies and workplace consumables.",
    documents: [
      { name: "Business registration proof", status: "Submitted" },
      { name: "Tax registration details", status: "Missing" },
      { name: "Company profile", status: "Submitted" },
    ],
  },
];

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
  "Revision Required": "bg-violet-50 text-violet-700",
};

function readRegistrations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Fall back to the demonstration registrations.
  }

  return initialRegistrations;
}

function saveRegistrations(registrations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    return true;
  } catch {
    return false;
  }
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function VendorRegistrations() {
  const [registrations, setRegistrations] = useState(readRegistrations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState("Approved");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return registrations.filter((registration) => {
      const matchesSearch = [
        registration.id,
        registration.companyName,
        registration.contactPerson,
        registration.email,
        registration.category,
        registration.city,
      ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || registration.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter]);

  const pendingCount = registrations.filter(
    (registration) => registration.status === "Pending"
  ).length;

  const revisionCount = registrations.filter(
    (registration) => registration.status === "Revision Required"
  ).length;

  const approvedCount = registrations.filter(
    (registration) => registration.status === "Approved"
  ).length;

  function openReview(registration) {
    setSelected(registration);
    setDecision("Approved");
    setReason("");
    setError("");
    setNotice("");
  }

  


function handleDecision(event) {
  event.preventDefault();
  if (!selected) return;

  setError("");
  setNotice("");

  if (decision !== "Approved" && !reason.trim()) {
    setError("Enter a reason for rejection or revision.");
    return;
  }

  if (
    decision === "Approved" &&
    selected.documents.some((document) => document.status !== "Submitted")
  ) {
    setError(
      "Cannot approve this registration until all required documents are submitted."
    );
    return;
  }

  const updatedRegistrations = registrations.map((registration) =>
    registration.id === selected.id
      ? {
          ...registration,
          status: decision,
          reviewReason: reason.trim(),
          reviewedAt: new Date().toISOString(),
        }
      : registration
  );

  // Synchronize the vendor directory through the shared service.
  if (decision === "Approved") {
    const result = syncApprovedRegistration(selected);

    if (!result.success) {
      setError(result.message || "Unable to update the vendor directory.");
      return;
    }
  }

  if (!saveRegistrations(updatedRegistrations)) {
    setError("Unable to save the review decision. Please try again.");
    return;
  }

  setRegistrations(updatedRegistrations);
  setStatusFilter("All");
  setNotice(
    decision === "Approved"
      ? `${selected.companyName} approved and added to Vendor Management.`
      : `${selected.companyName}: registration marked ${decision}.`
  );
  setSelected(null);
}




  return (
    <section className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
      <div>
        <Link
          to="/vendors"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-brand-600"
        >
          <ArrowLeft size={16} />
          Back to Vendor Management
        </Link>

        <div className="mt-5">
          <p className="text-xs font-medium tracking-wide text-text-secondary">
            PROCUREMENT WORKSPACE / VENDOR VERIFICATION
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Vendor Registration Review
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Verify submitted vendor information before approving procurement participation.
          </p>
        </div>
      </div>

      {notice && (
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      {error && !selected && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Pending Review",
            value: pendingCount,
            icon: Clock3,
            tone: "bg-amber-50 text-amber-700",
          },
          {
            label: "Approved",
            value: approvedCount,
            icon: CheckCircle2,
            tone: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Revision Required",
            value: revisionCount,
            icon: RotateCcw,
            tone: "bg-violet-50 text-violet-700",
          },
        ].map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-text-secondary">{label}</p>
              <span className={`flex size-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon size={19} />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-text-primary">
              {String(value).padStart(2, "0")}
            </p>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-text-primary">
              Registration Applications
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {filteredRegistrations.length} application(s) found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:min-w-64">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search registrations..."
                aria-label="Search registrations"
                className="w-full rounded-lg border border-border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by registration status"
              className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            >
              <option value="Pending">Pending</option>
              <option value="Revision Required">Revision Required</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="All">All statuses</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50">
              <tr>
                {["Registration", "Company", "Category", "Submitted", "Status", "Action"].map((heading) => (
                  <th key={heading} className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-5 py-4 text-xs font-semibold text-text-primary">
                    {registration.id}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-text-primary">
                      {registration.companyName}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {registration.contactPerson}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {registration.category}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-text-secondary">
                    {formatDate(registration.submittedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${statusStyles[registration.status] || "bg-slate-100 text-slate-600"}`}>
                      {registration.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
  type="button"
  onClick={() => openReview(registration)}
  aria-label={`Review ${registration.companyName}`}
  className="request-view-button inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:bg-slate-50"
>
  <Eye size={12} strokeWidth={1.8} />
  Review
</button>
                  </td>
                </tr>
              ))}

              {filteredRegistrations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Building2 size={28} className="mx-auto text-slate-400" />
                    <p className="mt-3 text-sm font-semibold text-text-primary">
                      No registrations found
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Try another search or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/40 p-4 pt-8 sm:items-center sm:pt-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-review-title"
            className="my-auto w-full max-w-2xl rounded-xl border border-border bg-white shadow-xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:px-6">
              <div className="flex items-start gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Building2 size={22} />
                </span>
                <div>
                  <h2 id="registration-review-title" className="font-bold text-text-primary">
                    {selected.companyName}
                  </h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    {selected.id} · Submitted {formatDate(selected.submittedAt)}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close review" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["Contact person", selected.contactPerson],
                  ["Business email", selected.email],
                  ["Phone", selected.phone],
                  ["Category", selected.category],
                  ["City", selected.city],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-text-secondary">{label}</p>
                    <p className="mt-1 break-words text-sm font-medium text-text-primary">
                      {value || "Not provided"}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Document checklist
                </h3>
                <div className="mt-3 space-y-2">
                  {selected.documents.map((document) => (
                    <div key={document.name} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
                      <span className="text-sm text-text-primary">{document.name}</span>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${document.status === "Submitted" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {document.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Registration notes
                </h3>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  {selected.notes || "No notes provided."}
                </p>
              </div>

              <form onSubmit={handleDecision} className="space-y-4 border-t border-slate-100 pt-5">
                <div>
                  <label htmlFor="registration-decision" className="text-sm font-semibold text-text-primary">
                    Review decision
                  </label>
                  <select
                    id="registration-decision"
                    value={decision}
                    onChange={(event) => setDecision(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                  >
                    <option value="Approved">Approve registration</option>
                    <option value="Revision Required">Request revision</option>
                    <option value="Rejected">Reject registration</option>
                  </select>
                </div>

                {decision !== "Approved" && (
                  <div>
                    <label htmlFor="registration-reason" className="text-sm font-semibold text-text-primary">
                      Reason / feedback *
                    </label>
                    <textarea
                      id="registration-reason"
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      required
                      rows={3}
                      maxLength={1000}
                      placeholder="Explain what needs correction or why the registration is rejected."
                      className="mt-2 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-brand-500"
                    />
                  </div>
                )}

                {error && (
                  <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => setSelected(null)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-slate-50">
                    Cancel
                  </button>
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
                    <CheckCircle2 size={16} />
                    Save Review Decision
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
