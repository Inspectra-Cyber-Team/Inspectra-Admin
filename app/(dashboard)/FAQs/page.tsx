import { Suspense } from 'react'
import { FAQsTable } from "@/components/faqs/faqs-table"
import { SearchForm } from "@/components/faqs/search-form"
import { CreatefaqButton } from "@/components/faqs/create-faq-button"

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
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="flex-1 ">
          <div className="flex justify-between items-center mb-6">
            <Suspense fallback={<div>Loading...</div>}>
              <SearchForm initialQuery={query} />
            </Suspense>
            <CreatefaqButton />
          </div>

          <Suspense fallback={<div>Loading users...</div>}>
            <FAQsTable query={query} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
