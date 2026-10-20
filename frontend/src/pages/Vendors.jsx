import { Link } from "react-router-dom";
import RFQs from "./RFQs.jsx";
import { useEffect, useMemo, useState } from "react";
import {
  getVendors,
  saveVendors,
  changeVendorStatus,
} from "../services/mock/vendorService.js";
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
  Eye,
  Pencil,
  X,
  CheckCircle2,
  Clock3,
  Ban,
  Users,
  ClipboardCheck,
} from "lucide-react";


const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Inactive: "bg-slate-100 text-slate-600",
};


const emptyForm = {
  name: "",
  category: "IT Equipment",
  contact: "",
  email: "",
  phone: "",
  city: "",
};

export default function Vendors() {
  const [activeTab, setActiveTab] = useState("vendors");
  const [vendors, setVendors] = useState(getVendors);

  useEffect(() => {
  function refreshVendors() {
    setVendors(getVendors());
  }

  window.addEventListener("focus", refreshVendors);
  window.addEventListener("storage", refreshVendors);

  return () => {
    window.removeEventListener("focus", refreshVendors);
    window.removeEventListener("storage", refreshVendors);
  };
}, []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredVendors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vendors.filter((vendor) => {
      const matchesSearch = [
        vendor.id,
        vendor.name,
        vendor.category,
        vendor.contact,
        vendor.email,
        vendor.city,
      ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || vendor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [vendors, search, statusFilter]);

  const metrics = [
    {
      label: "Total Vendors",
      value: vendors.length,
      icon: Building2,
      tone: "bg-brand-50 text-brand-600",
    },
    {
      label: "Active Vendors",
      value: vendors.filter((v) => v.status === "Active").length,
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Pending Review",
      value: vendors.filter((v) => v.status === "Pending").length,
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "Inactive Vendors",
      value: vendors.filter((v) => v.status === "Inactive").length,
      icon: Ban,
      tone: "bg-slate-100 text-slate-600",
    },
  ];

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  
function handleAddVendor(event) {
  event.preventDefault();
  setError("");
  setNotice("");

  const nextNumber =
    vendors.reduce((max, vendor) => {
      const match = vendor.id?.match(/^VEN-(\d+)$/);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0) + 1;

  const newVendor = {
    ...form,
    id: `VEN-${String(nextNumber).padStart(3, "0")}`,
    status: "Pending",
  };

  const result = saveVendors([newVendor, ...vendors]);

  if (!result) {
    setError("Unable to save this vendor. Please try again.");
    return;
  }

  setVendors(getVendors());
  setForm(emptyForm);
  setShowForm(false);
  setStatusFilter("All");
  setSearch("");
  setNotice(`${newVendor.name} was added with Pending status.`);
}


  
function changeStatus(vendorId, nextStatus) {
  setError("");
  setNotice("");

  const result = changeVendorStatus(vendorId, nextStatus);

  if (!result.success) {
    setError(result.message || "Unable to update vendor status.");
    return;
  }

  setVendors(getVendors());

  setSelectedVendor((current) =>
    current?.id === vendorId ? result.vendor : current
  );

  setNotice(`Vendor status updated to ${nextStatus}.`);
}


  return (
    <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
  <div className="flex gap-2 border-b border-slate-200">
    <button
      type="button"
      onClick={() => setActiveTab("vendors")}
      className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
        activeTab === "vendors"
          ? "border-brand-600 text-brand-700"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      Vendors
    </button>

    <button
      type="button"
      onClick={() => setActiveTab("rfqs")}
      className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
        activeTab === "rfqs"
          ? "border-brand-600 text-brand-700"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      RFQ Management
    </button>
  </div>

  {activeTab === "vendors" && (
    <section className="mx-auto flex w-full min-w-0 flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium tracking-wide text-text-secondary">
            PROCUREMENT WORKSPACE / VENDORS
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Vendor Management
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Maintain vendor records and manage their registration status.
          </p>
        </div>

        <Link
  to="/vendor-registrations"
  className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
>
  <ClipboardCheck size={17} />
  Review Registrations
</Link>
      </div>

      {notice && (
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, tone }) => (
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
            <h2 className="font-bold text-text-primary">Vendor Directory</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {filteredVendors.length} vendor{filteredVendors.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 sm:min-w-64">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search vendors..."
                aria-label="Search vendors"
                className="w-full rounded-lg border border-border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter vendors by status"
              className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50">
              <tr>
                {["Vendor", "Category", "Contact", "Location", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-5 py-3.5 text-xs font-semibold text-slate-500">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-text-primary">{vendor.name}</p>
                    <p className="mt-1 text-xs text-text-secondary">{vendor.id}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{vendor.category}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-text-primary">{vendor.contact}</p>
                    <p className="mt-1 text-xs text-text-secondary">{vendor.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{vendor.city}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${statusStyles[vendor.status] || statusStyles.Pending}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
  type="button"
  onClick={() => {
    setSelectedVendor(vendor);
    setShowForm(false);
    setError("");
    setNotice("");
  }}
  aria-label={`View ${vendor.name}`}
  className="request-view-button inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:bg-slate-50"
>
  <Eye size={14} />
  View
</button>
                  </td>
                </tr>
              ))}

              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Building2 size={28} className="mx-auto text-slate-400" />
                    <p className="mt-3 text-sm font-semibold text-text-primary">No vendors found</p>
                    <p className="mt-1 text-sm text-text-secondary">Try another search or add a vendor.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/40 p-4 pt-10 sm:items-center sm:pt-4">
          <section role="dialog" aria-modal="true" aria-labelledby="vendor-form-title" className="my-auto w-full max-w-2xl rounded-xl border border-border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 id="vendor-form-title" className="font-bold text-text-primary">Add Vendor</h2>
                <p className="mt-1 text-sm text-text-secondary">Enter the vendor's business and contact information.</p>
              </div>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleAddVendor} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <label className="text-sm font-medium text-text-primary">
                Vendor / Company Name *
                <input name="name" value={form.name} onChange={updateField} required maxLength={100} className="mt-2 w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-brand-500" placeholder="Company name" />
              </label>

              <label className="text-sm font-medium text-text-primary">
                Category *
                <select name="category" value={form.category} onChange={updateField} required className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 font-normal outline-none focus:border-brand-500">
                  <option>IT Equipment</option>
                  <option>Office Supplies</option>
                  <option>Networking</option>
                  <option>Safety Equipment</option>
                  <option>Furniture</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="text-sm font-medium text-text-primary">
                Contact Person *
                <input name="contact" value={form.contact} onChange={updateField} required maxLength={100} className="mt-2 w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-brand-500" placeholder="Full name" />
              </label>

              <label className="text-sm font-medium text-text-primary">
                Business Email *
                <input type="email" name="email" value={form.email} onChange={updateField} required maxLength={150} className="mt-2 w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-brand-500" placeholder="name@company.com" />
              </label>

              <label className="text-sm font-medium text-text-primary">
                Phone Number *
                <input type="tel" name="phone" value={form.phone} onChange={updateField} required maxLength={20} className="mt-2 w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-brand-500" placeholder="Contact number" />
              </label>

              <label className="text-sm font-medium text-text-primary">
                City *
                <input name="city" value={form.city} onChange={updateField} required maxLength={100} className="mt-2 w-full rounded-lg border border-border px-3 py-2.5 font-normal outline-none focus:border-brand-500" placeholder="City" />
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
                  Save Vendor
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/40 p-4 pt-10 sm:items-center sm:pt-4">
          <section role="dialog" aria-modal="true" aria-labelledby="vendor-details-title" className="my-auto w-full max-w-lg rounded-xl border border-border bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Building2 size={22} />
                </span>
                <div>
                  <h2 id="vendor-details-title" className="font-bold text-text-primary">{selectedVendor.name}</h2>
                  <p className="mt-1 text-xs text-text-secondary">{selectedVendor.id}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedVendor(null)} aria-label="Close vendor details" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-start gap-3">
                <Building2 size={17} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-text-secondary">Category</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">{selectedVendor.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users size={17} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-text-secondary">Contact person</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">{selectedVendor.contact}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={17} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-text-secondary">Email</p>
                  <p className="mt-1 break-all text-sm font-medium text-text-primary">{selectedVendor.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={17} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-text-secondary">Phone</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">{selectedVendor.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 text-slate-400" />
                <div>
                  <p className="text-xs text-text-secondary">City</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">{selectedVendor.city}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedVendor.status] || statusStyles.Pending}`}>
                  {selectedVendor.status}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedVendor.status !== "Active" && (
                    <button type="button" onClick={() => changeStatus(selectedVendor.id, "Active")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
                      Activate
                    </button>
                  )}
                  {selectedVendor.status !== "Inactive" && (
                    <button type="button" onClick={() => changeStatus(selectedVendor.id, "Inactive")} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:bg-slate-50">
                      Deactivate
                    </button>
                  )}
                  <button type="button" onClick={() => setSelectedVendor(null)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary hover:bg-slate-50">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
    )}

  {activeTab === "rfqs" && <RFQs />}
    </div>
  );
}
