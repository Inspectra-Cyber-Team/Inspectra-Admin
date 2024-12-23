'use client'
import { useGetDocumentCategoryQuery } from '@/redux/service/document';
import React from 'react'
import DOMPurify from 'dompurify';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


type DocumentCategoryDetailsProps = {
  readonly uuid: string;
}

export default function DocumentCategoryDetails({uuid}:DocumentCategoryDetailsProps) {

  const {data,isLoading} = useGetDocumentCategoryQuery({uuid:uuid});

  if(isLoading) return <div>Loading...</div>

  const handleGetDescription = (description: string) => {

    const cleanDescription = DOMPurify.sanitize(description); // Sanitize the input

    return { __html: cleanDescription }; // Return as inner HTML
  };



  return (
     
     <section className='flex-1 space-y-4 px-8 '>

       <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/document?tab=document-category">Document Category</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{data?.data?.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

      <section className='bg-card rounded-md h-full p-4'>
        <div className='flex flex-col space-y-4'>
          <div className='flex flex-col space-y-2'>
            <h1 className='text-md text-2xl font-semibold'>{data?.data?.name}</h1>
          </div>
          <div className='flex flex-col space-y-2'>
           {/* Render sanitized description */}
           <p
              className="text-sm"
              dangerouslySetInnerHTML={handleGetDescription(data?.data?.description || '')}
            />
          </div>
        </div>
        </section>
     </section>
  )
}
