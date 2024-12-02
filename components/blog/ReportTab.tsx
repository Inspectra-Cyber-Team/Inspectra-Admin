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
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  createdAt: string;
  image: string;
  reportedBy: string;
}

const ITEMS_PER_PAGE = 10;

async function fetchBlogs(query: string): Promise<Blog[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allBlogs = [
    {
      id: 1,
      title: "10 AI-Powered Python Libraries to...",
      image: "/Blog.png?height=48&width=48",
      reportedBy: "Sokpheng",
      createdAt: "Nov. 21, 2024",
    }, 
    {
      id: 2,
      title: "30 Tricky Java Interview Question...",
      image: "/Blog.png?height=48&width=48",
      reportedBy: "Sokpheng",
      createdAt: "Nov. 21, 2024",
    },
    {
      id: 3,
      title: "Inspector Named As a Top...",
      image: "/Blog.png?height=48&width=48",
      reportedBy: "Sokpheng",
      createdAt: "Nov. 21, 2024",
    },
    {
      id: 4,
      title: "10 AI-Powered Python Libraries to...",
      image: "/Blog.png?height=48&width=48",
      reportedBy: "Sokpheng",
      createdAt: "Nov. 21, 2024",
    },
    {
      id: 5,
      title: "I Stopped Using Kubernetes. Our...",
      image: "/Blog.png?height=48&width=48",
      reportedBy: "Sokpheng",
      createdAt: "Nov. 21, 2024",
    },
  ];
  if (!query) return allBlogs;

  return allBlogs.filter((blog) =>
    blog.title.toLowerCase().includes(query.toLowerCase())
  );
}

export function ReportTab({ query = "" }) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (selectedBlogs.length === currentBlogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(currentBlogs.map((blog) => blog.id));
    }
  };

  const handleSelectBlog = (blogId: number) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedBlogs.length === currentBlogs.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Blog</TableHead>
            <TableHead>Report Description</TableHead>
            <TableHead>Repoted By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBlogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
                <Checkbox
                  checked={selectedBlogs.includes(blog.id)}
                  onCheckedChange={() => handleSelectBlog(blog.id)}
                />
              </TableCell>
              <TableCell>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={48}
                  height={48}
                  className="rounded-md"
                />
              </TableCell>
              <TableCell>{blog.title}</TableCell>
              <TableCell>{blog.reportedBy}</TableCell>
              <TableCell>{blog.createdAt}</TableCell>
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
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="h-5 w-5 mr-2" />
                      Delete Report
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
