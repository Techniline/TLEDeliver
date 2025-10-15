import CargoTagBadge from '../CargoTagBadge';

export default function CargoTagBadgeExample() {
  return (
    <div className="flex gap-3 flex-wrap">
      <CargoTagBadge tag="FRAGILE" />
      <CargoTagBadge tag="ELECTRONICS" />
      <CargoTagBadge tag="HEAVY" />
    </div>
  );
}
