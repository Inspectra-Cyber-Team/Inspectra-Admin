"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Report } from "@/types/Blog";

interface Column {
  id: keyof Report;
  label: string;
  checked: boolean;
}

interface BlogTableFilterProps {
  onFilterChange: (value: string) => void;
  onColumnsChange: (columns: Column[]) => void;
}

export function ReportFilter({
  onFilterChange,
  onColumnsChange,
}: BlogTableFilterProps) {
  const [filterValue, setFilterValue] = React.useState("");
  const [columns, setColumns] = React.useState<Column[]>([
    { id: "message", label: "Report Message", checked: true },
    { id: "createdAt", label: "Created At", checked: true },
  ]);

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    onFilterChange(value);
  };

  // Handle column toggle functionality
  const toggleColumn = (columnId: keyof Report) => {
    const updatedColumns = columns.map((column) =>
      column.id === columnId ? { ...column, checked: !column.checked } : column
    );
    setColumns(updatedColumns); // Update local columns state
    onColumnsChange(updatedColumns); // Notify parent component about column changes
  };

  return (
    <div className="flex items-center justify-between gap-4 w-full mb-4">
      <div className="flex items-center flex-1">
        <Input
          type="text"
          placeholder="Filter report message..."
          value={filterValue}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="max-w-sm border-0 ring-1 ring-input bg-card"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-card border-0 ring-1 ring-input"
          >
            Columns
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.checked}
              onSelect={() => toggleColumn(column.id)} // Corrected handler
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
