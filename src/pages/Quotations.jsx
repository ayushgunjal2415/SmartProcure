
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, FileText, CalendarDays, IndianRupee } from "lucide-react";
import { getRfqById } from "../services/mock/rfqService.js";
import { getQuotationsForRfq } from "../services/mock/quotationService.js";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Quotations() {
  const [searchParams] = useSearchParams();
  const rfqId = searchParams.get("rfqId");
  const rfq = rfqId ? getRfqById(rfqId) : null;
  const quotations = rfq ? getQuotationsForRfq(rfq.id) : [];

  if (!rfq) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-text-primary">
          Quotations
        </h1>
        <p className="text-sm text-text-secondary">
          RFQ not found. Return to RFQ Management and select an RFQ.
        </p>
        <Link
          to="/rfqs"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Back to RFQs
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Link
        to="/rfqs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to RFQs
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Procurement Workspace / Quotations
        </p>
        <h1 className="mt-2 text-3xl font-bold text-text-primary">
          Received Quotations
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {rfq.title} · {rfq.id}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <p className="text-sm text-text-secondary">Quotations received</p>
        <p className="mt-2 text-3xl font-bold text-text-primary">
          {quotations.length} of {rfq.invitedVendorIds.length}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border p-5">
          <h2 className="font-bold text-text-primary">Vendor Responses</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Review the submitted quotation details below.
          </p>
        </div>

        {quotations.length === 0 ? (
          <div className="p-10 text-center">
            <FileText size={32} className="mx-auto text-slate-400" />
            <h3 className="mt-3 font-semibold text-text-primary">
              No quotations received yet
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              Submitted vendor quotations will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {quotations.map((quotation) => (
              <article key={quotation.id} className="space-y-4 p-5">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h3 className="font-bold text-text-primary">
                      {quotation.vendorName}
                    </h3>
                    <p className="mt-1 text-xs text-text-secondary">
                      {quotation.id} · {quotation.vendorId}
                    </p>
                  </div>
                  <span className="h-fit w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {quotation.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="flex items-center gap-1 text-xs text-text-secondary">
                      <IndianRupee size={14} /> Quoted Price
                    </p>
                    <p className="mt-1 font-semibold text-text-primary">
                      {formatCurrency(quotation.quotedPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Delivery Estimate</p>
                    <p className="mt-1 font-semibold text-text-primary">
                      {quotation.deliveryDays} days
                    </p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-xs text-text-secondary">
                      <CalendarDays size={14} /> Submitted
                    </p>
                    <p className="mt-1 font-semibold text-text-primary">
                      {formatDate(quotation.submittedAt)}
                    </p>
                  </div>
                </div>

                {quotation.notes && (
                  <p className="rounded-lg bg-slate-50 p-3 text-sm text-text-secondary">
                    {quotation.notes}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
