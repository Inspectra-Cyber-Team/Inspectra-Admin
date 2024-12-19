
'use client'

import { SetStateAction, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentsTable } from '@/components/document/DocTable'
import { DocumentCategoryTable } from '@/components/document/category/DocumentCategoryTable'

export default function Page() {

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
    router.push(`/document?tab=${value}`, { }) // Update URL without full reload
  }

  return (
    <div className="flex-1 space-y-4 px-8 ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Document</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className='mb-6'>
          <TabsTrigger value="documenr-category">Document Category</TabsTrigger>
          <TabsTrigger value="document">Document</TabsTrigger>
        </TabsList>

        <TabsContent value="documenr-category">
          <DocumentCategoryTable/>
          </TabsContent>

        <TabsContent value="document">
        <DocumentsTable />
        </TabsContent>

  
      </Tabs>
    </div>
  )
}
