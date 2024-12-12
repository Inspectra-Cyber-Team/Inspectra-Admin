import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Recent } from "@/components/overview/RecentTraffic";
import { FolderKanban, BookOpen, MessageSquare, UsersIcon } from "lucide-react";
import { StatCard } from "@/components/overview/CardStat";
import { Overview } from "@/components/overview/Overview";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 space-y-4 px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value="8,678"
            change="+20.1% from last month"
            icon={UsersIcon}
          />
          <StatCard
            title="Total Projects"
            value="45,678"
            change="+25.0% from last month"
            icon={FolderKanban}
          />
          <StatCard
            title="Total Blog"
            value="256"
            change="+5.8% from last month"
            icon={BookOpen}
          />
          <StatCard
            title="Total Feedback"
            value="145"
            change="+5.9% from last month"
            icon={MessageSquare}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-none shadow-none">
            <CardHeader>
              <CardTitle>Traffic by month</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3 border-none shadow-none">
            <CardHeader>
              <CardTitle>Overall Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <Recent />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
