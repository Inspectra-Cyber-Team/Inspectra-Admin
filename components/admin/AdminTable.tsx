"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminDetail } from "@/types/Admin";
import { convertToDayMonthYear } from "@/lib/utils";
import { AdminTableFilter } from "@/components/admin/AdminTableFilter";
import { useGetAdminQuery } from "@/redux/service/admin";

const ITEMS_PER_PAGE = 10;

type Column = {
  id: keyof AdminDetail;
  label: string;
  checked: boolean;
}

export function AdminTable() {



  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Column[]>([
    { id: "name", label: "Username", checked: true },
    { id: "email", label: "Email", checked: true },
    { id: "createdAt", label: "Created At", checked: true },
  ]);

  const {data,isLoading,isError} = useGetAdminQuery({page:currentPage-1,size:ITEMS_PER_PAGE});


  const admins = data?.content || [];

  const filteredAdmins = filterValue
    ? admins.filter((admin: AdminDetail) =>
        Object.entries(admin).some(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([key, value]) =>
            value &&
            typeof value === "string" &&
            value.toLowerCase().includes(filterValue.toLowerCase())
        )
      )
    : admins;

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE);
  const totalAdmins = filteredAdmins.length;

  const handleSelectAll = () => {
    setSelectedAdmins(
      selectedAdmins.length === admins.length
        ? []
        : admins.map((admin: { uuid: unknown }) => admin.uuid)
    );
  };

  const handleSelectAdmin = (uuid: string) => {
    setSelectedAdmins((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handleColumnsChange = (columns: Column[]) => {
    setVisibleColumns(columns);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading admins...</div>;
  }

  if (isError) {
    return <div>Error loading admins. Please try again later.</div>;
  }

  return (
    <div className="space-y-4">
      <AdminTableFilter
        onFilterChange={handleFilterChange}
        onColumnsChange={handleColumnsChange}
      />
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedAdmins.length === admins.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Image</TableHead>
              {visibleColumns.map(
                (column) =>
                  column.checked && (
                    <TableHead key={column.id}>{column.label}</TableHead>
                  )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAdmins.map((admin: AdminDetail, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedAdmins.includes(admin?.uuid)}
                    onCheckedChange={() => handleSelectAdmin(admin?.uuid)}
                  />
                </TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={admin?.profile || "NA"}
                      alt={admin?.name || "Avatar"}
                    />
                    <AvatarFallback>{admin?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                {visibleColumns.map(
                  (column) =>
                    column.checked && (
                      <TableCell key={column.id}>
                        {column.id === "createdAt"
                          ? convertToDayMonthYear(admin[column.id])
                          : admin[column.id]}
                      </TableCell>
                    )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-2 border-t flex-wrap">
          <div className="text-sm text-muted-foreground">
            Rows per page: {ITEMS_PER_PAGE}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              {Math.min(
                currentPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE + 1,
                totalAdmins
              )}{" "}
              - {Math.min(currentPage * ITEMS_PER_PAGE, totalAdmins)} of{" "}
              {totalAdmins}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
