'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from '@/components/blog/OverviewTab'
import { CreateTab } from '@/components/blog/CreateTab'
import { ReportTab } from '@/components/blog/ReportTab'
import { BlogRequestTab } from '@/components/blog/BlogRequestTab'

export default function BlogDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="p-6">
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <span>Dashboard</span>
        <span className="mx-2">/</span>
        <span className="text-foreground">Blog</span>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="blog-request">Blog Request</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="create">
          <CreateTab />
        </TabsContent>

        <TabsContent value="report">
          <ReportTab />
        </TabsContent>

        <TabsContent value="blog-request">
          <BlogRequestTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

