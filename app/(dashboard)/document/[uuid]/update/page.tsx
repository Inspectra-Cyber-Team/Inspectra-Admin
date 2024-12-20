import DocumentUpdateComponent from "@/components/document/DocumentUpdateComponent";
import React from "react";

export default async function page({ params }: { params: Promise<{ uuid: string }> }) {

  const resolvedParams = await params; 

  const uuid = resolvedParams?.uuid;

  return (
    <section>
      <DocumentUpdateComponent uuid={uuid} />
    </section>
  )
}
