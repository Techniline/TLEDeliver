import DashboardSummaryCards from '../DashboardSummaryCards';

export default function DashboardSummaryCardsExample() {
  const mockData = {
    todaysDeliveries: 24,
    pendingApprovals: 8,
    blockedSlots: 3,
    rejections: 5,
  };

  return <DashboardSummaryCards data={mockData} />;
}
