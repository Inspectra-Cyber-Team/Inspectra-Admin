import { Suspense } from 'react'
import { DocumentsTable } from "@/components/document/DocTable"

export default async function Page() {

  return (
    <div>
      {/* Main Content */}
      <main className="flex-1 space-y-4 px-8 ">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Document</h2>
        </div>

        <div className="flex-1 ">

          <Suspense fallback={<div>Loading document...</div>}>
            <DocumentsTable />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

