import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, UserCircle, Shield } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">DeliveryFlow</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Welcome to DeliveryFlow</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Internal delivery management system for Techniline/MusicMajlis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover-elevate transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <UserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">User Dashboard</CardTitle>
              <CardDescription>
                Submit delivery requests and track their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/user">
                <Button className="w-full" size="lg" data-testid="button-user-dashboard">
                  Go to User Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription>
                Approve requests, manage slots, and assign drivers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button className="w-full" size="lg" data-testid="button-admin-dashboard">
                  Go to Admin Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
