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
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileWarningIcon,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBlockUserMutation, useGetAllUserQuery } from "@/redux/service/user";
import { UserDetail } from "@/types/UserDetail";
import { convertToDayMonthYear } from "@/lib/utils";
import { UserTableFilter } from "./UserTableFilter";


const ITEMS_PER_PAGE = 10;

interface Column {
  id: keyof UserDetail;
  label: string;
  checked: boolean;
}

export function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserDetail | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Column[]>([
    { id: "name", label: "Username", checked: true },
    { id: "email", label: "Email", checked: true },
    { id: "createdAt", label: "Created At", checked: true },
    { id: "isActive", label: "Status", checked: true },
  ]);

  const {
    data: userData,
    isLoading,
    isError,
  } = useGetAllUserQuery({
    page: currentPage - 1,
    pageSize: ITEMS_PER_PAGE,
  });

  const users = userData?.content || [];

  const [blogUser] = useBlockUserMutation();
  const [uuid, setUuid] = useState<string>("");

  const handleBlockUser = async (uuid: string) => {
    try {
      await blogUser({ uuid });

      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to block user:", error);
    }
  };

  const filteredUsers = filterValue
    ? users.filter((user: UserDetail) =>
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(user).some(
          ([ value]) =>
            value &&
            typeof value === "string" &&
            value.toLowerCase().includes(filterValue.toLowerCase())
        )
      )
    : users;

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const totalUsers = filteredUsers.length;

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === paginatedUsers.length
        ? []
        : paginatedUsers.map((user: { uuid: unknown }) => user.uuid)
    );
  };

  const handleSelectUser = (uuid: string) => {
    setSelectedUsers((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const getStatusBadge = (status: UserDetail["isActive"]) => {
    switch (status) {
      case true:
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case false:
        return <Badge className="bg-red-500 text-white">Inactive</Badge>;
      default:
        return null;
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handleColumnsChange = (columns: Column[]) => {
    setVisibleColumns(columns);
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return <div>Error loading users. Please try again later.</div>;
  }

  return (
    <div className="space-y-4">
      <UserTableFilter
        onFilterChange={handleFilterChange}
        onColumnsChange={handleColumnsChange}
      />
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === paginatedUsers.length}
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
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user: UserDetail, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user?.uuid)}
                    onCheckedChange={() => handleSelectUser(user?.uuid)}
                  />
                </TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user?.profile} alt={user?.name} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                {visibleColumns.map(
                  (column) =>
                    column.checked && (
                      <TableCell key={column.id}>
                        {column.id === "createdAt"
                          ? convertToDayMonthYear(user[column.id])
                          : column.id === "isActive"
                          ? // Use the `getStatusBadge` function to display the badge
                            getStatusBadge(user[column.id])
                          : user[column.id]}
                      </TableCell>
                    )
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedItem(user);
                          setViewModalOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setUuid(user?.uuid);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <FileWarningIcon className="mr-2 h-4 w-4" /> Block
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* View Modal */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
            <DialogHeader>
              <DialogTitle>View User Details</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="grid gap-4 py-4">
                <div>
                  <strong>First Name:</strong> {selectedItem.firstName}
                </div>
                <div>
                  <strong>Last Name:</strong> {selectedItem.lastName}
                </div>
                <div>
                  <strong>Username:</strong> {selectedItem.name}
                </div>
                <div>
                  <strong>Bio:</strong> {selectedItem.bio || "No bio yet"}
                </div>
                <div>
                  <strong>Email:</strong> {selectedItem.email}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  {getStatusBadge(selectedItem.isActive)}
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  {convertToDayMonthYear(selectedItem.createdAt)}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Block Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-foreground">
                Are you sure?
              </DialogTitle>
              <DialogDescription className="text-[#888888] text-base my-2">
                This action cannot be undone. The user will be block.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleBlockUser(uuid)}
              >
                Block
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
              {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)} of{" "}
              {totalUsers}
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
