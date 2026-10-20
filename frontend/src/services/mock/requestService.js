
const STORAGE_KEY = "smartprocure_requests";

function readRequests() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const requests = saved ? JSON.parse(saved) : [];

    return Array.isArray(requests) ? requests : [];
  } catch {
    return [];
  }
}

function saveRequests(requests) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    return true;
  } catch {
    return false;
  }
}

export function getRequests() {
  const requests = readRequests();

  if (requests.length > 0) {
    return requests;
  }

  const demoRequests = [
    {
      id: "PR-2026-0142",
      itemName: "Workstation equipment",
      category: "IT Equipment",
      quantity: 10,
      estimatedAmount: 85000,
      requiredDate: "2026-11-15",
      justification: "Required for employee workstations.",
      specifications: "Workstation equipment for office use.",
      status: "In Progress",
      createdAt: "2026-10-14T00:00:00.000Z",
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
      createdAt: "2026-10-14T00:00:00.000Z",
    },
    {
      id: "PR-2026-0134",
      itemName: "Safety equipment",
      category: "Safety",
      quantity: 20,
      estimatedAmount: 18200,
      requiredDate: "2026-11-08",
      justification: "Required for workplace safety.",
      specifications: "Standard workplace safety equipment.",
      status: "Approved",
      createdAt: "2026-10-14T00:00:00.000Z",
    },
    {
      id: "PR-2026-0128",
      itemName: "Printer cartridges",
      category: "Office Supplies",
      quantity: 12,
      estimatedAmount: 9600,
      requiredDate: "2026-11-05",
      justification: "Required for office printing.",
      specifications: "Compatible printer cartridges.",
      status: "Rejected",
      createdAt: "2026-10-14T00:00:00.000Z",
    },
    {
      id: "PR-2026-0121",
      itemName: "Office furniture",
      category: "Furniture",
      quantity: 8,
      estimatedAmount: 42000,
      requiredDate: "2026-11-01",
      justification: "Required for office workspace.",
      specifications: "Standard office furniture.",
      status: "Revision Required",
      createdAt: "2026-10-14T00:00:00.000Z",
    },
  ];

  saveRequests(demoRequests);
  return readRequests();
}
export function createRequest(form) {
  const requests = readRequests();

  const nextNumber =
    requests.reduce((max, request) => {
      const match = request.id?.match(/^PR-\d{4}-(\d+)$/);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0) + 1;

  const year = new Date().getFullYear();

  const newRequest = {
    id: `PR-${year}-${String(nextNumber).padStart(3, "0")}`,
    itemName: form.itemName.trim(),
    category: form.category,
    quantity: Number(form.quantity),
    estimatedAmount: Number(form.estimatedAmount),
    requiredDate: form.requiredDate,
    justification: form.justification.trim(),
    specifications: form.specifications.trim(),
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  if (!saveRequests([newRequest, ...requests])) {
    throw new Error("Unable to save the request. Please try again.");
  }

  return newRequest;
}


export function updateRequest(requestId, changes) {
  const requests = readRequests();
  const existing = requests.find((request) => request.id === requestId);

  if (!existing) {
    return { success: false, message: "Request not found." };
  }

  if (!["Pending", "Revision Required"].includes(existing.status)) {
    return {
      success: false,
      message: "Only pending or revision-required requests can be edited.",
    };
  }

  const wasRevisionRequired = existing.status === "Revision Required";

  const updatedRequest = {
    ...existing,
    itemName: String(changes.itemName ?? existing.itemName).trim(),
    category: changes.category ?? existing.category,
    quantity: Number(changes.quantity ?? existing.quantity),
    estimatedAmount: Number(
      changes.estimatedAmount ?? existing.estimatedAmount
    ),
    requiredDate: changes.requiredDate ?? existing.requiredDate,
    justification: String(
      changes.justification ?? existing.justification
    ).trim(),
    specifications: String(
      changes.specifications ?? existing.specifications
    ).trim(),
    ...(wasRevisionRequired
      ? {
          status: "Pending",
          reviewComment: "",
          reviewDecision: "",
          reviewedAt: "",
        }
      : {}),
  };

  const updatedRequests = requests.map((request) =>
    request.id === requestId ? updatedRequest : request
  );

  if (!saveRequests(updatedRequests)) {
    return { success: false, message: "Unable to save your changes." };
  }

  return { success: true, request: updatedRequest };
}


export function cancelRequest(requestId, reason = "") {
  const requests = readRequests();
  const existing = requests.find((request) => request.id === requestId);

  if (!existing) {
    return { success: false, message: "Request not found." };
  }

  if (!["Pending", "Revision Required"].includes(existing.status)) {
    return {
      success: false,
      message:
        "This request cannot be cancelled directly at its current stage. Contact the Procurement Officer.",
    };
  }

  const updatedRequest = {
    ...existing,
    status: "Cancelled",
    cancellationReason: reason.trim(),
    cancelledAt: new Date().toISOString(),
  };

  const updatedRequests = requests.map((request) =>
    request.id === requestId ? updatedRequest : request
  );

  if (!saveRequests(updatedRequests)) {
    return { success: false, message: "Unable to cancel the request." };
  }

  return { success: true, request: updatedRequest };
}

export function reviewRequest(requestId, decision, reason = "") {
  const requests = getRequests();
  const existing = requests.find((request) => request.id === requestId);

  if (!existing) {
    return { success: false, message: "Request not found." };
  }

  if (existing.status !== "Pending") {
    return {
      success: false,
      message: "Only pending requests can be reviewed.",
    };
  }

  const allowedDecisions = {
    Approve: "Approved",
    Reject: "Rejected",
    "Request Revision": "Revision Required",
  };

  const newStatus = allowedDecisions[decision];

  if (!newStatus) {
    return { success: false, message: "Invalid review decision." };
  }

  if (decision !== "Approve" && !reason.trim()) {
    return {
      success: false,
      message: "A reason or revision comment is required.",
    };
  }

  const updatedRequest = {
    ...existing,
    status: newStatus,
    reviewDecision: decision,
    reviewComment: reason.trim(),
    reviewedAt: new Date().toISOString(),
  };

  const updatedRequests = requests.map((request) =>
    request.id === requestId ? updatedRequest : request
  );

  try {
    localStorage.setItem(
      "smartprocure_requests",
      JSON.stringify(updatedRequests)
    );
  } catch {
    return {
      success: false,
      message: "Unable to save the review decision. Please try again.",
    };
  }

  return { success: true, request: updatedRequest };
}

  
