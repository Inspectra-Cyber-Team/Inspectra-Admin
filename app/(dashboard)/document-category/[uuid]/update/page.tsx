import DocumentCategoryUpdateComponent from '@/components/document/category/UpdateDocumentCategoryComponent';
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Document Category Update',
  description: 'Document Category Update',
}

export default async function page({ params }: { params: Promise<{ uuid: string }> }) {

    const resolvedParams = await params; 

    const uuid = resolvedParams?.uuid;

  return (
    <section>
        <DocumentCategoryUpdateComponent uuid={uuid} />
    </section>
  )
}
