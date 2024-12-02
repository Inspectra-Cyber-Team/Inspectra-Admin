"use client";

import * as React from "react";
import {
  AudioWaveform,
  BlocksIcon,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "inspectra",
    email: "inspeactra@example.com",
    avatar: "/avatars/shadcn.jpg",
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
      url: "#",
      icon: BlocksIcon,
      items: [
        {
          title: "Overview",
          url: "/",
        },
      ]
    },
    {
      title: "Management",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Project",
          url: "/project",
        },
        {
          title: "Document",
          url: "document",
        },
        {
          title: "Blog",
          url: "/blog",
        },
        {
          title: "Feedback",
          url: "/feedback",
        },
        {
          title: "FAQs",
          url: "/FAQs",
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "User",
          url: "/user",
        },
        {
          title: "Admin",
          url: "/admin",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
