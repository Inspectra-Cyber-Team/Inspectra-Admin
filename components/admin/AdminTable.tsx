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
import { useGetAllAdminQuery } from "@/redux/service/admin";
import { AdminDetail } from "@/types/Admin";
import { convertToDayMonthYear } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

export function AdminTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  const { data: adminData, isLoading, isError } = useGetAllAdminQuery({
    page: currentPage - 1,
    pageSize: ITEMS_PER_PAGE,
  });

  const admins = adminData?.content || [];
  const totalPages = adminData?.totalPages || 1;
  const totalAdmins = adminData?.totalElements || 0;

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

  if (isLoading) {
    return <div>Loading admins...</div>;
  }

  if (isError) {
    return <div>Error loading admins. Please try again later.</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedAdmins.length === admins.length }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>UserName</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {admins?.map((admin: AdminDetail, index: number) => (
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
                    src={admin?.profile || ""}
                    alt={admin?.name || "Avatar"}
                    className="object-cover"
                  />
                  <AvatarFallback>{admin?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{admin?.name}</TableCell>
              <TableCell>{convertToDayMonthYear(admin?.createdAt)}</TableCell>
              <TableCell>{admin?.email}</TableCell>
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
            {Math.min(currentPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE + 1, totalAdmins)} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalAdmins)} of {totalAdmins}
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
  );
}
