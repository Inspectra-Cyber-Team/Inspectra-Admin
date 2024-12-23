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
import { TopicType } from "@/types/Topic";
import { CreateTopic } from "./CreeateTopic";

interface Column {
  id: keyof TopicType;
  label: string;
  checked: boolean;
}

interface TopicTableFilterProps {
  onFilterChange: (value: string) => void;
  onColumnsChange: (columns: Column[]) => void;
}

export function TopicTableFilter({
  onFilterChange,
  onColumnsChange,
}: TopicTableFilterProps) {
  const [filterValue, setFilterValue] = React.useState("");

  const [columns, setColumns] = React.useState<Column[]>([
    { id: "name", label: "Name", checked: true },
    { id: "createdAt", label: "Created At", checked: true },
  ]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterValue(value);
    onFilterChange(value);
  };

  const toggleColumn = React.useCallback(
    (columnId: keyof TopicType) => {
      const updatedColumns = columns.map((column) =>
        column.id === columnId
          ? { ...column, checked: !column.checked }
          : column
      );
      setColumns(updatedColumns);
      onColumnsChange(updatedColumns);
    },
    [columns, onColumnsChange] // dependencies
  );

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <div className="flex items-center flex-1">
        <Input
          type="text"
          placeholder="Filter topic..."
          value={filterValue}
          onChange={handleFilterChange}
          className="max-w-sm bg-card border-0 ring-1 ring-input"
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
              onCheckedChange={() => toggleColumn(column.id)}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateTopic />
    </div>
  );
}
