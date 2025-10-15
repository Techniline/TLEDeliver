import PendingRequestsTable from '../PendingRequestsTable';

export default function PendingRequestsTableExample() {
  const mockRequests = [
    {
      id: "1",
      doNumber: "DO/12345678",
      customerName: "Ahmed Al-Mansoori",
      phone: "+971 50 123 4567",
      address: "Building 23, Floor 5, Apt 502, Al Barsha",
      cargoTag: "ELECTRONICS" as const,
      boxQuantity: 2,
      timeSlot: "10:30 AM - 11:30 AM",
      status: "Pending" as const,
      branch: "Al Shoala",
    },
    {
      id: "2",
      doNumber: "DO/87654321",
      customerName: "Sara Ibrahim",
      phone: "+971 55 987 6543",
      address: "Villa 15, Street 4, Dubai Marina",
      cargoTag: "FRAGILE" as const,
      boxQuantity: 1,
      timeSlot: "2:30 PM - 3:30 PM",
      status: "Approved" as const,
      branch: "MusicMajlis",
      driverName: "Mohammed Ali",
    },
  ];

  const mockDrivers = ["Mohammed Ali", "Khalid Hassan", "Ahmed Nasser", "Omar Rashid"];

  return (
    <PendingRequestsTable
      requests={mockRequests}
      drivers={mockDrivers}
      onApprove={(id) => console.log('Approved:', id)}
      onReject={(id, reason) => console.log('Rejected:', id, reason)}
      onAssignDriver={(id, driver) => console.log('Assigned:', id, driver)}
    />
  );
}
