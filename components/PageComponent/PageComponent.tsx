
'use client'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recent } from "@/components/overview/RecentTraffic";
import { FolderKanban, BookOpen, MessageSquare, UsersIcon } from "lucide-react";
import { StatCard } from "@/components/overview/CardStat";
import { Overview } from "@/components/overview/overview";
import { useCountBlogQuery } from '@/redux/service/blog';
import { useCountUserQuery } from '@/redux/service/user';
import { useCountFeedbackQuery } from '@/redux/service/feedback';
import { useCountProjectQuery } from '@/redux/service/project';

export default function PageComponent() {

  const { data:blogCount, error:BlogError, isLoading:blogLoading } = useCountBlogQuery({});

  const { data:userCount, error:UserError, isLoading:userLoading } = useCountUserQuery({});

  const { data:feedbackCount, error:FeedbackError, isLoading:feedbackLoading } = useCountFeedbackQuery({});

  const {data:projectCount, error:ProjectError, isLoading:projectLoading} = useCountProjectQuery({});

  if (blogLoading) {
    return <div>Loading...</div>
  }

    if (BlogError) {
        return <div>Error </div>
    }

    if (UserError) {
        return <div>Error </div>
    }

    if (userLoading) {
        return <div>Loading...</div>
    }

    if (FeedbackError) {
        return <div>Error </div>
    }

    if (feedbackLoading) {
        return <div>Loading...</div>
    }

    if (ProjectError) {
        return <div>Error </div>
    }

    if (projectLoading) {
        return <div>Loading...</div>
    }
    

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
          <Recent />
        </CardContent>
      </Card>
    </div>
  </section>
  )
}