"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const notifications = [
  {
    id: 1,
    title: "Blog Request",
    description: "You have a new blog request from Phiv Lyhou",
    time: "5m ago",
  },
  {
    id: 2,
    title: "Blog Request",
    description: "You have a new blog request from Naikim",
    time: "10m ago",
  },
  {
    id: 3,
    title: "Blog Request",
    description: "You have a new blog request from Votey",
    time: "1h ago",
  },
];

export function Notification() {
  const [unreadCount, setUnreadCount] = React.useState(notifications.length);

  const router = useRouter();

  const handleNotificationClick = () => {
    router.push("/blog?tab=blog-request");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-1 h-4 w-4 rounded-full bg-destructive text-center text-xs font-bold text-destructive-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">Notifications</h3>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-4 cursor-pointer"
                  onClick={handleNotificationClick} // Routes to the "Blog Request" tab
                >
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="link"
              className="w-full mt-4 text-secondary"
              onClick={() => setUnreadCount(0)}
            >
              Mark all as read
            </Button>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
