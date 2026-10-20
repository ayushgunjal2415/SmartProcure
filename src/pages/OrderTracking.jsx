import { useMemo, useState } from "react";
import {
  PackageCheck,
  Clock3,
  Truck,
  CheckCircle2,
  Search,
  CalendarDays,
  FileText,
  Store,
} from "lucide-react";

import { getRfqs } from "../services/mock/rfqService.js";

const demoOrders = [
  {
    id: "PO-2026-001",
    rfqId: "RFQ-2026-001",
    vendorName: "TechSource Solutions",
    itemName: "Workstation Equipment",
    amount: 82000,
    orderDate: "2026-10-16",
    expectedDelivery: "2026-11-15",
    status: "In Delivery",
  },
  {
    id: "PO-2026-002",
    rfqId: "RFQ-2026-002",
    vendorName: "SafeWork Industries",
    itemName: "Safety Equipment",
    amount: 17500,
    orderDate: "2026-10-17",
    expectedDelivery: "2026-11-10",
    status: "Confirmed",
  },
  {
    id: "PO-2026-003",
    rfqId: "RFQ-2026-003",
    vendorName: "OfficePro Supplies",
    itemName: "Office Networking Supplies",
    amount: 31000,
    orderDate: "2026-10-18",
    expectedDelivery: "2026-11-20",
    status: "Delivered",
  },
];

const statusStyles = {
  Issued: "bg-blue-50 text-blue-700",
  Confirmed: "bg-violet-50 text-violet-700",
  "In Delivery": "bg-amber-50 text-amber-700",
  Delivered: "bg-emerald-50 text-emerald-700",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrderTracking() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrderId, setSelectedOrderId] = useState("PO-2026-001");

  const rfqs = getRfqs();

  // Demo order data for the initial frontend.
  // This will later be replaced by actual purchase-order service data.
  const orders = useMemo(() => demoOrders, []);

  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      [order.id, order.rfqId, order.vendorName, order.itemName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) ||
    filteredOrders[0];

  const counts = {
    total: orders.length,
    awaitingConfirmation: orders.filter((order) => order.status === "Issued").length,
    inDelivery: orders.filter(
      (order) =>
        order.status === "Confirmed" || order.status === "In Delivery"
    ).length,
    delivered: orders.filter((order) => order.status === "Delivered").length,
  };

  const timeline = [
    { label: "Purchase Order Issued", status: "Issued" },
    { label: "Vendor Confirmation", status: "Confirmed" },
    { label: "Shipment / Delivery", status: "In Delivery" },
    { label: "Order Delivered", status: "Delivered" },
  ];

  const stageOrder = ["Issued", "Confirmed", "In Delivery", "Delivered"];
  const currentStage = selectedOrder
    ? stageOrder.indexOf(selectedOrder.status)
    : -1;

  return (
    <section className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-text-secondary">
          PROCUREMENT WORKSPACE / ORDER MANAGEMENT
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Order Tracking
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          Track purchase orders, vendor confirmation, and delivery progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Orders",
            value: counts.total,
            icon: FileText,
            color: "bg-brand-50 text-brand-600",
          },
          {
            label: "Awaiting Confirmation",
            value: counts.awaitingConfirmation,
            icon: Clock3,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "In Delivery",
            value: counts.inDelivery,
            icon: Truck,
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "Delivered",
            value: counts.delivered,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-700",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <article
            key={label}
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="mt-2 text-2xl font-bold text-text-primary">
                  {value}
                </p>
              </div>

              <span
                className={`flex size-11 items-center justify-center rounded-xl ${color}`}
              >
                <Icon size={21} />
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-text-primary">Purchase Orders</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {filteredOrders.length} order(s) found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search orders..."
                aria-label="Search purchase orders"
                className="min-h-11 w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter orders by status"
              className="min-h-11 rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-brand-500"
            >
              <option value="All">All statuses</option>
              <option value="Issued">Issued</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Delivery">In Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-text-secondary">
              <tr>
                <th className="px-5 py-4 font-semibold">Purchase Order</th>
                <th className="px-5 py-4 font-semibold">Vendor</th>
                <th className="px-5 py-4 font-semibold">Linked RFQ</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Expected Delivery</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-text-primary">{order.id}</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {order.itemName}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-text-secondary">
                    <span className="inline-flex items-center gap-2">
                      <Store size={15} />
                      {order.vendorName}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-text-secondary">{order.rfqId}</td>

                  <td className="px-5 py-4 font-medium text-text-primary">
                    {formatCurrency(order.amount)}
                  </td>

                  <td className="px-5 py-4 text-text-secondary">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={15} />
                      {formatDate(order.expectedDelivery)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[order.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderId(order.id)}
                      className="whitespace-nowrap rounded-lg border border-border px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                    >
                      Track Order
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <PackageCheck size={28} className="mx-auto text-slate-400" />
                    <p className="mt-3 font-semibold text-text-primary">
                      No purchase orders found
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
      </div>

      {selectedOrder && (
        <section className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-text-secondary">
                ORDER DETAILS
              </p>

              <h2 className="mt-2 text-xl font-bold text-text-primary">
                {selectedOrder.itemName}
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                {selectedOrder.id} · {selectedOrder.rfqId}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                statusStyles[selectedOrder.status]
              }`}
            >
              {selectedOrder.status}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-text-secondary">Vendor</p>
              <p className="mt-1 font-semibold text-text-primary">
                {selectedOrder.vendorName}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-text-secondary">Order Date</p>
              <p className="mt-1 font-semibold text-text-primary">
                {formatDate(selectedOrder.orderDate)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-text-secondary">Expected Delivery</p>
              <p className="mt-1 font-semibold text-text-primary">
                {formatDate(selectedOrder.expectedDelivery)}
              </p>
            </div>
          </div>

          <div className="mt-7">
            <h3 className="font-bold text-text-primary">Delivery Timeline</h3>

            <div className="mt-5 space-y-0">
              {timeline.map((stage, index) => {
                const completed = index < currentStage;
                const active = index === currentStage;

                const Icon = completed
                  ? CheckCircle2
                  : active
                    ? Truck
                    : PackageCheck;

                return (
                  <div key={stage.label} className="flex gap-3">
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
                        <Icon size={14} />
                      </span>

                      {index < timeline.length - 1 && (
                        <span
                          className={`my-1 min-h-9 w-0.5 ${
                            completed ? "bg-emerald-300" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>

                    <div className="pb-5">
                      <p className="text-sm font-semibold text-text-primary">
                        {stage.label}
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
          </div>
        </section>
      )}
    </section>
  );
}