
const STORAGE_KEY = "smartprocure_quotations";

const initialQuotations = [
  {
    id: "QUO-2026-001",
    rfqId: "RFQ-2026-001",
    vendorId: "VEN-001",
    vendorName: "TechSource Solutions",
    quotedPrice: 82000,
    deliveryDays: 10,
    submittedAt: "2026-10-18T09:30:00.000Z",
    status: "Submitted",
        notes: "Includes warranty and installation.",
  },
  {
    id: "QUO-2026-002",
    rfqId: "RFQ-2026-001",
    vendorId: "VEN-002",
    vendorName: "Digital Systems India",
    quotedPrice: 78500,
    deliveryDays: 14,
    submittedAt: "2026-10-18T10:15:00.000Z",
    status: "Submitted",
    notes: "Competitive price with standard warranty.",
  },
  {
    id: "QUO-2026-003",
    rfqId: "RFQ-2026-001",
    vendorId: "VEN-004",
    vendorName: "PrimeTech Computers",
    quotedPrice: 89500,
    deliveryDays: 7,
    submittedAt: "2026-10-18T11:00:00.000Z",
    status: "Submitted",
    notes: "Fast delivery and extended warranty.",
  },
  {
    id: "QUO-2026-004",
    rfqId: "RFQ-2026-002",
    vendorId: "VEN-003",
    vendorName: "SafeWork Industries",
    quotedPrice: 17500,
    deliveryDays: 8,
    submittedAt: "2026-10-18T11:30:00.000Z",
    status: "Submitted",
    notes: "Meets listed safety requirements.",
  },
  {
    id: "QUO-2026-005",
    rfqId: "RFQ-2026-002",
    vendorId: "VEN-005",
    vendorName: "SecureGear Supplies",
    quotedPrice: 16800,
    deliveryDays: 12,
    submittedAt: "2026-10-18T12:00:00.000Z",
    status: "Submitted",
    notes: "Lowest price; certification should be verified.",
  },
  {
    id: "QUO-2026-006",
    rfqId: "RFQ-2026-002",
    vendorId: "VEN-006",
    vendorName: "Industrial Safety Hub",
    quotedPrice: 19400,
    deliveryDays: 5,
    submittedAt: "2026-10-18T12:30:00.000Z",
    status: "Submitted",
    notes: "Faster delivery with premium packaging.",
  },
  {
    id: "QUO-2026-007",
    rfqId: "RFQ-2026-002",
    vendorId: "VEN-007",
    vendorName: "ProShield Equipment",
    quotedPrice: 21500,
    deliveryDays: 6,
    submittedAt: "2026-10-18T13:00:00.000Z",
    status: "Submitted",
    notes: "Higher-priced offer; technical compliance needs review.",
  },
];

function readQuotations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Use demo data if stored data cannot be read.
  }

  return initialQuotations;
}

export function getQuotations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialQuotations)
      );
      return initialQuotations;
    }

    const existingQuotations = readQuotations();
    const existingIds = new Set(
      existingQuotations.map((quotation) => quotation.id)
    );

    const newQuotations = initialQuotations.filter(
      (quotation) => !existingIds.has(quotation.id)
    );

    if (newQuotations.length > 0) {
      const mergedQuotations = [
        ...existingQuotations,
        ...newQuotations,
      ];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(mergedQuotations)
      );

      return mergedQuotations;
    }

    return existingQuotations;
  } catch {
    return initialQuotations;
  }
}

export function getQuotationsForRfq(rfqId) {
  return getQuotations().filter(
    (quotation) =>
      quotation.rfqId === rfqId &&
      quotation.status === "Submitted"
  );
}
