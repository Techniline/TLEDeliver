import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-3 flex-wrap">
      <StatusBadge status="Pending" />
      <StatusBadge status="Approved" />
      <StatusBadge status="Rejected" />
      <StatusBadge status="Delivered" />
    </div>
  );
}
