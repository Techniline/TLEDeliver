import { useState } from 'react';
import PaymentCommentModal from '../PaymentCommentModal';
import { Button } from '@/components/ui/button';

export default function PaymentCommentModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)} data-testid="button-open-modal">
        Open Payment Comment Modal
      </Button>
      <PaymentCommentModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(comment) => console.log('Payment comment:', comment)}
      />
    </div>
  );
}
