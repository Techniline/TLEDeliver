import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { format } from "date-fns";

const branches = ["All", "Al Shoala", "MusicMajlis", "Soundline Main", "Techniline HQ"];
const statuses = ["All", "Pending", "Approved", "Rejected", "Delivered"];
const drivers = ["All", "Mohammed Ali", "Khalid Hassan", "Ahmed Nasser"];

export default function ExportCSVButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [branch, setBranch] = useState("All");
  const [status, setStatus] = useState("All");
  const [driver, setDriver] = useState("All");

  const handleExport = () => {
    console.log("Exporting CSV with filters:", { branch, status, driver });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="gap-2" data-testid="button-export">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Export Delivery Logs</h4>
            <p className="text-sm text-muted-foreground">
              Filter and export delivery data as CSV
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="export-branch">Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger id="export-branch" data-testid="select-export-branch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="export-status" data-testid="select-export-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-driver">Driver</Label>
              <Select value={driver} onValueChange={setDriver}>
                <SelectTrigger id="export-driver" data-testid="select-export-driver">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleExport} className="w-full" data-testid="button-confirm-export">
            Download CSV
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
