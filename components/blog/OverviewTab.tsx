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
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
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
import { useGetAllBlogQuery } from "@/redux/service/blog"; 
import { Blog } from "@/types/Blog";
import { convertToDayMonthYear } from "@/lib/utils";
import { useRouter } from "next/navigation";


const ITEMS_PER_PAGE = 10;

export function OverviewTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Blog | null>(null);
  const router = useRouter();

  // Fetch data using `useGetAllBlogQuery` with pagination
  const { data: blogData, isLoading, isError } = useGetAllBlogQuery({
    page: currentPage - 1, 
    pageSize: ITEMS_PER_PAGE,
  });

  // Safely access the blog list
  const blogs = blogData?.content || []; 
  const totalPages = blogData?.totalPages || 1;
  const totalBlogs = blogData?.totalElements || 0;

  const handleSelectAll = () => {
    setSelectedBlogs(
      selectedBlogs.length === blogs.length
        ? []
        : blogs.map((blogs: { uuid: unknown; }) => blogs.uuid)
    );
  };

  const handleSelectBlog = (uuid: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleDelete = () => {
    if (selectedItem) {
      // Optimistic update
      setSelectedBlogs((prev) =>
        prev.filter((uuid) => uuid !== selectedItem.uuid)
      );
    }
    setDeleteModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if (isError) {
    return <div>Error loading blogs. Please try again later.</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedBlogs.length === blogs.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs?.map((blog: Blog, index: number) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  checked={selectedBlogs.includes(blog.uuid)}
                  onCheckedChange={() => handleSelectBlog(blog.uuid)}
                />
              </TableCell>
              <TableCell  onClick={() => router.push(`/blog/${blog?.uuid}`)}>
                <img
                  src={blog?.thumbnail[0]}
                  alt={blog?.title || "Blog Image"}
                  width={48}
                  height={48}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell>{blog?.title}</TableCell>
              <TableCell>{convertToDayMonthYear(blog?.createdAt)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem  onClick={() => router.push(`/blog/${blog?.uuid}`)}>
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

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-base my-2">
              Are you sure you want to delete this blog?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-muted-foreground">
          Rows per page: {ITEMS_PER_PAGE}
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span>
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalBlogs)} of {totalBlogs}
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
