
'use client'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recent } from "@/components/overview/RecentTraffic";
import { FolderKanban, BookOpen, MessageSquare, UsersIcon } from "lucide-react";
import { StatCard } from "@/components/overview/CardStat";
import { Overview } from "@/components/overview/Overview";
import { useCountBlogQuery } from '@/redux/service/blog';
import { useCountUserQuery } from '@/redux/service/user';
import { useCountFeedbackQuery } from '@/redux/service/feedback';
import { useCountProjectQuery } from '@/redux/service/project';
import { DataItem } from '@/types/overviewPieType';

export default function PageComponent() {

  const { data:blogCount, isLoading:blogLoading } = useCountBlogQuery({});

  const { data:userCount, isLoading:userLoading } = useCountUserQuery({});

  const { data:feedbackCount, isLoading:feedbackLoading } = useCountFeedbackQuery({});

  const {data:projectCount, isLoading:projectLoading} = useCountProjectQuery({});

  if (blogLoading || userLoading || feedbackLoading || projectLoading) {
    return <div className="loader-container">
      <div className="loader"></div>
    </div>;
  }



  //handle this for pass value to component instead to see data 
  const data: DataItem[] = [
    { name: "Blog", value: blogCount?.data || 0 },
    { name: "Feedback", value: feedbackCount?.data || 0 },
    { name: "User", value: userCount?.data || 0 },
    { name: "Project", value: projectCount?.data || 0 },
  ];

  return (
    <section className="flex-1 space-y-4 px-8">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={userCount?.data || 0}
        change="+20.1% from last month"
        icon={UsersIcon}
      />
      <StatCard
        title="Total Projects"
        value={projectCount?.data || 0}
        change="+25.0% from last month"
        icon={FolderKanban}
      />
      <StatCard
        title="Total Blog"
        value={blogCount?.data || 0}
        change="+5.8% from last month"
        icon={BookOpen}
      />
      <StatCard
        title="Total Feedback"
        value={feedbackCount?.data || 0}	
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
          <Recent data={data}/>
        </CardContent>
      </Card>
    </div>
  </section>
  )
}
