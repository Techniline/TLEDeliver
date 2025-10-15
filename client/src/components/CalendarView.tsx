import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Ban } from "lucide-react";
import StatusBadge from "./StatusBadge";

type Status = "Pending" | "Approved" | "Rejected" | "Delivered";

interface SlotEvent {
  id: string;
  doNumber: string;
  customerName: string;
  status: Status;
  driverName?: string;
}

interface CalendarSlot {
  time: string;
  events: SlotEvent[];
  isBlocked?: boolean;
}

interface CalendarViewProps {
  slots: CalendarSlot[];
  onBlockSlot?: (time: string) => void;
}

export default function CalendarView({ slots, onBlockSlot }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-xl">Delivery Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => navigateWeek("prev")}
              data-testid="button-prev-week"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-32 text-center">
              Week of {currentDate.toLocaleDateString()}
            </span>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => navigateWeek("next")}
              data-testid="button-next-week"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <div key={day} className="space-y-2">
              <div className="font-semibold text-sm text-center pb-2 border-b">
                {day}
                {index === 6 && (
                  <span className="ml-2 text-xs text-muted-foreground">(Blocked)</span>
                )}
              </div>
              <div className="space-y-2 min-h-40">
                {index === 6 ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <div className="text-center">
                      <Ban className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Closed</p>
                    </div>
                  </div>
                ) : (
                  slots.slice(0, 3).map((slot) => (
                    <div
                      key={`${day}-${slot.time}`}
                      className={`p-3 rounded-md border text-sm ${
                        slot.isBlocked
                          ? "bg-muted/50 border-dashed"
                          : "bg-card hover-elevate cursor-pointer"
                      }`}
                      data-testid={`slot-${day}-${slot.time}`}
                    >
                      {slot.isBlocked ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Ban className="w-4 h-4" />
                          <span className="text-xs">Blocked</span>
                        </div>
                      ) : slot.events.length > 0 ? (
                        <div className="space-y-2">
                          {slot.events.map((event) => (
                            <div key={event.id} className="space-y-1">
                              <div className="font-mono text-xs">{event.doNumber}</div>
                              <div className="font-medium text-xs truncate">
                                {event.customerName}
                              </div>
                              <StatusBadge status={event.status} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground text-xs py-2">
                          Available
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
