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
  Eye,
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
} from "../ui/dialog";
import { Input } from "@/components/ui/input";

type FAQ = {
  uuid: string;
  question: string;
  answer: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

async function fetchFAQs(query: string): Promise<FAQ[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allFAQs: FAQ[] = [
    {
      uuid: "1",
      question:
        "Which languages and frameworks does Inspectra support in its scans?",
      answer: "Introduction",
      createdAt: "Nov, 21, 2024",
    },
    {
      uuid: "2",
      question:
        "What scanning tools and frameworks does Inspectra use for security testing?",
      answer: "Getting Started Guide",
      createdAt: "Nov, 22, 2024",
    },
    {
      uuid: "3",
      question:
        "Does Inspectra support containerized and cloud-native environments?",
      answer: "User Guide",
      createdAt: "Nov, 23, 2024",
    },
    {
      uuid: "4",
      question: "What types of databases does Inspectra support?",
      answer: "Technical Documentation",
      createdAt: "Nov, 24, 2024",
    },
    {
      uuid: "5",
      question: "How does Inspectra perform white-box testing?",
      answer: "API Reference",
      createdAt: "Nov, 25, 2024",
    },
  ];

  return !query
    ? allFAQs
    : allFAQs.filter((faq) =>
        faq.question.toLowerCase().includes(query.toLowerCase())
      );
}

export function FAQsTable({ query = "" }) {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFAQs, setSelectedFAQs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<FAQ | null>(null);
  const [editedQuestion, setEditedQuestion] = useState("");

  useEffect(() => {
    const loadFAQs = async () => {
      setIsLoading(true);
      const fetchedFAQs = await fetchFAQs(query);
      setFAQs(fetchedFAQs);
      setCurrentPage(1);
      setSelectedFAQs([]);
      setIsLoading(false);
    };

    loadFAQs();
  }, [query]);

  const totalPages = Math.ceil(faqs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFAQs = faqs.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    setSelectedFAQs(
      selectedFAQs.length === currentFAQs.length
        ? []
        : currentFAQs.map((faq) => faq.uuid)
    );
  };

  const handleSelectFAQ = (uuid: string) => {
    setSelectedFAQs((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleEdit = () => {
    if (selectedItem) {
      console.log("Editing FAQ:", selectedItem.uuid, "New Question:", editedQuestion);
      setFAQs((prev) =>
        prev.map((faq) =>
          faq.uuid === selectedItem.uuid ? { ...faq, question: editedQuestion } : faq
        )
      );
    }
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedItem) {
      console.log("Deleting FAQ:", selectedItem.uuid);
      setFAQs((prev) => prev.filter((faq) => faq.uuid !== selectedItem.uuid));
    }
    setDeleteModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading FAQs...</div>;
  }

  if (faqs.length === 0) {
    return <div>No FAQs found.</div>;
  }

  return (
    <div className="rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedFAQs.length === currentFAQs.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentFAQs.map((faq) => (
            <TableRow key={faq.uuid}>
              <TableCell>
                <Checkbox
                  checked={selectedFAQs.includes(faq.uuid)}
                  onCheckedChange={() => handleSelectFAQ(faq.uuid)}
                />
              </TableCell>
              <TableCell>{faq.question}</TableCell>
              <TableCell>{faq.createdAt}</TableCell>
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
                        setSelectedItem(faq);
                        setViewModalOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedItem(faq);
                        setEditedQuestion(faq.question);
                        setEditModalOpen(true);
                      }}
                      className="text-yellow-600"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        setSelectedItem(faq);
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

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View FAQ Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div>
                <strong>Question:</strong> {selectedItem.question}
              </div>
              <div>
                <strong>Answer:</strong> {selectedItem.answer}
              </div>
              <div>
                <strong>Created At:</strong> {selectedItem.createdAt}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update FAQ</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid py-4 gap-2">
              <div>
                <h2 className='text-sm font-medium mb-2 block'>Question</h2>
              <Input
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                className="w-full rounded-lg p-4 text-sm "
              />
              </div>
              <div>
                <h2 className='text-sm font-medium mb-2 block'>Answer</h2>
              <Input
                value={selectedItem.answer}
                onChange={(e) => setEditedQuestion(e.target.value)}
                className="w-full rounded-lg p-4 text-sm "
              />
              </div>
            </div>
          )}
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
            <DialogTitle className="text-xl text-foreground">Confirm Delete</DialogTitle>
            <DialogDescription className="text-base my-2">
            Are you sure you want to delete this FAQs?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-muted-foreground">
          Rows per page: {ITEMS_PER_PAGE}
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span>
            {startIndex + 1}-{Math.min(endIndex, faqs.length)} of {faqs.length}
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
