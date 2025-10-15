import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeliveryRequestForm from "@/components/DeliveryRequestForm";
import MyRequestsTable from "@/components/MyRequestsTable";
import ThemeToggle from "@/components/ThemeToggle";
import { Truck } from "lucide-react";
import type { Delivery } from "@shared/schema";

export default function UserDashboard() {
  const { data: deliveries = [], isLoading } = useQuery<Delivery[]>({
    queryKey: ["/api/deliveries"],
  });

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
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading requests...
              </div>
            ) : (
              <MyRequestsTable requests={deliveries} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
