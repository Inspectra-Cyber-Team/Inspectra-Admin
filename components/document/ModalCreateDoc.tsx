"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CreateDocModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateDocModal({ isOpen, onClose }: CreateDocModalProps) {
  const [documentCategoryName, setdocumentCategoryName] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send a request to your API to create the user
    console.log('Creating Document:', { documentCategoryName, content })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
      <DialogHeader className="text-center">
        <DialogTitle className="text-center text-2xl font-semibold text-foreground">Create Document</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div>
          {/* Document Category Name Field */}
          <div className="grid gap-2 mb-4">
            <label
              htmlFor="Category Name"
              className="block text-sm font-medium text-foreground"
            >
              Category Name
            </label>
            <Input
              id="documentCategoryName"
              value={documentCategoryName}
              onChange={(e) => setdocumentCategoryName(e.target.value)}
              className="md:col-span-3 col-span-1 border rounded-md px-4 py-2 border-gray-300 text-sm"
              placeholder="Enter category name"
            />
          </div>

          {/* Document Title Field */}
          <div className="grid gap-2 mb-4">
            <label
              htmlFor="Title"
              className="block text-sm font-medium text-foreground"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="md:col-span-3 col-span-1 border border-gray-300 rounded-md px-4 py-2 "
              placeholder="Enter title"
            />
          </div>

          {/* Document Content Field */}
          <div className="grid gap-2 mb-4">
            <label
              htmlFor="Content"
              className="block text-sm font-medium text-foreground"
            >
              Content
            </label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="md:col-span-3 col-span-1 border border-gray-300 rounded-md px-4 py-2 "
              placeholder="Enter Content"
            />
          </div>

        </div>
  
        <DialogFooter className="text-center">
          <Button
            type="submit"
            className=" px-6 py-2 rounded-md "
          >
            Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>  
  )
}

