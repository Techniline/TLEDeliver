import { useState } from 'react';
import RejectionReasonModal from '../RejectionReasonModal';
import { Button } from '@/components/ui/button';

export default function RejectionReasonModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="destructive" onClick={() => setOpen(true)} data-testid="button-open-modal">
        Reject Request
      </Button>
      <RejectionReasonModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(reason) => console.log('Rejection reason:', reason)}
        deliveryOrderNumber="DO/12345678"
      />
    </div>
  );
}
