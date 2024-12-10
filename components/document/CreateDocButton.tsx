"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { CreateDocModal } from '@/components/document/ModalCreateDoc'

export function CreateDocButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create
      </Button>
      <CreateDocModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

