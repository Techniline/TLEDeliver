import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Delivery, Driver } from "@shared/schema";

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
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: deliveries = [] } = useQuery<Delivery[]>({
    queryKey: ["/api/deliveries"],
  });

  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ["/api/drivers"],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/deliveries/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "Approved" }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Request Approved",
        description: "Delivery request has been approved successfully.",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return await apiRequest(`/api/deliveries/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "Rejected", rejectionReason: reason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Request Rejected",
        description: "Delivery request has been rejected.",
        variant: "destructive",
      });
    },
  });

  const assignDriverMutation = useMutation({
    mutationFn: async ({ id, driverName }: { id: string; driverName: string }) => {
      return await apiRequest(`/api/deliveries/${id}/driver`, {
        method: "PATCH",
        body: JSON.stringify({ driverName }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deliveries"] });
      toast({
        title: "Driver Assigned",
        description: "Driver has been assigned to the delivery.",
      });
    },
  });

  const mockSlots = deliveries
    .filter((d) => d.status === "Approved" || d.status === "Pending")
    .slice(0, 3)
    .map((d) => ({
      time: d.timeSlot.split(" - ")[0],
      events: [
        {
          id: d.id,
          doNumber: d.doNumber,
          customerName: d.customerName,
          status: d.status as "Pending" | "Approved" | "Rejected" | "Delivered",
          driverName: d.driverName || undefined,
        },
      ],
    }));

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
                  {stats && <DashboardSummaryCards data={stats} />}
                  <PendingRequestsTable
                    requests={deliveries}
                    drivers={drivers.map((d) => d.name)}
                    onApprove={(id) => approveMutation.mutate(id)}
                    onReject={(id, reason) => rejectMutation.mutate({ id, reason })}
                    onAssignDriver={(id, driverName) =>
                      assignDriverMutation.mutate({ id, driverName })
                    }
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
                    requests={deliveries}
                    drivers={drivers.map((d) => d.name)}
                    onApprove={(id) => approveMutation.mutate(id)}
                    onReject={(id, reason) => rejectMutation.mutate({ id, reason })}
                    onAssignDriver={(id, driverName) =>
                      assignDriverMutation.mutate({ id, driverName })
                    }
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
