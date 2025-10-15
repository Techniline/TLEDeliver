import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Truck } from "lucide-react";

type Status = "Pending" | "Approved" | "Rejected" | "Delivered";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    Pending: {
      icon: Clock,
      className: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30",
    },
    Approved: {
      icon: CheckCircle,
      className: "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30",
    },
    Rejected: {
      icon: XCircle,
      className: "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30",
    },
    Delivered: {
      icon: Truck,
      className: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30",
    },
  };

  const { icon: Icon, className } = config[status];

  return (
    <Badge className={`${className} px-3 py-1 text-xs font-semibold rounded-full gap-1.5`}>
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
  );
}
