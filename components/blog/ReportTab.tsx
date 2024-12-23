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
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteReportMutation,
  useGetAllReportQuery,
} from "@/redux/service/report";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import { ReportFilter } from "./ReportFilter";
import { Report } from "@/types/Blog";

interface Column {
  id: keyof Report;
  label: string;
  checked: boolean;
}

const ITEMS_PER_PAGE = 10;

export function ReportTab({ query = "" }: { query?: string }) {
  const router = useRouter();

  const { toast } = useToast();

  const [blogs, setBlogs] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");

  const [visibleColumns, setVisibleColumns] = useState<Column[]>([
    { id: "message", label: "Report Messagge", checked: true },
    { id: "createdAt", label: "Created At", checked: true },
  ]);

  const { data: reportData, isLoading: reportLoading } = useGetAllReportQuery({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (reportData?.content) {
      setBlogs(reportData.content); // Set blogs from reportData
      setIsLoading(false);
    }
  }, [reportData]);

  const [deleteReport] = useDeleteReportMutation();
  const [reportUuid, setReportUuid] = useState<string>("");

  if (reportLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Apply filter here
  const filteredBlogs = blogs.filter((blog) =>
    blog.message.toLowerCase().includes(filterValue.toLowerCase())
  );

  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    setSelectedBlogs(
      selectedBlogs.length === currentBlogs.length
        ? []
        : currentBlogs.map((blog) => blog.blogUuid)
    );
  };

  const handleSelectBlog = (blogUuid: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogUuid)
        ? prev.filter((id) => id !== blogUuid)
        : [...prev, blogUuid]
    );
  };

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const handleColumnsChange = (columns: Column[]) => {
    setVisibleColumns(columns);
  };

  const handleDeleteSelected = async (uuid: string) => {
    try {
      const res = await deleteReport({ reportUuid: uuid });

      if (!res.error && res.data === null) {
        toast({
          title: "Report Deleted",
          description: "Report deleted successfully",
          variant: "success",
        });

        setDeleteModalOpen(false);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the report",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-4">
      <ReportFilter
        onFilterChange={handleFilterChange}
        onColumnsChange={handleColumnsChange}
      />

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
              <TableHead>Username</TableHead>
              {/* <TableHead>Report Message</TableHead>
              <TableHead>Created At</TableHead> */}
              {visibleColumns.map(
                (column) =>
                  column.checked && (
                    <TableHead key={column.id}>{column.label}</TableHead>
                  )
              )}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogs.map((blog) => (
              <TableRow key={blog.blogUuid}>
                <TableCell>
                  <Checkbox
                    checked={selectedBlogs.includes(blog.blogUuid)}
                    onCheckedChange={() => handleSelectBlog(blog.blogUuid)}
                    aria-label={`Select blog ${blog.message}`}
                  />
                </TableCell>
                <TableCell>
                  <Image
                    src={blog?.user?.profile || ""}
                    alt={blog.message}
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                </TableCell>
                <TableCell>{blog.user?.name}</TableCell>
                {visibleColumns.map(
                  (column) =>
                    column.checked && (
                      <TableCell key={column.id}>
                        {column.id === "message" && blog.message}
                        {column.id === "createdAt" &&
                          new Date(blog.createdAt).toISOString().split("T")[0]}
                      </TableCell>
                    )
                )}
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
                        onClick={() => router.push(`/blog/${blog.blogUuid}`)}
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setReportUuid(blog?.uuid);
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
              <Button
                variant="destructive"
                onClick={() => handleDeleteSelected(reportUuid)}
              >
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
              {startIndex + 1}-{Math.min(endIndex, filteredBlogs.length)} of{" "}
              {filteredBlogs.length}
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
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
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
