import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { Delivery } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function ExportCSVButton() {
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const { data: deliveries = [] } = useQuery<Delivery[]>({
    queryKey: ["/api/deliveries"],
  });

  const handleExport = () => {
    let filtered = deliveries;

    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    if (startDate) {
      filtered = filtered.filter(
        (d) => new Date(d.createdAt) >= startDate
      );
    }

    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (d) => new Date(d.createdAt) <= endOfDay
      );
    }

    const headers = [
      "DO Number",
      "Branch",
      "Customer Name",
      "Phone",
      "Address",
      "Has Packages",
      "Payment Done",
      "Payment Comment",
      "Cargo Tag",
      "Box Quantity",
      "Time Slot",
      "Status",
      "Driver Name",
      "Rejection Reason",
      "Created At",
      "Updated At",
    ];

    const rows = filtered.map((d) => [
      d.doNumber,
      d.branch,
      d.customerName,
      d.phone,
      d.address,
      d.hasPackages ? "Yes" : "No",
      d.paymentDone ? "Yes" : "No",
      d.paymentComment || "",
      d.cargoTag,
      d.boxQuantity,
      d.timeSlot,
      d.status,
      d.driverName || "",
      d.rejectionReason || "",
      format(new Date(d.createdAt), "yyyy-MM-dd HH:mm:ss"),
      format(new Date(d.updatedAt), "yyyy-MM-dd HH:mm:ss"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `deliveries-${format(new Date(), "yyyy-MM-dd-HHmmss")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setOpen(false);
    setStatusFilter("all");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        data-testid="button-export-csv"
      >
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Delivery Data</DialogTitle>
            <DialogDescription>
              Configure filters and export delivery records as CSV
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                      data-testid="button-start-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                      data-testid="button-end-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              className="flex-1"
              data-testid="button-confirm-export"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
