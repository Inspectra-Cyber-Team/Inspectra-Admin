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
import { ChevronLeft, ChevronRight, Edit,  Eye, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

type Document = {
  uuid: string;
  documentCategoryName: string;
  title: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

async function fetchDocuments(query: string): Promise<Document[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allDocuments: Document[] = [
    { uuid: "1", documentCategoryName: "Getting Started", title: "Introduction", createdAt: "Nov, 21, 2024" },
    { uuid: "2", documentCategoryName: "Tutorial", title: "Getting Started Guide", createdAt: "Nov, 22, 2024" },
    { uuid: "3", documentCategoryName: "Guides", title: "User Guide", createdAt: "Nov, 23, 2024" },
    { uuid: "4", documentCategoryName: "Technical", title: "Technical Documentation", createdAt: "Nov, 24, 2024" },
    { uuid: "5", documentCategoryName: "API", title: "API Reference", createdAt: "Nov, 25, 2024" },
  ];

  return !query
    ? allDocuments
    : allDocuments.filter((doc) =>
        doc.documentCategoryName.toLowerCase().includes(query.toLowerCase())
      );
}

export function DocumentsTable({ query = "" }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Document | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

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
    setSelectedDocuments(
      selectedDocuments.length === currentDocuments.length ? [] : currentDocuments.map((doc) => doc.uuid)
    );
  };

  const handleSelectDocument = (uuid: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleEdit = () => {
    if (selectedItem) {
      console.log("Editing document:", selectedItem.uuid, "New title:", editedTitle);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.uuid === selectedItem.uuid ? { ...doc, title: editedTitle } : doc
        )
      );
    }
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedItem) {
      console.log("Deleting document:", selectedItem.uuid);
      setDocuments((prev) => prev.filter((doc) => doc.uuid !== selectedItem.uuid));
    }
    setDeleteModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="rounded-md border bg-card">
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
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentDocuments.map((document) => (
            <TableRow key={document.uuid}>
              <TableCell>
                <Checkbox
                  checked={selectedDocuments.includes(document.uuid)}
                  onCheckedChange={() => handleSelectDocument(document.uuid)}
                />
              </TableCell>
              <TableCell>{document.documentCategoryName}</TableCell>
              <TableCell>{document.title}</TableCell>
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
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedItem(document);
                        setViewModalOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4"/>
                      View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedItem(document);
                        setEditedTitle(document.title);
                        setEditModalOpen(true);
                      }}
                      className="text-yellow-600"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        setSelectedItem(document);
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

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Item Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Category:</span>
                <span className="col-span-3">{selectedItem.documentCategoryName}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Title:</span>
                <span className="col-span-3">{selectedItem.title}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Created At:</span>
                <span className="col-span-3">{selectedItem.createdAt}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Make changes to the item here.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Title:</span>
                <Input
                  className="col-span-3"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">Confirm Delete</DialogTitle>
            <DialogDescription className=" text-base my-2">
              Are you sure you want to delete this category?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-muted-foreground">Rows per page: {ITEMS_PER_PAGE}</div>
        <div className="flex items-center space-x-2 text-sm">
          <span>
            {startIndex + 1}-{Math.min(endIndex, documents.length)} of {documents.length}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
