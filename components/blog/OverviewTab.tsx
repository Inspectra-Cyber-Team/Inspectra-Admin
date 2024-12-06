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
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Blog = {
  blogUuid: string; 
  title: string;
  createdAt: string;
  thumbnail: string;
  status: "active" | "inactive" | "pending";
};

const ITEMS_PER_PAGE = 10;

async function fetchBlogs(query: string): Promise<Blog[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allBlogs: Blog[] = [
    {
      blogUuid: "1e456d4f-4c9b-4726-b8a7-1f6a12345678",
      title: "10 AI-Powered Python Libraries to...",
      thumbnail: "/Blog.png?height=48&width=48",
      createdAt: "Nov. 21, 2024",
      status: "active",
    },
    {
      blogUuid: "2e456d4f-4c9b-4726-b8a7-1f6a12345678",
      title: "30 Tricky Java Interview Question...",
      thumbnail: "/Blog.png?height=48&width=48",
      createdAt: "Nov. 21, 2024",
      status: "pending",
    },
    {
      blogUuid: "3e456d4f-4c9b-4726-b8a7-1f6a12345678",
      title: "Inspector Named As a Top...",
      thumbnail: "/Blog.png?height=48&width=48",
      createdAt: "Nov. 21, 2024",
      status: "active",
    },
    {
      blogUuid: "4e456d4f-4c9b-4726-b8a7-1f6a12345678",
      title: "10 AI-Powered Python Libraries to...",
      thumbnail: "/Blog.png?height=48&width=48",
      createdAt: "Nov. 21, 2024",
      status: "active",
    },
    {
      blogUuid: "5e456d4f-4c9b-4726-b8a7-1f6a12345678",
      title: "I Stopped Using Kubernetes. Our...",
      thumbnail: "/Blog.png?height=48&width=48",
      createdAt: "Nov. 21, 2024",
      status: "active",
    },
  ];

  return !query
  ? allBlogs
  : allBlogs.filter((blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );
}

export function OverviewTab({ query = "" }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Blog | null>(null);


  useEffect(() => {
    const loadBlogs = async () => {
      setIsLoading(true);
      const fetchedBlogs = await fetchBlogs(query);
      setBlogs(fetchedBlogs);
      setCurrentPage(1);
      setSelectedBlogs([]);
      setIsLoading(false);
    };

    loadBlogs();
  }, [query]);

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    setSelectedBlogs(
      selectedBlogs.length === currentBlogs.length
        ? []
        : currentBlogs.map((blog) => blog.blogUuid)
    );
  };

  const handleSelectBlog = (blogUuid: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogUuid) ? prev.filter((id) => id !== blogUuid) : [...prev, blogUuid]
    );
  };

  const handleDelete = () => {
    if (selectedItem) {
      setBlogs((prev) =>
        prev.filter((Blog) => Blog.blogUuid !== selectedItem.blogUuid)
      );
    }
    setDeleteModalOpen(false);
  };
  

  const getStatusBadge = (status: Blog["status"]) => {
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
    return <div>Loading blogs...</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedBlogs.length === currentBlogs.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBlogs.map((blog) => (
            <TableRow key={blog.blogUuid}>
              <TableCell>
                <Checkbox
                  checked={selectedBlogs.includes(blog.blogUuid)}
                  onCheckedChange={() => handleSelectBlog(blog.blogUuid)}
                />
              </TableCell>
              <TableCell>
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  width={48}
                  height={48}
                  className="rounded-md"
                />
              </TableCell>
              <TableCell>{blog.title}</TableCell>
              <TableCell>{blog.createdAt}</TableCell>
              <TableCell>{getStatusBadge(blog.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-5 w-5 mr-2" />
                      View details
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-yellow-600">
                      <Edit className="h-5 w-5 mr-2 " />
                      Edit Blog
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        setSelectedItem(blog);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">Comfirm Delete</DialogTitle>
            <DialogDescription className="text-[#888888] text-base my-2">
              Are you sure you want to delete this blog?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} >Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-muted-foreground">
          Rows per page: {ITEMS_PER_PAGE}
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span>
            {startIndex + 1}-{Math.min(endIndex, blogs.length)} of{" "}
            {blogs.length}
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
