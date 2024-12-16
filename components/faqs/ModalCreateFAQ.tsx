"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CreatefaqModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreatefaqModal({ isOpen, onClose }: CreatefaqModalProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send a request to your API to create the user
    console.log('Creating faq:', { question, answer, status })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent  className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
        <DialogHeader>
          <DialogTitle>Create FAQ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 py-4">
            <div >
              <h2 className='text-sm font-medium mb-2 block'>Question</h2>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter Question"
                className="w-full rounded-lg p-4 text-sm "
              />
            </div>
            <div>
            <h2 className='text-sm font-medium mb-2 block'>Answer</h2>
              <Input
                id="answer"
                type="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter Answer"
                className="w-full rounded-lg p-4 text-sm "
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

