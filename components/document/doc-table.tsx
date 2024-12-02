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

interface Document {
  id: number;
  name: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

async function fetchDocuments(query: string): Promise<Document[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allDocuments = [
    {
      id: 1,
      name: "Introduction",
      createdAt: "Nov, 21, 2024",
    },
    {
      id: 2,
      name: "Getting Started",
      createdAt: "Nov, 21, 2024",
    },
    {
      id: 3,
      name: "User Guide",
      createdAt: "Nov, 21, 2024",
    },
    {
      id: 4,
      name: "Technical Guide",
      createdAt: "Nov, 21, 2024",
    },
    {
      id: 5,
      name: "API Reference",
      createdAt: "Nov, 21, 2024",
    },
  ];

  if (!query) return allDocuments;

  return allDocuments.filter((document) =>
    document.name.toLowerCase().includes(query.toLowerCase())
  );
}

export function DocumentsTable({ query = "" }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      const fetchedDocuments = await fetchDocuments(query);
      setDocuments(fetchedDocuments);
      setCurrentPage(1);
      setSelectedDocuments([]);
      setIsLoading(false);
    };

    loadDocuments();
  }, [query]);

  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDocuments = documents.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedDocuments.length === currentDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(currentDocuments.map((document) => document.id));
    }
  };

  const handleSelectDocument = (documentId: number) => {
    setSelectedDocuments((prev) =>
      prev.includes(documentId)
        ? prev.filter((id) => id !== documentId)
        : [...prev, documentId]
    );
  };

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedDocuments.length === currentDocuments.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentDocuments.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <Checkbox
                  checked={selectedDocuments.includes(document.id)}
                  onCheckedChange={() => handleSelectDocument(document.id)}
                />
              </TableCell>
              <TableCell>{document.name}</TableCell>
              <TableCell>{document.createdAt}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-yellow-600">
                      <Edit className="h-5 w-5 mr-2" />
                      Edit
                    </DropdownMenuItem>

                    {/* Modal Component */}
                    {/* {isModalOpen && (
                      <CreateDocumentModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                      />
                    )} */}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-red-600">
                      <Trash className="h-5 w-5 mr-2" />
                      Delete
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
            {startIndex + 1}-{Math.min(endIndex, documents.length)} of{" "}
            {documents.length}
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
