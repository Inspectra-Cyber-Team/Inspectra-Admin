import { Suspense } from 'react'
import { DocumentsTable } from "@/components/document/doc-table"
import { SearchForm } from "@/components/document/search-form"
import { CreateDocButton } from "@/components/document/create-doc-button"

type PageProps = {
  searchParams: Promise<{ q?: string | undefined }>;
}


export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams; // Await the promise
  const query = params?.q;

  return (
    <div>
      {/* Main Content */}
      <main className="flex-1 space-y-4 px-8 ">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Document</h2>
        </div>

        <div className="flex-1 ">
          <div className="flex justify-between items-center mb-6">
            <Suspense fallback={<div>Loading...</div>}>
              <SearchForm initialQuery={query} />
            </Suspense>
            <CreateDocButton />
          </div>

          <Suspense fallback={<div>Loading users...</div>}>
            <DocumentsTable query={query} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

