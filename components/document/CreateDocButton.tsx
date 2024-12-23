"use client"


import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useRouter } from "next/navigation"


export function CreateDocButton() {

  const router = useRouter();

  return (
    <>
      <Button onClick={() => router.push("/document/create")} className="flex items-center">
        <Plus className="w-4 h-4 mr-2" />
        Create
      </Button>
      {/* <CreateDocModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
    </>
  )
}

