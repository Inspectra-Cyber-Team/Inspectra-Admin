"use client";

import { CreateUserModal } from "@/components/user/user-detail-modal";
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
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  image: string;
  status: "active" | "inactive" | "pending";
}

const ITEMS_PER_PAGE = 10;

async function fetchUsers(query: string): Promise<User[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allUsers = [
    {
      id: 1,
      name: "Leang Helen",
      email: "helen.leang@gmail.com",
      createdAt: "Nov, 21, 2024",
      image: "/placeholder.svg",
      status: "active",
    },
    {
      id: 2,
      name: "Hom Pheakakvatey",
      email: "pheakakvatey@gmail.com",
      createdAt: "Nov, 21, 2024",
      image: "/placeholder.svg",
      status: "inactive",
    },
    {
      id: 3,
      name: "Phiv Lyhou",
      email: "lyhou.phiv@gmail.com",
      createdAt: "Nov, 21, 2024",
      image: "/placeholder.svg",
      status: "pending",
    },
    {
      id: 4,
      name: "PhalPhea Pheakdey",
      email: "pheakdey@gmail.com",
      createdAt: "Nov, 21, 2024",
      image: "/placeholder.svg",
      status: "active",
    },
    {
      id: 5,
      name: "Ing Davann",
      email: "davann@gmail.com",
      createdAt: "Nov, 21, 2024",
      image: "/placeholder.svg",
      status: "active",
    },
  ] as User[];

  if (!query) return allUsers;

  return allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
  );
}

export function UsersTable({ query = "" }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id));
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="rounded-md border">
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
            <TableHead>UserName</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Gmail</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => handleSelectUser(user.id)}
                />
              </TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
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
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                      <Eye className="h-5 w-5 mr-2" />
                      View details
                    </DropdownMenuItem>

                    {/* Modal Component */}
                    {isModalOpen && (
                      <CreateUserModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                      />
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-red-600">
                      <Trash className="h-5 w-5 mr-2" />
                      Delete user
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
