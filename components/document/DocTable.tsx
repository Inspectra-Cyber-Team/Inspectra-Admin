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
import { DocumentType } from "@/types/Document";
import { DocTableFilter } from "./DocTableFilter";
import { convertToDayMonthYear } from "@/lib/utils";
import { useGetAllDocumentQuery } from "@/redux/service/document";

const ITEMS_PER_PAGE = 10;

interface Column {
  id: keyof DocumentType;
  label: string;
  checked: boolean;
}

export function DocumentsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DocumentType | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDocumentCategoryName, setEditedDocumentCategoryName] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Column[]>([
    { id: "documentCategoryName", label: "Category", checked: true },
    { id: "title", label: "Title", checked: true },
    { id: "createdAt", label: "Created At", checked: true },
  ]);

  const { data: DocData, isLoading, isError } = useGetAllDocumentQuery();
  console.log(DocData);

  const docs = DocData?.data || [];
  const filteredDocs = docs.filter((doc: DocumentType) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(doc).some(([key, value]) =>
      value.toString().toLowerCase().includes(filterValue.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE);
  const totalDocs = filteredDocs.length;

  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = () => {
    setSelectedDocuments(
      selectedDocuments.length === docs.length
        ? []
        : docs.map((faq: { uuid: unknown }) => faq.uuid)
    );
  };

  const handleSelectDocument = (uuid: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleEdit = () => {
    if (selectedItem) {
      console.log("Editing Doc:", selectedItem.uuid, "New Data:", {
        documentCategoryName: editedDocumentCategoryName,
        title: editedTitle,
        description: editedDescription,
      });
      setEditModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      console.log("Deleting Doc:", selectedItem.uuid);
      setDeleteModalOpen(false);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handleColumnsChange = (columns: Column[]) => {
    setVisibleColumns(columns);
  };

  if (isLoading) {
    return <div>Loading FAQs...</div>;
  }

  if (isError ) {
    return <div>No FAQs found.</div>;
  }

  return (
   <div className="space-y-4">
    <DocTableFilter onFilterChange={handleFilterChange} onColumnsChange={handleColumnsChange} />
     <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedDocuments.length === paginatedDocs.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {visibleColumns.map((column) => column.checked && (
                <TableHead key={column.id}>{column.label}</TableHead>
              ))}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedDocs.map((doc: DocumentType, index: number) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  checked={selectedDocuments.includes(doc.uuid)}
                  onCheckedChange={() => handleSelectDocument(doc.uuid)}
                />
              </TableCell>
              {visibleColumns.map((column) => column.checked && (
                                <TableCell key={column.id}>
                                  {column.id === 'createdAt' 
                                    ? convertToDayMonthYear(doc[column.id])
                                    : doc[column.id]}
                                </TableCell>
                              ))}
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
                        setSelectedItem(doc);
                        setViewModalOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedItem(doc);
                        setEditedDocumentCategoryName(doc.documentCategoryName);
                        setEditedTitle(doc.title);
                        setEditModalOpen(true);
                      }}
                      className="text-yellow-600"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        setSelectedItem(doc);
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
            <DialogTitle>View Document Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
            <div>
              <strong>Category:</strong> {selectedItem.documentCategoryName}
            </div>
            <div>
              <strong>Title:</strong> {selectedItem.title}
            </div>
            <div>
              <strong>Description:</strong> {selectedItem.description}
            </div>
            <div>
              <strong>Created At:</strong> {convertToDayMonthYear(selectedItem.createdAt)}
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
      <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          <div>
          <h2 className='text-sm font-medium mb-2 block'>Category</h2>
            <Input
              id="Category"
              value={editedDocumentCategoryName}
              onChange={(e) => setEditedDocumentCategoryName(e.target.value)}
            />
          </div>
          <div>
          <h2 className='text-sm font-medium mb-2 block'>Title</h2>
            <Input
              id="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </div>
          <div>
          <h2 className='text-sm font-medium mb-2 block'>Description</h2>
            <Input
              id="Description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className=" text-base my-2">
              Are you sure you want to delete this document?
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
          {currentPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE + 1} - {Math.min(
              currentPage * ITEMS_PER_PAGE,
              totalDocs
            )} of {totalDocs}
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
