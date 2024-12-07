"use client";

import { useState, useEffect } from "react";
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

type User = {
  uuid: string;
  name: string;
  email: string;
  createdAt: string;
  image: string;
  status: "active" | "inactive" | "pending";
};

const ITEMS_PER_PAGE = 10;

async function fetchUsers(query: string): Promise<User[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allUsers: User[] = [
    {
      uuid: "1",
      name: "Leang Helen",
      email: "helen.leang@gmail.com",
      createdAt: "Nov 21, 2024",
      image: "/placeholder.svg",
      status: "active",
    },
    {
      uuid: "2",
      name: "Hom Pheakakvotey",
      email: "pheakakvatey@gmail.com",
      createdAt: "Nov 21, 2024",
      image: "/placeholder.svg",
      status: "inactive",
    },
    {
      uuid: "3",
      name: "Phiv Lyhou",
      email: "lyhou.phiv@gmail.com",
      createdAt: "Nov 21, 2024",
      image: "/placeholder.svg",
      status: "pending",
    },
    {
      uuid: "4",
      name: "PhalPhea Pheakdey",
      email: "pheakdey@gmail.com",
      createdAt: "Nov 21, 2024",
      image: "/placeholder.svg",
      status: "active",
    },
    {
      uuid: "5",
      name: "Ing Davann",
      email: "davann@gmail.com",
      createdAt: "Nov 21, 2024",
      image: "/placeholder.svg",
      status: "active",
    },
  ];

  return !query
    ? allUsers
    : allUsers.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
}

export function UsersTable({ query = "" }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<User | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      const fetchedUsers = await fetchUsers(query);
      setUsers(fetchedUsers);
      setCurrentPage(1);
      setSelectedUsers([]);
      setIsLoading(false);
    };

    loadUsers();
  }, [query]);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === currentUsers.length
        ? []
        : currentUsers.map((user) => user.uuid)
    );
  };

  const handleSelectUser = (uuid: string) => {
    setSelectedUsers((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleDelete = () => {
    if (selectedItem) {
      setUsers((prev) =>
        prev.filter((user) => user.uuid !== selectedItem.uuid)
      );
    }
    setDeleteModalOpen(false);
  };

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case "inactive":
        return <Badge className="bg-red-500 text-white">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedUsers.length === currentUsers.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.uuid}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.uuid)}
                  onCheckedChange={() => handleSelectUser(user.uuid)}
                />
              </TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                        setSelectedItem(user);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View User Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div>
                <strong>Name:</strong> {selectedItem.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedItem.email}
              </div>
              <div>
                <strong>Status:</strong> {selectedItem.status}
              </div>
              <div>
                <strong>Created At:</strong> {selectedItem.createdAt}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">Are you sure?</DialogTitle>
            <DialogDescription className="text-[#888888] text-base my-2">
              This action cannot be undone. The user will be block.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} >Block</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-muted-foreground">
          Rows per page: {ITEMS_PER_PAGE}
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span>
            {startIndex + 1}-{Math.min(endIndex, users.length)} of{" "}
            {users.length}
          </span>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
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
