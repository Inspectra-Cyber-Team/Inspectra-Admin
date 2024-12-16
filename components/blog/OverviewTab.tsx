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
import { OverviewFilter } from "@/components/blog/OverviewFilter";

const ITEMS_PER_PAGE = 10;

interface Column {
  id: keyof Blog;
  label: string;
  checked: boolean;
}

export function OverviewTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Blog | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Column[]>([
    { id: "title", label: "Title", checked: true },
    { id: "createdAt", label: "Created At", checked: true },
  ]);
  const router = useRouter();

  const {
    data: blogData,
    isLoading,
    isError,
  } = useGetAllBlogQuery({
    page: currentPage - 1,
    pageSize: ITEMS_PER_PAGE,
  });

  const blogs = blogData?.content || [];

  const filteredBlogs = filterValue
    ? blogs.filter((blog: Blog) =>
        Object.entries(blog).some(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([key, value]) =>
            value &&
            typeof value === "string" &&
            value.toLowerCase().includes(filterValue.toLowerCase())
        )
      )
    : blogs;

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

  const handleDelete = () => {
    if (selectedItem) {
      setSelectedBlogs((prev) =>
        prev.filter((uuid) => uuid !== selectedItem.uuid)
      );
    }
    setDeleteModalOpen(false);
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handleColumnsChange = (columns: Column[]) => {
    setVisibleColumns(columns);
  };

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if (isError) {
    return <div>Error loading blogs. Please try again later.</div>;
  }

  return (
    <div className="space-y-4">
      <OverviewFilter
        onFilterChange={handleFilterChange}
        onColumnsChange={handleColumnsChange}
      />
      <div className="rounded-md border bg-card">
        {/* Make Table horizontally scrollable on smaller screens */}
        <div className="overflow-x-auto">
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

                        <DropdownMenuItem className="text-yellow-600" onClick={() => router.push(`/blog/${blog?.uuid}/update`)}>
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
        </div>

        {/*Delete Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent  className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
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
