
const STORAGE_KEY = "smartprocure_rfqs";

const initialRfqs = [
  {
    id: "RFQ-2026-001",
    title: "Workstation Equipment",
    category: "IT Equipment",
    requestId: "PR-2026-0142",
    quantity: 10,
    budget: 85000,
    deliveryDate: "2026-11-15",
    deadline: "2026-10-25",
    invitedVendorIds: ["VEN-001"],
    status: "Open",
    description: "Workstations for office staff.",
    createdAt: "2026-10-15T09:00:00.000Z",
  },
  {
    id: "RFQ-2026-002",
    title: "Safety Equipment",
    category: "Safety Equipment",
    requestId: "PR-2026-0134",
    quantity: 25,
    budget: 18200,
    deliveryDate: "2026-11-10",
    deadline: "2026-10-28",
    invitedVendorIds: ["VEN-003"],
    status: "Draft",
    description: "Required safety equipment for factory operations.",
    createdAt: "2026-10-16T09:00:00.000Z",
  },
  {
    id: "RFQ-2026-003",
    title: "Office Networking Supplies",
    category: "IT Equipment",
    requestId: "PR-2026-0139",
    quantity: 15,
    budget: 32500,
    deliveryDate: "2026-11-20",
    deadline: "2026-10-30",
    invitedVendorIds: ["VEN-001"],
    status: "Closed",
    description: "Networking accessories and installation supplies.",
    createdAt: "2026-10-17T09:00:00.000Z",
  },
];

function readRfqs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Use initial data if stored data cannot be read.
  }

  return initialRfqs;
}

function writeRfqs(rfqs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rfqs));
    return true;
  } catch {
    return false;
  }
}

export function getRfqs() {
  const existingRfqs = readRfqs();
  const existingIds = new Set(existingRfqs.map((rfq) => rfq.id));

  const missingRfqs = initialRfqs.filter(
    (rfq) => !existingIds.has(rfq.id)
  );

  if (missingRfqs.length > 0) {
    const mergedRfqs = [...existingRfqs, ...missingRfqs];

    if (writeRfqs(mergedRfqs)) {
      return mergedRfqs;
    }

    return existingRfqs;
  }

  return existingRfqs;
}

export function getRfqById(rfqId) {
  return getRfqs().find((rfq) => rfq.id === rfqId) || null;
}

export function createRfq(form) {
  const rfqs = getRfqs();

  const nextNumber =
    rfqs.reduce((max, rfq) => {
      const match = rfq.id?.match(/^RFQ-\d{4}-(\d+)$/);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0) + 1;

  const year = new Date().getFullYear();

  const newRfq = {
    id: `RFQ-${year}-${String(nextNumber).padStart(3, "0")}`,
    title: form.title.trim(),
    category: form.category,
    requestId: form.requestId || "",
    quantity: Number(form.quantity),
    budget: Number(form.budget),
    deliveryDate: form.deliveryDate,
    deadline: form.deadline,
    invitedVendorIds: form.invitedVendorIds || [],
    status: form.status || "Draft",
    description: form.description.trim(),
    createdAt: new Date().toISOString(),
  };

  if (!writeRfqs([newRfq, ...rfqs])) {
    return {
      success: false,
      message: "Unable to save the RFQ. Please try again.",
    };
  }

  return { success: true, rfq: newRfq };
}

export function updateRfqStatus(rfqId, status) {
  const allowedStatuses = ["Draft", "Open", "Closed"];

  if (!allowedStatuses.includes(status)) {
    return { success: false, message: "Invalid RFQ status." };
  }

  const rfqs = getRfqs();
  const exists = rfqs.some((rfq) => rfq.id === rfqId);

  if (!exists) {
    return { success: false, message: "RFQ not found." };
  }

  const updatedRfqs = rfqs.map((rfq) =>
    rfq.id === rfqId ? { ...rfq, status } : rfq
  );

  if (!writeRfqs(updatedRfqs)) {
    return { success: false, message: "Unable to update the RFQ status." };
  }

  return {
    success: true,
    rfq: updatedRfqs.find((rfq) => rfq.id === rfqId),
  };
}
