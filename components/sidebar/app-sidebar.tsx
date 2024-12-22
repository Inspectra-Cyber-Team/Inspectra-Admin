"use client";

import * as React from "react";
import {
  AudioWaveform,
  BlocksIcon,
  Command,
  GalleryVerticalEnd,
  Settings2Icon,
  UserCogIcon,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useGetUserDetailQuery } from "@/redux/service/user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userUUID, setUserUUID] = React.useState("");

  const { data: userData } = useGetUserDetailQuery({ uuid: userUUID });

  React.useEffect(() => {
    const storedUUID = localStorage.getItem("userUUID");
    if (storedUUID) {
      setUserUUID(storedUUID);
    }
  }, []);

  // This is sample data.
  const data = {
    user: {
      name: userData?.data.name ?? "inspectra",
      email: userData?.data.email ?? "inspeactra@example.com",
      avatar: userData?.data.profile ?? "/logo.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        href: "#",
        icon: BlocksIcon,
        items: [
          {
            title: "Overview",
            href: "/",
          },
        ],
      },
      {
        title: "Management",
        href: "#",
        icon: Settings2Icon,
        items: [
          {
            title: "Project",
            href: "/project",
          },
          {
            title: "Document",
            href: "document",
          },
          {
            title: "Blog",
            href: "/blog",
          },
          {
            title: "Feedback",
            href: "/feedback",
          },
          {
            title: "FAQs",
            href: "/FAQs",
          },
        ],
      },
      {
        title: "User Management",
        href: "#",
        icon: UserCogIcon,
        items: [
          {
            title: "User",
            href: "/user",
          },
          {
            title: "Admin",
            href: "/admin",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props} className="bg-card border-none">
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
