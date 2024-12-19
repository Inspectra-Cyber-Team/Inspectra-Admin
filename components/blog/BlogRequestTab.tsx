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
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Trash2,
  X,
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
import { Blog } from "@/types/Blog";
import { useRouter } from "next/navigation";
import { BlogRequestFilter } from "./BlogRequestFilter";
import { convertToDayMonthYear } from "@/lib/utils";
import {
  useDeleteBlogMutation,
  useGetAllBlogUnVerifiedQuery,
  useVerifyBlogMutation,
} from "@/redux/service/blog";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

interface Column {
  id: keyof Blog;
  label: string;
  checked: boolean;
}

export function BlogRequestTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Column[]>([
    { id: "title", label: "Title", checked: true },
    { id: "createdAt", label: "CreatedAt", checked: true },
  ]);
  const router = useRouter();

  const {toast} = useToast();

  const [uuid, setUuid] = useState<string>("");

  const [verifyBlog] = useVerifyBlogMutation();

  const [deleteBlog] = useDeleteBlogMutation();


  const handleDeteBlog = async (uuid: string) => {

    try {
      
      await deleteBlog({ uuid: uuid });

      toast ({
        description: "Blog deleted successfully",
        variant: "success",
      })
     
      setDeleteModalOpen(false);
      
    } catch {
      toast ({
        description: "Error deleting blog",
        variant: "error",
      })
    }
  }

  const handleVerify = async (uuid: string) => {
    try {
    await verifyBlog({ uuid: uuid });

        setVerifyModalOpen(false);
      
    } catch (error) {
      console.error("Error verifying blog", error);
    }
  };

  const {
    data: blogData,
    isLoading,
    isError,
  } = useGetAllBlogUnVerifiedQuery({
    page: currentPage - 1,
    pageSize: ITEMS_PER_PAGE,
  });

  const blogs = blogData?.content || [];

  const filteredBlogs = blogs.filter(
    (blog: Blog) =>
      !blog.isVerified && // Ensure isVerified is false
      (!filterValue ||
        Object.entries(blog).some(
          ([ value]) =>
            value &&
            typeof value === "string" &&
            value.toLowerCase().includes(filterValue.toLowerCase())
        ))
  );

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const totalBlogs = filteredBlogs.length;

  const handleSelectAll = () => {
    setSelectedBlogs(
      selectedBlogs.length === blogs.length
        ? []
        : blogs.map((blog: { uuid: unknown }) => blog.uuid)
    );
  };

  const handleSelectBlog = (uuid: string) => {
    setSelectedBlogs((prev) =>
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
    return <div className="loader-container">
      <div className="loader"></div>
    </div>;
  }

  if (isError) {
    return <div>Error loading blogs. Please try again later.</div>;
  }

  return (
    <div className="space-y-4">
      <BlogRequestFilter
        onFilterChange={handleFilterChange}
        onColumnsChange={handleColumnsChange}
      />
      {/* Make Table horizontally scrollable on smaller screens */}
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
              {visibleColumns.map(
                (column) =>
                  column.checked && (
                    <TableHead key={column.id}>{column.label}</TableHead>
                  )
              )}

              <TableHead>Status</TableHead>

              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="cursor-pointer">
            {paginatedBlogs.map((blog: Blog, index: number) => (
              <TableRow key={index}>
                {/* Checkbox Cell */}
                <TableCell>
                  <Checkbox
                    checked={selectedBlogs.includes(blog?.uuid)}
                    onCheckedChange={() => handleSelectBlog(blog?.uuid)}
                  />
                </TableCell>

                {/* Thumbnail Cell */}
                <TableCell
                  onClick={() => {
                    if (blog?.uuid) {
                      router.push(`/blog/${blog.uuid}`);
                    } else {
                      console.error("UUID is missing");
                    }
                  }}
                  className="w-16 h-12"
                >
                  <div className="w-16 h-12 rounded-md overflow-hidden bg-muted">
                    {blog?.thumbnail?.[0] ? (
                      <img
                        src={blog.thumbnail[0]}
                        alt={blog.title || "Blog Image"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Dynamic Column Cells */}
                {visibleColumns.map(
                  (column) =>
                    column.checked && (
                      <TableCell key={column.id}>
                        {(() => {
                          const value = blog[column.id];

                          if (
                            column.id === "createdAt" &&
                            typeof value === "string"
                          ) {
                            return convertToDayMonthYear(value); // Format date
                          }

                          if (
                            typeof value === "string" ||
                            typeof value === "number" ||
                            typeof value === "boolean"
                          ) {
                            return value.toString();
                          }

                          return "-"; // Fallback for unsupported/null values
                        })()}
                      </TableCell>
                    )
                )}

                <TableCell>
                  <div className="flex space-x-2">
                    <div className="text-green-500">
                      <Check
                        onClick={() => {
                          setVerifyModalOpen(true);
                          if (blog?.uuid) {
                            setUuid(blog.uuid);
                          }
                        }}
                      />
                    </div>

                    <div className="text-destructive">
                      <X onClick={() => {
                        setUuid(blog?.uuid);
                        setDeleteModalOpen(true);
                      }}/>
                    </div>
                  </div>
                </TableCell>

                {/* Action Menu Cell */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/blog/${blog?.uuid}`)}
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        View details
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setUuid(blog?.uuid);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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
          <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-foreground">
                Comfirm Delete
              </DialogTitle>
              <DialogDescription className="text-[#888888] text-base my-2">
                Are you sure you want to delete this blog?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={()=>handleDeteBlog(uuid)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Verify Modal */}
        <Dialog open={verifyModalOpen} onOpenChange={setVerifyModalOpen}>
          <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-foreground">
                Verify Blog
              </DialogTitle>
              <DialogDescription className="text-[#888888] text-base my-2">
                Are you sure you want to verify this blog?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => handleVerify(uuid)}>
                Confirm
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
              {Math.min(
                currentPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE + 1,
                totalBlogs
              )}{" "}
              - {Math.min(currentPage * ITEMS_PER_PAGE, totalBlogs)} of{" "}
              {totalBlogs}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              // disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
