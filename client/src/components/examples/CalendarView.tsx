import CalendarView from '../CalendarView';

export default function CalendarViewExample() {
  const mockSlots = [
    {
      time: "10:30 AM",
      events: [
        {
          id: "1",
          doNumber: "DO/12345678",
          customerName: "Ahmed Al-Mansoori",
          status: "Approved" as const,
          driverName: "Mohammed Ali",
        },
      ],
    },
    {
      time: "2:30 PM",
      events: [],
    },
    {
      time: "4:30 PM",
      events: [
        {
          id: "2",
          doNumber: "DO/87654321",
          customerName: "Sara Ibrahim",
          status: "Pending" as const,
        },
      ],
    },
  ];

  return <CalendarView slots={mockSlots} onBlockSlot={(time) => console.log('Block slot:', time)} />;
}
