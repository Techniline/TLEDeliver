import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeliveryRequestForm from "@/components/DeliveryRequestForm";
import MyRequestsTable from "@/components/MyRequestsTable";
import ThemeToggle from "@/components/ThemeToggle";
import { Truck } from "lucide-react";

export default function UserDashboard() {
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">DeliveryFlow</h1>
                <p className="text-sm text-muted-foreground">User Dashboard</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="create" data-testid="tab-create">
              Create Request
            </TabsTrigger>
            <TabsTrigger value="requests" data-testid="tab-requests">
              My Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <DeliveryRequestForm />
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <MyRequestsTable requests={mockRequests} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
