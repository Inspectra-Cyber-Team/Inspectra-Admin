'use client'

import { SetStateAction, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from '@/components/blog/OverviewTab'
import { CreateTab } from '@/components/blog/CreateTab'
import { ReportTab } from '@/components/blog/ReportTab'
import { BlogRequestTab } from '@/components/blog/BlogRequestTab'
import TopicComponent from '@/components/blog/TopicComponent'

export default function BlogDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Sync the tab with the `tab` query parameter
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  const handleTabChange = (value: SetStateAction<string>) => {
    setActiveTab(value)
    router.push(`/blog?tab=${value}`, { }) // Update URL without full reload
  }

  return (
    <div className="flex-1 space-y-4 px-8 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Blog</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className='mb-6'>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="topic">Topic</TabsTrigger>
          <TabsTrigger value="blog-request">Blog Request</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="create">
          <CreateTab />
        </TabsContent>

        <TabsContent value="topic">
          <TopicComponent/>
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
