"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [firstname, setFirstName] = useState('')
  const [lastname, setLastName] = useState('')
  const [username, setUserame] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [comfirmpassword, setComfirmpassword] = useState('')
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send a request to your API to create the user
    console.log('Creating admin:')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="max-w-lg mx-auto p-6">
    <DialogHeader className="text-center text-2xl font-semibold mb-2">
      <DialogTitle>
        Create New Admin
      </DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstname" className='text-sm font-medium mb-2 block'>
            First Name
          </label>
          <Input
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            className="w-full rounded-lg p-4 text-sm"
          />
        </div>

        <div>
          <label htmlFor="lastname" className="text-sm font-medium mb-2 block">
            Last Name
          </label>
          <Input
            id="lastname"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            className="w-full rounded-lg p-4 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="username" className="text-sm font-medium mb-2 block">
          User
        </label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUserame(e.target.value)}
          placeholder="Enter username"
          className="w-full rounded-lg p-4 text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium mb-2 block">
          Email
        </label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full rounded-lg p-4 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="password" className="text-sm font-medium mb-2 block">
            Password
          </label>
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            type="password"
            className="w-full rounded-lg p-4 text-sm"
          />
        </div>
        <div>
          <label htmlFor="comfirmpassword" className="text-sm font-medium mb-2 block">
            Confirm Password
          </label>
          <Input
            id="comfirmpassword"
            value={comfirmpassword}
            onChange={(e) => setComfirmpassword(e.target.value)}
            placeholder="Confirm password"
            type="password"
            className="w-full rounded-lg p-4 text-sm"
          />
        </div>
      </div>

      <DialogFooter className="flex justify-end">
        <Button
          type="submit"
        >
          Create Admin
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
  )
}

