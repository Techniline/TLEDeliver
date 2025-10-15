import { Badge } from "@/components/ui/badge";
import { Package, Zap, Weight } from "lucide-react";

type CargoTag = "FRAGILE" | "ELECTRONICS" | "HEAVY";

interface CargoTagBadgeProps {
  tag: CargoTag;
}

export default function CargoTagBadge({ tag }: CargoTagBadgeProps) {
  const config = {
    FRAGILE: {
      icon: Package,
      className: "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30",
    },
    ELECTRONICS: {
      icon: Zap,
      className: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30",
    },
    HEAVY: {
      icon: Weight,
      className: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30",
    },
  };

  const { icon: Icon, className } = config[tag];

  return (
    <Badge className={`${className} px-2 py-1 text-xs font-semibold rounded-md gap-1.5`}>
      <Icon className="w-3 h-3" />
      {tag}
    </Badge>
  );
}
