import DocumentCategoryDetails from '@/components/document/category/DocumentCategoryDetails';
import React from 'react'
import { Metadata } from 'next';

export const config: Metadata = {
  title: 'Document Category Details',
  description: 'Document Category Details',
}

export default async function page({ params }: { params: Promise<{ uuid: string }> }) {
  
  const resolvedParams = await params; 

  const uuid = resolvedParams?.uuid;

  return (
    <section>
      <DocumentCategoryDetails uuid={uuid} />
    </section>
  )
}
