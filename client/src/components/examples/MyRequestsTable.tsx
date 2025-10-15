import MyRequestsTable from '../MyRequestsTable';

export default function MyRequestsTableExample() {
  const mockRequests = [
    {
      id: "1",
      doNumber: "DO/12345678",
      customerName: "Ahmed Al-Mansoori",
      driverName: "Mohammed Ali",
      timeSlot: "10:30 AM - 11:30 AM",
      status: "Delivered" as const,
    },
    {
      id: "2",
      doNumber: "DO/87654321",
      customerName: "Sara Ibrahim",
      driverName: "Khalid Hassan",
      timeSlot: "2:30 PM - 3:30 PM",
      status: "Approved" as const,
    },
    {
      id: "3",
      doNumber: "DO/11223344",
      customerName: "Omar Abdullah",
      driverName: "",
      timeSlot: "4:30 PM - 5:30 PM",
      status: "Pending" as const,
    },
    {
      id: "4",
      doNumber: "DO/99887766",
      customerName: "Fatima Rashid",
      driverName: "",
      timeSlot: "11:30 AM - 12:30 PM",
      status: "Rejected" as const,
      rejectionReason: "Incomplete delivery address - missing apartment number and floor details",
    },
  ];

  return <MyRequestsTable requests={mockRequests} />;
}
