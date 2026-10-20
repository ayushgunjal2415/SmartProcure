import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CheckCircle,
  Clock3,
  FileText,
  Package,
  Wallet,
  Pencil,
  Ban,
  XCircle
} from "lucide-react";

import {
  getRequests,
  updateRequest,
  cancelRequest,
  reviewRequest,
} from "../services/mock/requestService.js";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDemoAuth } from "../context/DemoAuthContext.jsx";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
  "Revision Required": "bg-violet-50 text-violet-700",
};

function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function formatDate(date) {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


export default function RequestDetails() {

  const { requestId } = useParams();
  const navigate = useNavigate();
  const { role } = useDemoAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  
  function handleReview(decision) {
    setReviewError("");

    if (decision !== "Approve" && !reviewComment.trim()) {
      setReviewError(
        "Please enter a reason or comments before continuing."
      );
      return;
    }

    const result = reviewRequest(
      requestId,
      decision,
      reviewComment
    );

    if (!result.success) {
      setReviewError(result.message);
      return;
    }

    window.location.reload();
  }

  const [editForm, setEditForm] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");


 const sampleRequests = [
  {
    id: "PR-2026-0142",
    itemName: "Workstation equipment",
    category: "IT Equipment",
    quantity: 10,
    estimatedAmount: 85000,
    requiredDate: "2026-11-15",
    justification: "Required for employee workstations.",
    specifications: "Standard office workstation equipment.",
    status: "In Progress",
    createdAt: "2026-10-14",
  },
  {
    id: "PR-2026-0139",
    itemName: "Office networking supplies",
    category: "Networking",
    quantity: 5,
    estimatedAmount: 32500,
    requiredDate: "2026-11-10",
    justification: "Required for office network maintenance.",
    specifications: "Networking supplies for office infrastructure.",
    status: "Pending",
    createdAt: "2026-10-12",
  },
  {
    id: "PR-2026-0134",
    itemName: "Safety equipment",
    category: "Safety",
    quantity: 20,
    estimatedAmount: 18200,
    requiredDate: "2026-11-08",
    justification: "Required to maintain workplace safety.",
    specifications: "Standard workplace safety equipment.",
    status: "Approved",
    createdAt: "2026-10-10",
  },
  {
    id: "PR-2026-0128",
    itemName: "Printer cartridges",
    category: "Office Supplies",
    quantity: 12,
    estimatedAmount: 9600,
    requiredDate: "2026-11-05",
    justification: "Required for routine office printing.",
    specifications: "Compatible printer cartridges.",
    status: "Rejected",
    createdAt: "2026-10-08",
  },
  {
    id: "PR-2026-0121",
    itemName: "Office furniture",
    category: "Furniture",
    quantity: 8,
    estimatedAmount: 42000,
    requiredDate: "2026-11-01",
    justification: "Required for office seating and workspace arrangements.",
    specifications: "Standard office furniture.",
    status: "Revision Required",
    createdAt: "2026-10-05",
  },
];

const savedRequests = getRequests();

const request =
  savedRequests.find((item) => item.id === requestId) ||
  sampleRequests.find((item) => item.id === requestId);

  if (!request) {
    return (
      <section className="mx-auto max-w-3xl rounded-xl border border-border bg-white p-8 text-center shadow-sm">
        <FileText size={36} className="mx-auto text-slate-400" />

        <h1 className="mt-4 text-xl font-bold text-text-primary">
          Request not found
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          This request may not exist in your saved procurement records.
        </p>

        <Link
          to="/requests"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <ArrowLeft size={16} />
          Back to My Requests
        </Link>
      </section>
    );
  }

  const status = request.status || "Pending";

  return (
    <section className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-6">
      <div>
        <Link
          to="/requests"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-brand-600"
        >
          <ArrowLeft size={16} />
          Back to My Requests
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-medium tracking-wide text-text-secondary">
              PROCUREMENT WORKSPACE / REQUEST DETAILS
            </p>

            <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {request.itemName || request.item || "Untitled request"}
            </h1>

            <p className="mt-2 text-sm text-text-secondary">
              Request ID: {request.id}
            </p>
          </div>

          
<div className="flex flex-wrap items-center gap-3">
  <span
    className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
      statusStyles[status] || "bg-slate-100 text-slate-700"
    }`}
  >
    <span className="size-2 rounded-full bg-current" />
    {status}
  </span>

  {role === "Employee" && (
  <>
    <button
      type="button"
      onClick={() => {
        setEditForm({
          itemName: request.itemName || request.item || "",
          category: request.category || "IT Equipment",
          quantity: request.quantity ?? 1,
          estimatedAmount: request.estimatedAmount ?? request.amount ?? 0,
          requiredDate: request.requiredDate || "",
          justification: request.justification || "",
          specifications: request.specifications || "",
        });
        setEditError("");
        setIsEditing(true);
      }}
      disabled={!["Pending", "Revision Required"].includes(status)}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-text-primary hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Pencil size={16} />
      Edit Request
    </button>

    <button
      type="button"
      onClick={() => {
        setCancelReason("");
        setShowCancelDialog(true);
      }}
      disabled={!["Pending", "Revision Required"].includes(status)}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Ban size={16} />
      Cancel Request
    </button>
  </>
)}
</div>

        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Package size={20} />
            </span>
            <div>
              <p className="text-xs text-text-secondary">Quantity</p>
              <p className="mt-1 text-lg font-bold text-text-primary">
                {request.quantity ?? "—"}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Wallet size={20} />
            </span>
            <div>
              <p className="text-xs text-text-secondary">Estimated amount</p>
              <p className="mt-1 text-lg font-bold text-text-primary">
                {formatAmount(request.estimatedAmount ?? request.amount)}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <CalendarDays size={20} />
            </span>
            <div>
              <p className="text-xs text-text-secondary">Required delivery</p>
              <p className="mt-1 text-lg font-bold text-text-primary">
                {formatDate(request.requiredDate)}
              </p>
            </div>
          </div>
        </article>
      </div>
      {isEditing && (
  <div className="rounded-xl border border-border bg-white p-6">
    <h2 className="mb-5 text-lg font-bold text-text-primary">
      Edit Purchase Request
    </h2>

    {editError && (
      <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
        {editError}
      </p>
    )}

    <form
      onSubmit={(e) => {
        e.preventDefault();
        const result = updateRequest(requestId, editForm);

        if (!result.success) {
          setEditError(result.message);
          return;
        }

        setIsEditing(false);
        setEditError("");
        window.location.reload();
      }}
      className="space-y-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">Item Name</label>
        <input
          required
          value={editForm?.itemName || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, itemName: e.target.value })
          }
          className="w-full rounded-lg border border-border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <input
          required
          value={editForm?.category || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, category: e.target.value })
          }
          className="w-full rounded-lg border border-border px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Quantity</label>
          <input
            required
            min="1"
            type="number"
            value={editForm?.quantity ?? ""}
            onChange={(e) =>
              setEditForm({ ...editForm, quantity: e.target.value })
            }
            className="w-full rounded-lg border border-border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Estimated Amount (₹)
          </label>
          <input
            required
            min="1"
            type="number"
            value={editForm?.estimatedAmount ?? ""}
            onChange={(e) =>
              setEditForm({ ...editForm, estimatedAmount: e.target.value })
            }
            className="w-full rounded-lg border border-border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Required Date</label>
        <input
          required
          type="date"
          value={editForm?.requiredDate || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, requiredDate: e.target.value })
          }
          className="w-full rounded-lg border border-border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Justification</label>
        <textarea
          required
          rows="3"
          value={editForm?.justification || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, justification: e.target.value })
          }
          className="w-full rounded-lg border border-border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Specifications</label>
        <textarea
          rows="3"
          value={editForm?.specifications || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, specifications: e.target.value })
          }
          className="w-full rounded-lg border border-border px-3 py-2"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setEditError("");
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}     

       
      {role === "Employee" &&
        status === "Revision Required" &&
        request.reviewComment && (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <FileText size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-amber-900">
                  Revision Feedback
                </h2>

                <p className="mt-1 text-sm text-amber-800">
                  The Procurement Officer has requested changes to your request.
                </p>

                <div className="mt-3 rounded-lg border border-amber-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                    Officer's comments
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-text-primary">
                    {request.reviewComment}
                  </p>
                </div>

                <p className="mt-3 text-sm text-amber-800">
                  Please review these comments and use Edit Request to update your submission.
                </p>
              </div>
            </div>
          </section>
        )}

      <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-bold text-text-primary">
            Requirement information
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Details provided when the request was submitted.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <p className="text-xs font-medium text-text-secondary">
              Item or requirement
            </p>
            <p className="mt-1.5 text-sm font-semibold text-text-primary">
              {request.itemName || request.item || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-text-secondary">
              Procurement category
            </p>
            <p className="mt-1.5 text-sm font-semibold text-text-primary">
              {request.category || "—"}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-text-secondary">
              Business justification
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-text-primary">
              {request.justification || "No justification provided."}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-text-secondary">
              Technical specifications or additional details
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-text-primary">
              {request.specifications || "No additional details provided."}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-text-secondary">
              Submitted on
            </p>
            <p className="mt-1.5 text-sm font-semibold text-text-primary">
              {formatDate(request.createdAt)}
            </p>
          </div>
        </div>
      </section>

      
      {role === "Officer" && (
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-bold text-text-primary">
            Procurement review
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Review this request and decide how it should proceed.
          </p>

          {status === "Pending" ? (
            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="reviewComment"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Reason or comments
                </label>
                <textarea
                  id="reviewComment"
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  rows={3}
                  placeholder="Required when rejecting or requesting a revision."
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-600"
                />
              </div>

              {reviewError && (
                <p className="text-sm text-red-600">{reviewError}</p>
              )}

              
<div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
  <button
    type="button"
    onClick={() => handleReview("Approve")}
    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
  >
    <CheckCircle size={17} />
    Approve Request
  </button>

  <button
    type="button"
    onClick={() => handleReview("Reject")}
    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
  >
    <XCircle size={17} />
    Reject Request
  </button>

  <button
    type="button"
    onClick={() => handleReview("Request Revision")}
    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
  >
    <Pencil size={17} />
    Request Revision
  </button>
</div>

            </div>
          ) : (
            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-semibold text-text-primary">
                Current status: {status}
              </p>
              {request.reviewComment && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-text-secondary">
                  Review comments: {request.reviewComment}
                </p>
              )}
            </div>
          )}
        </section>
      )}


      {showCancelDialog && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <h2 className="text-lg font-bold text-text-primary">
        Cancel Purchase Request?
      </h2>

      <p className="mt-2 text-sm text-text-secondary">
        This request will be marked as Cancelled and retained in the records.
      </p>

      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();

          const result = cancelRequest(requestId, cancelReason);

          if (!result.success) {
            setEditError(result.message);
            setShowCancelDialog(false);
            return;
          }

          setShowCancelDialog(false);
          window.location.reload();
        }}
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            Reason for cancellation
          </label>

          <textarea
            required
            rows="3"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Explain why this request is no longer needed..."
            className="w-full rounded-lg border border-border px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowCancelDialog(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold"
          >
            Keep Request
          </button>

          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Confirm Cancellation
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Clock3 size={20} />
          </span>

          <div>
            <h2 className="font-bold text-text-primary">
              Procurement progress
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Current request workflow status.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />

          <div>
            <p className="text-sm font-semibold text-text-primary">
              Request submitted
            </p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Your request has been recorded in the procurement workspace.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3">
          <Clock3 size={20} className="shrink-0 text-amber-600" />

          <div>
            <p className="text-sm font-semibold text-text-primary">
              {status === "Pending"
                ? "Awaiting procurement review"
                : `Current status: ${status}`}
            </p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              {status === "Pending"
                ? "The Procurement Officer will review the submitted requirement."
                : "The request status will progress as the procurement workflow advances."}
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
