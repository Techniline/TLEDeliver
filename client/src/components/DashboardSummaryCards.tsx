import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, Ban, CheckCircle } from "lucide-react";

interface SummaryData {
  todaysDeliveries: number;
  pendingApprovals: number;
  blockedSlots: number;
  rejections: number;
}

interface DashboardSummaryCardsProps {
  data: SummaryData;
}

export default function DashboardSummaryCards({ data }: DashboardSummaryCardsProps) {
  const cards = [
    {
      title: "Today's Deliveries",
      value: data.todaysDeliveries,
      icon: Truck,
      color: "text-blue-600 dark:text-blue-400",
      borderColor: "border-l-blue-500",
    },
    {
      title: "Pending Approvals",
      value: data.pendingApprovals,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      borderColor: "border-l-amber-500",
    },
    {
      title: "Blocked Slots",
      value: data.blockedSlots,
      icon: Ban,
      color: "text-red-600 dark:text-red-400",
      borderColor: "border-l-red-500",
    },
    {
      title: "Total Rejections",
      value: data.rejections,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      borderColor: "border-l-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className={`border-l-4 ${card.borderColor}`}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
