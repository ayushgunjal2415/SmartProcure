import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FilePlus2,
  Package,
  Users,
} from "lucide-react";

import { getRequests } from "../services/mock/requestService.js";
import { getVendors } from "../services/mock/vendorService.js";
import {
  createRfq,
  getRfqs,
} from "../services/mock/rfqService.js";

const today = new Date().toISOString().slice(0, 10);

export default function CreateRFQ() {
  const navigate = useNavigate();
  const requests = getRequests();
  const vendors = getVendors();

  const existingRfqs = getRfqs();

  const approvedRequests = useMemo(
    () =>
    requests.filter(
      (request) =>
        request.status === "Approved" &&
        !existingRfqs.some((rfq) => rfq.requestId === request.id)
    ),
  [requests, existingRfqs]
);

  const activeVendors = vendors.filter(
    (vendor) => vendor.status === "Active"
  );

  const [form, setForm] = useState({
    requestId: "",
    title: "",
    category: "",
    quantity: "",
    budget: "",
    deliveryDate: "",
    deadline: "",
    invitedVendorIds: [],
    description: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleRequestChange(requestId) {
    const request = approvedRequests.find(
      (item) => item.id === requestId
    );

    setForm((current) => ({
      ...current,
      requestId,
      title: request?.itemName || "",
      category: request?.category || "",
      quantity: request?.quantity ?? "",
      budget: request?.estimatedAmount ?? "",
      description:
        request?.specifications || request?.justification || "",
    }));

    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleVendorChange(vendorId) {
    setForm((current) => ({
      ...current,
      invitedVendorIds: current.invitedVendorIds.includes(vendorId)
        ? current.invitedVendorIds.filter((id) => id !== vendorId)
        : [...current.invitedVendorIds, vendorId],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.requestId) {
      setError("Please select an approved purchase request.");
      return;
    }

    if (!form.invitedVendorIds.length) {
      setError("Please select at least one active vendor.");
      return;
    }

    if (!form.deadline || form.deadline < today) {
      setError(
        "The quotation deadline must be today or a future date."
      );
      return;
    }

    if (!form.deliveryDate || form.deliveryDate < form.deadline) {
      setError(
        "The delivery date must be on or after the quotation deadline."
      );
      return;
    }

    setSaving(true);

    const result = createRfq({
      ...form,
      status: "Draft",
    });

    setSaving(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/rfqs");
  }

  const inputClass =
    "mt-1.5 min-h-11 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  const labelClass = "text-sm font-medium text-text-primary";

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          to="/rfqs"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-brand-700"
        >
          <ArrowLeft size={16} />
          Back to RFQs
        </Link>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Procurement Workspace / Vendors & RFQs
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
          Create RFQ
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          Create a quotation request from an approved purchase request
          and invite eligible vendors.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Package size={20} />
            </div>

            <div>
              <h2 className="font-bold text-text-primary">
                Purchase request
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Select an approved request to prefill the RFQ details.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="requestId" className={labelClass}>
              Approved purchase request *
            </label>

            <select
              id="requestId"
              name="requestId"
              value={form.requestId}
              onChange={(event) =>
                handleRequestChange(event.target.value)
              }
              required
              className={inputClass}
            >
              <option value="">Select an approved request</option>

              {approvedRequests.map((request) => (
                <option key={request.id} value={request.id}>
                  {request.id} — {request.itemName}
                </option>
              ))}
            </select>

            {approvedRequests.length === 0 && (
              <p className="mt-2 text-sm text-amber-700">
                No approved requests are available. Approve a purchase
                request before creating an RFQ.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <FilePlus2 size={20} />
            </div>

            <div>
              <h2 className="font-bold text-text-primary">
                RFQ details
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Verify the request details and enter the quotation schedule.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className={labelClass}>
                RFQ title *
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={120}
                className={inputClass}
                placeholder="Enter RFQ title"
              />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Category *
              </label>
              <input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Procurement category"
              />
            </div>

            <div>
              <label htmlFor="quantity" className={labelClass}>
                Quantity *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="budget" className={labelClass}>
                Estimated budget (₹) *
              </label>
              <input
                id="budget"
                name="budget"
                type="number"
                min="1"
                step="0.01"
                value={form.budget}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="deadline" className={labelClass}>
                Quotation deadline *
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                min={today}
                value={form.deadline}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="deliveryDate" className={labelClass}>
                Required delivery date *
              </label>
              <input
                id="deliveryDate"
                name="deliveryDate"
                type="date"
                min={form.deadline || today}
                value={form.deliveryDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Requirements and specifications *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                required
                maxLength={2000}
                className={`${inputClass} resize-y`}
                placeholder="Describe the items, specifications, and requirements..."
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Users size={20} />
            </div>

            <div>
              <h2 className="font-bold text-text-primary">
                Invite vendors
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Choose one or more active vendors to receive this RFQ.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {activeVendors.map((vendor) => (
              <label
                key={vendor.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={form.invitedVendorIds.includes(vendor.id)}
                  onChange={() => handleVendorChange(vendor.id)}
                  className="mt-1 size-4 accent-blue-600"
                />

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-text-primary">
                    {vendor.name}
                  </span>
                  <span className="mt-1 block text-xs text-text-secondary">
                    {vendor.id}
                  </span>
                </span>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Active
                </span>
              </label>
            ))}

            {activeVendors.length === 0 && (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-text-secondary">
                No active vendors are available to invite.
              </p>
            )}
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/rfqs"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              saving ||
              approvedRequests.length === 0 ||
              activeVendors.length === 0
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CalendarDays size={17} />
            {saving ? "Creating..." : "Create RFQ"}
          </button>
        </div>
      </form>
    </section>
  );
}