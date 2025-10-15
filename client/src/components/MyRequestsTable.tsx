import { useState, Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "Pending" | "Approved" | "Rejected" | "Delivered";

interface DeliveryRequest {
  id: string;
  doNumber: string;
  customerName: string;
  driverName: string | null;
  timeSlot: string;
  status: Status;
  rejectionReason?: string | null;
}

interface MyRequestsTableProps {
  requests: DeliveryRequest[];
}

export default function MyRequestsTable({ requests }: MyRequestsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Status | "All">("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.doNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || req.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses: Array<Status | "All"> = ["All", "Pending", "Approved", "Rejected", "Delivered"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">My Delivery Requests</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="input-search"
              placeholder="Search by DO number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((status) => (
              <Badge
                key={status}
                variant={selectedStatus === status ? "default" : "secondary"}
                className="cursor-pointer hover-elevate active-elevate-2"
                onClick={() => setSelectedStatus(status)}
                data-testid={`filter-${status.toLowerCase()}`}
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>DO Number</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Driver Name</TableHead>
                <TableHead>Time Slot</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <Fragment key={request.id}>
                    <TableRow className="hover-elevate">
                      <TableCell>
                        {request.status === "Rejected" && request.rejectionReason && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setExpandedRow(expandedRow === request.id ? null : request.id)
                            }
                            data-testid={`button-expand-${request.id}`}
                          >
                            {expandedRow === request.id ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm" data-testid={`text-do-${request.id}`}>
                        {request.doNumber}
                      </TableCell>
                      <TableCell className="font-medium" data-testid={`text-customer-${request.id}`}>
                        {request.customerName}
                      </TableCell>
                      <TableCell data-testid={`text-driver-${request.id}`}>
                        {request.driverName || "-"}
                      </TableCell>
                      <TableCell data-testid={`text-slot-${request.id}`}>
                        {request.timeSlot}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                    </TableRow>
                    {expandedRow === request.id && request.rejectionReason && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/50">
                          <div className="py-3">
                            <p className="text-sm font-medium text-destructive mb-1">
                              Rejection Reason:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.rejectionReason}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
