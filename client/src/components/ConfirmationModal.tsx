import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function ConfirmationModal({
  open,
  onClose,
  title = "Request Submitted Successfully",
  description = "Your delivery request has been sent to the warehouse for approval.",
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} data-testid="button-close">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
