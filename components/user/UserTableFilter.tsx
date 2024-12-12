"use client"

import * as React from "react"
import { ChevronDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserDetail } from "@/types/UserDetail"

interface Column {
  id: keyof UserDetail
  label: string
  checked: boolean
}

interface UserTableFilterProps {
  onFilterChange: (value: string) => void
  onColumnsChange: (columns: Column[]) => void
}

export function UserTableFilter({ onFilterChange, onColumnsChange }: UserTableFilterProps) {
  const [filterValue, setFilterValue] = React.useState("")
  const [columns, setColumns] = React.useState<Column[]>([
    { id: "name", label: "Username", checked: true },
    { id: "email", label: "Email", checked: true },
    { id: "createdAt", label: "Created At", checked: true },
    { id: "isActive", label: "Status", checked: true },
  ])

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    onFilterChange(value);
  };

  const toggleColumn = (columnId: keyof UserDetail) => {
    const updatedColumns = columns.map(column => 
      column.id === columnId 
        ? { ...column, checked: !column.checked }
        : column
    )
    setColumns(updatedColumns)
    onColumnsChange(updatedColumns)
  }

  return (
    <div className="flex items-center justify-between gap-4 w-full max-w-[1200px]">
      <div className="flex items-center flex-1">
        <Input
          type="text"
          placeholder="Filter users..."
          value={filterValue}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="max-w-sm  border-0 ring-1 ring-input bg-card"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-card border-0 ring-1 ring-input">
            Columns
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.checked}
              onCheckedChange={() => toggleColumn(column.id)}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

