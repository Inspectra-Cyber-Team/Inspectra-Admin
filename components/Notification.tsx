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
import { useGetAllBlogUnVerifiedQuery } from "@/redux/service/blog";
import { formatDistanceToNow } from "date-fns";

export function Notification() {
  const router = useRouter();

  const { data: blogData } = useGetAllBlogUnVerifiedQuery({
    page: 0,
    pageSize: 25,
  });

  // Local state to manage notifications
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    // Initialize notifications and unread count
    const unverifiedBlogs =
      blogData?.content?.filter((blog: any) => blog?.isVerified === false) ||
      [];
    setNotifications(unverifiedBlogs);
    setUnreadCount(unverifiedBlogs.length);
  }, [blogData]);

  const handleNotificationClick = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.uuid === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => prev - 1);
    router.push("/blog?tab=blog-request");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative" aria-label="Notifications">
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
              {notifications.length > 0 ? (
                notifications.map((notification: any) => (
                  <div
                    key={notification.uuid}
                    className={`flex items-start space-x-4 cursor-pointer ${
                      notification.read ? "opacity-50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification.uuid)}
                  >
                    <div
                      className={`h-2 w-2 mt-2 rounded-full ${
                        notification.read ? "bg-gray-400" : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Blog Request</p>
                      <p className="text-sm text-muted-foreground">
                        You have a new blog request from{" "}
                        {notification?.user?.firstName +
                          " " +
                          notification?.user?.lastName || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification?.createdAt
                          ? formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              }
                            )
                          : "Just now"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No new notifications.
                </p>
              )}
            </div>
            {notifications.length > 0 && (
              <Button
                variant="link"
                className="w-full mt-4 text-secondary"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
