import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RejectionReasonModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  deliveryOrderNumber?: string;
}

export default function RejectionReasonModal({
  open,
  onClose,
  onSubmit,
  deliveryOrderNumber,
}: RejectionReasonModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Rejection Reason Required</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting delivery order {deliveryOrderNumber || 'this request'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
            <Textarea
              id="rejection-reason"
              data-testid="input-rejection-reason"
              placeholder="Enter detailed reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-24 resize-y"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose} data-testid="button-cancel">
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSubmit} 
            disabled={!reason.trim()}
            data-testid="button-submit-rejection"
          >
            Reject Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
