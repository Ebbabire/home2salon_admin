import { OrderStatus } from "@/types";
import { Badge } from "./ui/badge";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    [OrderStatus.PENDING_REVIEW]: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    [OrderStatus.ADVANCE_PAYMENT_REQUESTED]: {
      label: "Awaiting Payment",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    },
    [OrderStatus.ADVANCE_PAYMENT_SUBMITTED]: {
      label: "Payment Received",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    [OrderStatus.PAYMENT_APPROVED]: {
      label: "Awaiting Assignment",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    [OrderStatus.PROFESSIONAL_ASSIGNED]: {
      label: "Assigned",
      className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
    },
    [OrderStatus.AWAITING_COMPLETION_CONFIRMATION]: {
      label: "Awaiting Confirmation",
      className: "bg-teal-100 text-teal-800 hover:bg-teal-100",
    },
    [OrderStatus.COMPLETED]: {
      label: "Completed",
      className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    },
    [OrderStatus.CANCELLED]: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  };

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
