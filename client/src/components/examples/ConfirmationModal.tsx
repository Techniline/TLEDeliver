import { useState } from 'react';
import ConfirmationModal from '../ConfirmationModal';
import { Button } from '@/components/ui/button';

export default function ConfirmationModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)} data-testid="button-open-modal">
        Show Confirmation
      </Button>
      <ConfirmationModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
