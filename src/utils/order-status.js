import {
  Package,
  Clock,
  Loader2,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

export function getStatusUI(status) {
  if (!status) return empty();

  switch (status.toUpperCase()) {
    case "INITIAL":
      return premium("Pending", Clock, "bg-amber-100 text-amber-700 border-amber-300");

    case "PROCESSING":
      return premium("Processing", Loader2, "bg-blue-100 text-blue-700 border-blue-300");

    case "SHIPPED":
      return premium("Shipped", Truck, "bg-indigo-100 text-indigo-700 border-indigo-300");

    case "DELIVERED":
      return premium("Delivered", CheckCircle, "bg-green-100 text-green-700 border-green-300");

    case "CANCELLED":
      return premium("Cancelled", XCircle, "bg-red-100 text-red-700 border-red-300");

    default:
      return premium(status, Package, "bg-gray-100 text-gray-700 border-gray-300");
  }
}

// Helper
function premium(label, Icon, colors) {
  return {
    label,
    Icon,
    className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-sm ${colors}`,
  };
}

function empty() {
  return {
    label: "Unknown",
    Icon: Package,
    className: "bg-gray-100 text-gray-700 border-gray-300",
  };
}
