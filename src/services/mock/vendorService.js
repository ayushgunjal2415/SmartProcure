
const VENDOR_STORAGE_KEY = "smartprocure_vendors";
const REGISTRATION_STORAGE_KEY = "smartprocure_vendor_registrations";

const initialVendors = [
  {
    id: "VEN-001",
    name: "TechSource Solutions",
    category: "IT Equipment",
    contact: "Amit Sharma",
    email: "amit@techsource.example",
    phone: "9876543210",
    city: "Pune",
    status: "Active",
  },
  {
    id: "VEN-002",
    name: "OfficePro Supplies",
    category: "Office Supplies",
    contact: "Neha Patil",
    email: "neha@officepro.example",
    phone: "9876543211",
    city: "Mumbai",
    status: "Active",
  },
  {
    id: "VEN-003",
    name: "SafeWork Industries",
    category: "Safety Equipment",
    contact: "Rahul Deshmukh",
    email: "rahul@safework.example",
    phone: "9876543212",
    city: "Nashik",
    status: "Pending",
  },
  {
    id: "VEN-004",
    name: "FurniSpace Enterprise",
    category: "Furniture",
    contact: "Priya Kulkarni",
    email: "priya@furnispace.example",
    phone: "9876543213",
    city: "Pune",
    status: "Inactive",
  },
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Return the fallback when stored data cannot be read.
  }

  return fallback;
}

function writeStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function getVendors() {
  return readStorage(VENDOR_STORAGE_KEY, initialVendors);
}

export function saveVendors(vendors) {
  if (!Array.isArray(vendors)) return false;
  return writeStorage(VENDOR_STORAGE_KEY, vendors);
}

export function getVendorById(vendorId) {
  return getVendors().find((vendor) => vendor.id === vendorId) || null;
}

export function updateVendor(vendorId, changes) {
  const vendors = getVendors();
  const index = vendors.findIndex((vendor) => vendor.id === vendorId);

  if (index === -1) {
    return { success: false, message: "Vendor not found." };
  }

  const updatedVendor = { ...vendors[index], ...changes, id: vendorId };
  const updatedVendors = vendors.map((vendor, i) =>
    i === index ? updatedVendor : vendor
  );

  if (!saveVendors(updatedVendors)) {
    return { success: false, message: "Unable to save vendor changes." };
  }

  return { success: true, vendor: updatedVendor };
}

export function changeVendorStatus(vendorId, status) {
  const allowedStatuses = ["Active", "Pending", "Inactive"];

  if (!allowedStatuses.includes(status)) {
    return { success: false, message: "Invalid vendor status." };
  }

  return updateVendor(vendorId, { status });
}

export function syncApprovedRegistration(registration) {
  if (!registration?.id || !registration?.companyName) {
    return { success: false, message: "Registration details are incomplete." };
  }

  const vendors = getVendors();
  const index = vendors.findIndex(
    (vendor) =>
      vendor.registrationId === registration.id ||
      (
        vendor.email &&
        registration.email &&
        vendor.email.toLowerCase() === registration.email.toLowerCase()
      )
  );

  const existing = index >= 0 ? vendors[index] : null;

  const nextNumber =
    vendors.reduce((max, vendor) => {
      const match = vendor.id?.match(/^VEN-(\d+)$/);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0) + 1;

  const approvedVendor = {
    ...(existing || {}),
    id: existing?.id || `VEN-${String(nextNumber).padStart(3, "0")}`,
    registrationId: registration.id,
    name: registration.companyName,
    category: registration.category || "Other",
    contact: registration.contactPerson || "",
    email: registration.email || "",
    phone: registration.phone || "",
    city: registration.city || "",
    status: "Active",
  };

  const updatedVendors =
    index >= 0
      ? vendors.map((vendor, i) => (i === index ? approvedVendor : vendor))
      : [...vendors, approvedVendor];

  if (!saveVendors(updatedVendors)) {
    return { success: false, message: "Unable to save the approved vendor." };
  }

  return { success: true, vendor: approvedVendor };
}
