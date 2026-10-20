import { useMemo, useState } from "react";
import {
  BrainCircuit,
  Search,
  FileText,
  Store,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Target,
  ShieldCheck,
  Eye,
  Clock3,
  ArrowRight,
  Play,
  RotateCcw,
} from "lucide-react";

import { getRfqs } from "../services/mock/rfqService.js";
import { getQuotationsForRfq } from "../services/mock/quotationService.js";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function Evaluations() {
  const [search, setSearch] = useState("");
  const [selectedRfqId, setSelectedRfqId] = useState("");
  const [evaluationStatus, setEvaluationStatus] = useState("Not Evaluated");
  const [approvalSubmitted, setApprovalSubmitted] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [viewQuotation, setViewQuotation] = useState(null);

  const rfqs = useMemo(() => getRfqs(), []);

  const submittedRfqs = useMemo(
    () =>
      rfqs.filter((rfq) => getQuotationsForRfq(rfq.id).length > 0),
    [rfqs]
  );

  const filteredRfqs = submittedRfqs.filter((rfq) =>
    `${rfq.id} ${rfq.title || rfq.itemName || rfq.category || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const selectedRfq =
    filteredRfqs.find((rfq) => rfq.id === selectedRfqId) ||
    filteredRfqs[0] ||
    null;

  const quotations = selectedRfq
    ? getQuotationsForRfq(selectedRfq.id)
    : [];

  const budget = Number(selectedRfq?.budget) || 0;

  const lowestQuote =
  quotations.length > 0
    ? quotations.reduce((lowest, quote) => {
        const price = Number(quote.quotedPrice);

        if (!Number.isFinite(price) || price <= 0) {
          return lowest;
        }

        return lowest === null || price < Number(lowest.quotedPrice)
          ? quote
          : lowest;
      }, null)
    : null;

  const withinBudgetCount = quotations.filter((quote) => {
  const price = Number(quote.quotedPrice);

  return (
    Number.isFinite(price) &&
    price > 0 &&
    price <= budget
  );
}).length;

  const runDemoEvaluation = () => {
  if (!selectedRfq || quotations.length === 0) {
    return;
  }

  const validQuotes = quotations.filter((quote) => {
    const price = Number(quote.quotedPrice);
    const delivery = Number(quote.deliveryDays);

    return (
      Number.isFinite(price) &&
      price > 0 &&
      Number.isFinite(delivery) &&
      delivery > 0
    );
  });

  if (validQuotes.length === 0) {
    return;
  }

  const maxPrice = Math.max(
    ...validQuotes.map((quote) => Number(quote.quotedPrice))
  );

  const maxDelivery = Math.max(
    ...validQuotes.map((quote) => Number(quote.deliveryDays))
  );

  const lowestPrice = Math.min(
  ...validQuotes.map((quote) => Number(quote.quotedPrice))
);

const fastestDelivery = Math.min(
  ...validQuotes.map((quote) => Number(quote.deliveryDays))
);

const scoredQuotes = validQuotes
  .map((quote) => {
    const price = Number(quote.quotedPrice);
    const delivery = Number(quote.deliveryDays);
    const isWithinBudget = price <= Number(budget);

    // Demo scoring: compliance, reliability, and risk are simulated.
    const priceScore =
  price > 0 ? (lowestPrice / price) * 100 : 0;

const deliveryScore =
  delivery > 0 ? (fastestDelivery / delivery) * 100 : 0;

// Simulated demo assessments, not verified vendor findings.
const complianceScore = 70;
const reliabilityScore = 70;
const riskScore = 70;

const score =
  priceScore * 0.35 +
  complianceScore * 0.30 +
  deliveryScore * 0.15 +
  reliabilityScore * 0.10 +
  riskScore * 0.10;

    return {
      ...quote,
      isWithinBudget,
      demoScore: Math.round(score * 10) / 10,
      priceScore: Math.round(priceScore),
      deliveryScore: Math.round(deliveryScore),
      complianceScore,
      reliabilityScore,
      riskScore,
    };
  })
  .sort((a, b) => {
    // Prefer eligible quotations over quotations above budget.
    if (a.isWithinBudget !== b.isWithinBudget) {
      return a.isWithinBudget ? -1 : 1;
    }

    // Within the same budget category, highest score ranks first.
    return b.demoScore - a.demoScore;
  });

  const rankedQuotes = scoredQuotes.map((quote, index) => ({
    ...quote,
    rank: index + 1,
  }));

  setEvaluationResults({
    rfqId: selectedRfq.id,
    evaluatedAt: new Date().toLocaleString("en-IN"),
    quotationCount: quotations.length,
    lowestQuote,
    withinBudgetCount,
    budget,
    rankedQuotes,
    recommendedQuote:
      rankedQuotes.find((quote) => quote.isWithinBudget) ?? rankedQuotes[0],
    note:
      "Simulated demo scoring. Compliance, reliability, and risk scores are placeholders; actual AI agents are not running.",
  });
  
  setApprovalSubmitted(false);
  setEvaluationStatus("Completed");
};
  const selectedRfqCount = submittedRfqs.length;

  const totalQuotations = submittedRfqs.reduce(
    (total, rfq) => total + getQuotationsForRfq(rfq.id).length,
    0
  );

 const agentFindings = [
  {
    name: "Requirement Analysis",
    icon: Target,
    status:
      evaluationStatus === "Completed" ? "Demo Result" : "Awaiting Evaluation",
    description:
      evaluationStatus === "Completed"
        ? selectedRfq?.id === "RFQ-2026-002"
          ? "Simulated finding: SafeWork is assumed to meet essential safety-equipment requirements. Actual specification matching must be verified against the purchase request."
          : "Simulated finding: the recommended option is assumed to meet essential requirements. Actual specification matching must be verified against the purchase request."
        : "The agent compares the original purchase requirements with the specifications offered by each vendor.",
  },
  {
    name: "Vendor Evaluation",
    icon: Store,
    status:
      evaluationStatus === "Completed" ? "Demo Result" : "Awaiting Evaluation",
    description:
      evaluationStatus === "Completed" && evaluationResults?.recommendedQuote
        ? `Simulated finding: ${evaluationResults.recommendedQuote.vendorName} ranks first under the demo assessment. Vendor capability and historical performance are illustrative assumptions, not verified records.`
        : "The agent assesses vendor capability, available performance records, and quotation details.",
  },
  {
    name: "Budget Analysis",
    icon: IndianRupee,
    status:
      evaluationStatus === "Completed"
        ? "Demo Completed"
        : quotations.length
          ? "Price Checked"
          : "Awaiting Quotes",
    description: quotations.length
      ? `${withinBudgetCount} of ${quotations.length} quotations are within the ${formatCurrency(budget)} RFQ budget.${
          lowestQuote
            ? ` Lowest quoted price: ${formatCurrency(lowestQuote.quotedPrice)}.`
            : ""
        }`
      : "The agent compares quotation prices with the RFQ budget.",
  },
  {
    name: "Risk Analysis",
    icon: ShieldCheck,
    status:
      evaluationStatus === "Completed" ? "Demo Result" : "Awaiting Evaluation",
    description:
      evaluationStatus === "Completed" && evaluationResults?.recommendedQuote
        ? `Demo finding: the recommended quotation is ${
            evaluationResults.recommendedQuote.isWithinBudget
              ? "within budget"
              : "over budget"
          }, with delivery in ${evaluationResults.recommendedQuote.deliveryDays} days. ${
            quotations.some(
              (quote) =>
                Number(quote.deliveryDays) <
                Number(evaluationResults.recommendedQuote.deliveryDays)
            )
              ? "A faster delivery alternative exists and should be considered."
              : "No submitted quotation offers faster delivery."
          } Vendor reliability remains unverified.`
        : "The agent checks budget eligibility, delivery trade-offs, and vendor-related risks.",
  },
  {
    name: "Recommendation",
    icon: BrainCircuit,
    status:
      evaluationStatus === "Completed" ? "Demo Completed" : "Pending",
    description:
      evaluationStatus === "Completed" && evaluationResults?.recommendedQuote
        ? `Demo recommendation: ${evaluationResults.recommendedQuote.vendorName} is ranked for Manager review based on its demo score, budget position, and delivery details. 
        Specification compliance and vendor assessment assumptions must be verified before final selection.`
        : "The agent combines requirement, vendor, budget, and risk findings to explain and rank the available quotations.",
  },
];
  return (
    <section className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
      <header>
        <p className="text-xs font-medium tracking-wide text-text-secondary">
          PROCUREMENT WORKSPACE / OFFICER PORTAL
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Quotation Evaluation
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          Compare supplier quotations, review evaluation findings, and prepare
          a recommendation for managerial approval.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "RFQs to Evaluate",
            value: selectedRfqCount,
            icon: FileText,
            style: "bg-blue-50 text-blue-700",
          },
          {
            label: "Submitted Quotations",
            value: totalQuotations,
            icon: Store,
            style: "bg-violet-50 text-violet-700",
          },
          {
            label: "Quotes Within Budget",
            value: `${withinBudgetCount}/${quotations.length}`,
            icon: CheckCircle2,
            style: "bg-emerald-50 text-emerald-700",
          },
        ].map(({ label, value, icon: Icon, style }) => (
          <article
            key={label}
            className="flex items-center justify-between gap-4 rounded-xl border
             border-border bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-sm text-text-secondary">{label}</p>
              <p className="mt-2 text-2xl font-bold text-text-primary">
                {value}
              </p>
            </div>

            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${style}`}
            >
              <Icon size={21} />
            </span>
          </article>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-text-primary">Select RFQ</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Choose an RFQ with submitted vendor quotations.
            </p>
          </div>

          <label className="relative block w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search RFQ ID or title..."
              aria-label="Search RFQs for evaluation"
              className="min-h-10 w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
            />
          </label>
        </div>

        {filteredRfqs.length > 0 ? (
          <div className="flex flex-wrap gap-3 p-5">
            {filteredRfqs.map((rfq) => {
              const active = selectedRfq?.id === rfq.id;

              return (
                <button
                  key={rfq.id}
                  type="button"
                  onClick={() => {
                   setSelectedRfqId(rfq.id);
                   setEvaluationStatus("Not Evaluated");
                   setEvaluationResults(null);
                    }}
                  className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                    active
                      ? "border-brand-600 bg-brand-50"
                      : "border-border hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`block text-sm font-semibold ${
                      active ? "text-brand-700" : "text-text-primary"
                    }`}
                  >
                    {rfq.id}
                  </span>
                  <span className="mt-1 block text-xs text-text-secondary">
                    Budget: {formatCurrency(rfq.budget)}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <FileText className="mx-auto text-slate-400" size={28} />
            <p className="mt-3 font-semibold text-text-primary">
              No quotations available for evaluation
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              RFQs will appear here when vendors have submitted quotations.
            </p>
          </div>
        )}
      </section>

      {selectedRfq && (
        <>
          <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-text-primary">
                  Quotation Comparison
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {selectedRfq.id} · RFQ budget: {formatCurrency(budget)}
                </p>
              </div>

              <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {quotations.length} submitted{" "}
                {quotations.length === 1 ? "quotation" : "quotations"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-text-secondary">
                  <tr>
  <th className="px-5 py-4 font-semibold">Vendor</th>
  <th className="px-5 py-4 font-semibold">Quoted Price</th>
  <th className="px-5 py-4 font-semibold">Delivery</th>
  <th className="px-5 py-4 font-semibold">Budget Status</th>
  <th className="px-5 py-4 font-semibold">Actions</th>
</tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
  {quotations.map((quote) => {
    const price = Number(quote.quotedPrice) || 0;
    const withinBudget = price <= budget;

    return (
      <tr key={quote.id} className="hover:bg-slate-50/70">
        <td className="px-5 py-4">
          <p className="font-semibold text-text-primary">
            {quote.vendorName}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            {quote.id}
          </p>
        </td>

        <td className="px-5 py-4 font-semibold text-text-primary">
          {formatCurrency(price)}
          {lowestQuote &&
             price === Number(lowestQuote.quotedPrice) && (
    <span className="ml-2 text-xs font-medium text-emerald-700">
      Lowest
    </span>
  )}
        </td>

        <td className="px-5 py-4 text-text-secondary">
          {quote.deliveryDays != null
            ? `${quote.deliveryDays} days`
            : "Not provided"}
        </td>

        <td className="px-5 py-4">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              withinBudget
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {withinBudget ? "Within Budget" : "Over Budget"}
          </span>
        </td>

        <td className="px-5 py-4">
         <button
  type="button"
  className="request-view-button"
  aria-label={`View quotation ${quote.id}`}
  onClick={() => setViewQuotation(quote)}
>
  <Eye size={12} strokeWidth={1.8} />
  View
</button>   
        </td>
      </tr>
    );
  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h2 className="font-bold text-text-primary">
      Start RFQ Evaluation
    </h2>
    <p className="mt-1 text-sm text-text-secondary">
      Review quotations and generate procurement insights.
    </p>
    <p className="mt-1 text-xs text-text-secondary">
      Status: {evaluationStatus}
    </p>
  </div>

  <button
  type="button"
  onClick={runDemoEvaluation}
  disabled={quotations.length === 0}
  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
>
  <BrainCircuit size={17} strokeWidth={2} />
  {evaluationStatus === "Completed"
  ? "Run Again"
  : "Run AI Evaluation"}
</button>
</section>
           
        {evaluationStatus === "Completed" && (
          <section className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <div className="flex items-start gap-3 border-b border-border p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <BrainCircuit size={21} />
              </span>
              <div>
                <h2 className="font-bold text-text-primary">
                  AI Evaluation Findings
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  AI-powered procurement analysis · Coordinated five-agent evaluation workflow
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {agentFindings.map(({ name, icon: Icon, status, description }) => (
                <div
                  key={name}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:gap-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                    <Icon size={18} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-text-primary">
                        {name}
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-text-secondary">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border bg-slate-50/70 p-5">
  <div className="flex items-start gap-3">
    <AlertTriangle
      size={19}
      className="mt-0.5 shrink-0 text-amber-600"
    />

    <div>
  <h3 className="text-sm font-semibold text-text-primary">
    Unified Recommendation
  </h3>

  {evaluationResults ? (
    <div className="mt-3 space-y-3">
      <p className="text-sm leading-6 text-text-secondary">
        Evaluation completed for{" "}
        <span className="font-semibold text-text-primary">
          {evaluationResults.rfqId}
        </span>
        . Compared {evaluationResults.quotationCount} submitted quotations.
      </p>

      {evaluationResults.recommendedQuote && (
        <div className="w-full max-w-4xl rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Recommended vendor
              </p>

              <p className="mt-1 text-base font-semibold text-text-primary">
                {evaluationResults.recommendedQuote.vendorName}
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                Rank #{evaluationResults.recommendedQuote.rank} · Demo score
              </p>
            </div>

            <div className="shrink-0 rounded-lg bg-blue-50 px-3 py-2 text-center">
              <p className="text-lg font-bold text-blue-700">
                {evaluationResults.recommendedQuote.demoScore}
              </p>
              <p className="text-xs text-blue-700">/ 100</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-secondary">Quoted price</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                {formatCurrency(
                  evaluationResults.recommendedQuote.quotedPrice
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-secondary">Delivery</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                {evaluationResults.recommendedQuote.deliveryDays} days
              </p>
            </div>
          </div>

         <div className="mt-3 border-t border-slate-100 pt-3 space-y-3">
  <p className="text-sm font-semibold text-text-primary">
    Why this vendor is recommended
  </p>

  <div className="space-y-2 text-sm text-text-secondary">
    <p>
      <span className="font-medium text-text-primary">Budget:</span>{" "}
      {evaluationResults.recommendedQuote.isWithinBudget
        ? `${evaluationResults.recommendedQuote.vendorName} quotes ${formatCurrency(
            evaluationResults.recommendedQuote.quotedPrice
          )}, leaving ${formatCurrency(
            Number(evaluationResults.budget) -
              Number(evaluationResults.recommendedQuote.quotedPrice)
          )} within the approved budget.`
        : "The recommended quotation exceeds the approved budget and requires Manager review."}
    </p>

    <p>
      <span className="font-medium text-text-primary">Price comparison:</span>{" "}
      {evaluationResults.lowestQuote?.id ===
      evaluationResults.recommendedQuote.id
        ? "This vendor submitted the lowest-priced quotation."
        : evaluationResults.lowestQuote
          ? `${evaluationResults.lowestQuote.vendorName} is ${formatCurrency(
              Number(evaluationResults.recommendedQuote.quotedPrice) -
                Number(evaluationResults.lowestQuote.quotedPrice)
            )} cheaper. The recommended vendor is preferred in this demo based on simulated vendor assessment results, which must be verified.`
          : "A price comparison is unavailable."}
    </p>

    <p>
      <span className="font-medium text-text-primary">Delivery comparison:</span>{" "}
      {(() => {
        const fastestQuote = quotations.reduce((fastest, quote) =>
          Number(quote.deliveryDays) < Number(fastest.deliveryDays)
            ? quote
            : fastest
        );

        const recommended = evaluationResults.recommendedQuote;

        return Number(recommended.deliveryDays) ===
          Number(fastestQuote.deliveryDays)
          ? `${recommended.vendorName} offers the fastest quoted delivery at ${recommended.deliveryDays} days.`
          : `${recommended.vendorName} offers delivery in ${recommended.deliveryDays} days. ${fastestQuote.vendorName} is faster at ${fastestQuote.deliveryDays} days, but its quotation ${
              Number(fastestQuote.quotedPrice) > Number(evaluationResults.budget)
                ? "exceeds the approved budget."
                : "should be compared against the other evaluation criteria."
            }`;
      })()}
    </p>

    <p>
      <span className="font-medium text-text-primary">Evaluation result:</span>{" "}
      Ranked #{evaluationResults.recommendedQuote.rank} with a demo score of{" "}
      {evaluationResults.recommendedQuote.demoScore}/100 using the configured
      evaluation weights and simulated assessment values.
    </p>
  </div>
</div>
</div>
      )}

      <p className="text-xs text-text-secondary">
        {evaluationResults.withinBudgetCount} of{" "}
        {evaluationResults.quotationCount} quotations are within budget.
      </p>

      <p className="text-xs text-text-secondary">
        Evaluated at: {evaluationResults.evaluatedAt}
      </p>

      <p className="text-xs text-text-secondary">
        Demo evaluation only. No real AI agents are running. Final vendor
        selection requires Procurement Manager approval.
      </p>

      <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
  <button
    type="button"
    onClick={() => setApprovalSubmitted(true)}
    disabled={approvalSubmitted}
    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow 
    disabled:cursor-not-allowed 
    disabled:border-emerald-200 
    disabled:bg-emerald-600 disabled:shadow-none"
  >
    {approvalSubmitted
      ? "Submitted for Approval"
      : "Submit for Approval"}
  </button>
</div>
    </div>
  ) : (
    <p className="mt-1 text-sm leading-6 text-text-secondary">
      Run the evaluation to view the vendor ranking and procurement insights.
    </p>
  )}
</div>
  </div>
</div>
          </section>
          )}
        </>
            )}

      {viewQuotation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setViewQuotation(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quotation-modal-title"
            className="w-full max-w-lg rounded-2xl border border-border bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Quotation Details
                </p>
                <h2
                  id="quotation-modal-title"
                  className="mt-1 text-xl font-bold text-text-primary"
                >
                  {viewQuotation.vendorName}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {viewQuotation.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewQuotation(null)}
                aria-label="Close quotation details"
                className="rounded-lg px-3 py-1 text-xl text-text-secondary hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm text-text-secondary">Quoted Price</p>
                  <p className="mt-1 text-lg font-bold text-text-primary">
                    {formatCurrency(viewQuotation.quotedPrice)}
                  </p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm text-text-secondary">Delivery Time</p>
                  <p className="mt-1 text-lg font-bold text-text-primary">
                    {viewQuotation.deliveryDays != null
                      ? `${viewQuotation.deliveryDays} days`
                      : "Not provided"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-text-primary">
                  Submission Date
                </p>
                <p className="text-sm text-text-secondary">
                  {viewQuotation.submittedAt
                    ? new Date(viewQuotation.submittedAt).toLocaleString(
                        "en-IN",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )
                    : "Not provided"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-text-primary">
                  Quotation Status
                </p>
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {viewQuotation.status || "Submitted"}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-text-primary">
                  Vendor Notes
                </p>
                <p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-text-secondary">
                  {viewQuotation.notes || "No vendor notes provided."}
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-border p-5">
              <button
                type="button"
                onClick={() => setViewQuotation(null)}
                className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}