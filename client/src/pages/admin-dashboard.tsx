import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardSummaryCards from "@/components/DashboardSummaryCards";
import CalendarView from "@/components/CalendarView";
import PendingRequestsTable from "@/components/PendingRequestsTable";
import ExportCSVButton from "@/components/ExportCSVButton";
import ThemeToggle from "@/components/ThemeToggle";
import { Calendar, ClipboardList, FileText, Settings, Truck } from "lucide-react";
import { useLocation } from "wouter";

function AppSidebar() {
  const [location, setLocation] = useLocation();

  const menuItems = [
    { title: "Overview", icon: ClipboardList, path: "/admin" },
    { title: "Calendar", icon: Calendar, path: "/admin/calendar" },
    { title: "Pending Requests", icon: FileText, path: "/admin/requests" },
    { title: "Reports", icon: FileText, path: "/admin/reports" },
    { title: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-4 py-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold">DeliveryFlow</span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => setLocation(item.path)}
                    isActive={location === item.path}
                    data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminDashboard() {
  const [location] = useLocation();

  const mockSummary = {
    todaysDeliveries: 24,
    pendingApprovals: 8,
    blockedSlots: 3,
    rejections: 5,
  };

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

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between gap-4 p-4 border-b bg-card">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-3">
              <ExportCSVButton />
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {(location === "/admin" || location === "/admin/") && (
                <>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Admin Overview</h2>
                    <p className="text-muted-foreground">
                      Manage delivery requests and monitor operations
                    </p>
                  </div>
                  <DashboardSummaryCards data={mockSummary} />
                  <PendingRequestsTable
                    requests={mockRequests}
                    drivers={mockDrivers}
                    onApprove={(id) => console.log("Approved:", id)}
                    onReject={(id, reason) => console.log("Rejected:", id, reason)}
                    onAssignDriver={(id, driver) => console.log("Assigned:", id, driver)}
                  />
                </>
              )}

              {location === "/admin/calendar" && (
                <>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Delivery Calendar</h2>
                    <p className="text-muted-foreground">
                      View and manage delivery time slots
                    </p>
                  </div>
                  <CalendarView
                    slots={mockSlots}
                    onBlockSlot={(time) => console.log("Block slot:", time)}
                  />
                </>
              )}

              {location === "/admin/requests" && (
                <>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Pending Requests</h2>
                    <p className="text-muted-foreground">
                      Review and approve delivery requests
                    </p>
                  </div>
                  <PendingRequestsTable
                    requests={mockRequests}
                    drivers={mockDrivers}
                    onApprove={(id) => console.log("Approved:", id)}
                    onReject={(id, reason) => console.log("Rejected:", id, reason)}
                    onAssignDriver={(id, driver) => console.log("Assigned:", id, driver)}
                  />
                </>
              )}

              {location === "/admin/reports" && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold mb-2">Reports</h2>
                  <p className="text-muted-foreground">Export and analyze delivery data</p>
                </div>
              )}

              {location === "/admin/settings" && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold mb-2">Settings</h2>
                  <p className="text-muted-foreground">Configure system preferences</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
