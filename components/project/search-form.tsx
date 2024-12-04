"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"

export function SearchForm({ initialQuery = '' }) {
  const [search, setSearch] = useState(initialQuery)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setSearch(searchParams.get('q') || '')
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/?q=${encodeURIComponent(search)}`)
  }

  return (
    <form onSubmit={handleSubmit} className='rounded-md bg-card'>
      <Input
        type="search"
        placeholder="Type to search ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
    </form>
  )
}

