
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createRequest } from "../services/mock/requestService.js";
import {
  ArrowLeft,
  Send,
  RotateCcw,
  CheckCircle2,
  Eye,
} from "lucide-react";

const initialForm = {
  itemName: "",
  category: "",
  quantity: "1",
  estimatedAmount: "",
  requiredDate: "",
  justification: "",
  specifications: "",
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "block text-sm font-medium text-slate-700";

function getStoredRequests() {
  try {
    const stored = JSON.parse(
      localStorage.getItem("smartprocure_requests") || "[]"
    );
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function CreateRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submittedRequest, setSubmittedRequest] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
  event.preventDefault();
  setError("");
  setSubmittedRequest(null);

  try {
    const newRequest = createRequest(form);

    setSubmittedRequest(newRequest);
    setForm(initialForm);
  } catch {
    setError(
      "Unable to save your request. Please try again."
    );
  }
}

  function handleReset() {
    setForm(initialForm);
    setError("");
    setSubmittedRequest(null);
  }

  return (
    <section className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-6">
      <div>
        <Link
          to="/requests"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to My Requests
        </Link>

        <p className="text-xs font-medium tracking-wide text-slate-500">
          PROCUREMENT WORKSPACE
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Create Request
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Provide the requirement details to initiate a procurement request.
        </p>
      </div>

      {submittedRequest && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={24}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-emerald-900">
                Request Submitted Successfully!
              </h2>

              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Your procurement request has been submitted and is
                pending review by the Procurement Officer.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                  Request ID: {submittedRequest.id}
                </span>

                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
                  Pending Review
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/requests")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                <Eye size={15} />
                View My Requests
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-slate-900">
            Requirement details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Fields marked with * are required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-4 p-5 sm:grid-cols-2 sm:p-6">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="itemName">
              Item or requirement name *
            </label>

            <input
              id="itemName"
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Workstation equipment"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="category">
              Procurement category *
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select a category</option>
              <option value="IT Equipment">IT Equipment</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Furniture">Furniture</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Services">Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="quantity">
              Quantity *
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="estimatedAmount">
              Estimated total amount (₹) *
            </label>

            <input
              id="estimatedAmount"
              name="estimatedAmount"
              type="number"
              min="1"
              step="0.01"
              value={form.estimatedAmount}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. 85000"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="requiredDate">
              Required delivery date *
            </label>

            <input
              id="requiredDate"
              name="requiredDate"
              type="date"
              min={new Date().toLocaleDateString("en-CA")}
              value={form.requiredDate}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="justification">
              Business justification *
            </label>

            <textarea
              id="justification"
              name="justification"
              value={form.justification}
              onChange={handleChange}
              className={inputClass}
              rows={2}
              placeholder="Explain why this requirement is needed."
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="specifications">
              Technical specifications or additional details
            </label>

            <textarea
              id="specifications"
              name="specifications"
              value={form.specifications}
              onChange={handleChange}
              className={inputClass}
              rows={2}
              placeholder="Include preferred specifications, quality standards, or other requirements."
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-5 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw size={15} />
            Reset
          </button>

          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <Send size={15} />
            Submit Request
          </button>
        </div>
      </form>
    </section>
  );
}
