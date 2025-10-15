import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "./StatusBadge";
import CargoTagBadge from "./CargoTagBadge";
import RejectionReasonModal from "./RejectionReasonModal";
import { CheckCircle, XCircle } from "lucide-react";

type Status = "Pending" | "Approved" | "Rejected" | "Delivered";
type CargoTag = "FRAGILE" | "ELECTRONICS" | "HEAVY";

interface PendingRequest {
  id: string;
  doNumber: string;
  customerName: string;
  phone: string;
  address: string;
  cargoTag: CargoTag;
  boxQuantity: number;
  timeSlot: string;
  status: Status;
  branch: string;
  driverName?: string;
}

interface PendingRequestsTableProps {
  requests: PendingRequest[];
  drivers: string[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onAssignDriver: (id: string, driver: string) => void;
}

export default function PendingRequestsTable({
  requests,
  drivers,
  onApprove,
  onReject,
  onAssignDriver,
}: PendingRequestsTableProps) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);

  const handleRejectClick = (request: PendingRequest) => {
    setSelectedRequest(request);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = (reason: string) => {
    if (selectedRequest) {
      onReject(selectedRequest.id, reason);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Pending Delivery Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DO Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Cargo Tag</TableHead>
                  <TableHead>Boxes</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No pending requests
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id} className="hover-elevate">
                      <TableCell className="font-mono text-sm" data-testid={`text-do-${request.id}`}>
                        {request.doNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium" data-testid={`text-customer-${request.id}`}>
                            {request.customerName}
                          </div>
                          <div className="text-sm text-muted-foreground">{request.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{request.branch}</TableCell>
                      <TableCell>
                        <CargoTagBadge tag={request.cargoTag} />
                      </TableCell>
                      <TableCell data-testid={`text-boxes-${request.id}`}>{request.boxQuantity}</TableCell>
                      <TableCell className="text-sm">{request.timeSlot}</TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        {request.status === "Approved" ? (
                          <Select
                            value={request.driverName}
                            onValueChange={(driver) => onAssignDriver(request.id, driver)}
                          >
                            <SelectTrigger className="w-32" data-testid={`select-driver-${request.id}`}>
                              <SelectValue placeholder="Assign" />
                            </SelectTrigger>
                            <SelectContent>
                              {drivers.map((driver) => (
                                <SelectItem key={driver} value={driver}>
                                  {driver}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === "Pending" && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => onApprove(request.id)}
                              data-testid={`button-approve-${request.id}`}
                              className="gap-1.5"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectClick(request)}
                              data-testid={`button-reject-${request.id}`}
                              className="gap-1.5"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <RejectionReasonModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
        deliveryOrderNumber={selectedRequest?.doNumber}
      />
    </>
  );
}
