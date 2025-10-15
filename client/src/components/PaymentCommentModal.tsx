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

interface PaymentCommentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

export default function PaymentCommentModal({
  open,
  onClose,
  onSubmit,
}: PaymentCommentModalProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Comment Required</DialogTitle>
          <DialogDescription>
            Please provide details about the payment status (e.g., NCND, Cheque, etc.)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="payment-comment">Payment Notes</Label>
            <Textarea
              id="payment-comment"
              data-testid="input-payment-comment"
              placeholder="Enter payment details..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
            onClick={handleSubmit} 
            disabled={!comment.trim()}
            data-testid="button-submit-comment"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
