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
import {
  useDeleteFAQMutation,
  useUpdateFAQMutation,
} from "@/redux/service/faqs";
import { TopicType } from "@/types/Topic";
import { convertToDayMonthYear } from "@/lib/utils";
import { useGetAllTopicQuery } from "@/redux/service/topic";
import { TopicTableFilter } from "./TopicTableFilter";

const ITEMS_PER_PAGE = 10;

type Column = {
  id: keyof TopicType;
  label: string;
  checked: boolean;
};

export default function TopicComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFAQs, setSelectedFAQs] = useState<string[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TopicType | null>(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Column[]>([
    { id: "name", label: "Name", checked: true },
    { id: "createdAt", label: "Created At", checked: true },
  ]);
  // get data from RTK query
  const {
    data: topicData,
    isLoading,
    isError,
    refetch,
  } = useGetAllTopicQuery({ page: 0, pageSize: 10 });

  const faqs = topicData?.content || [];
  const filteredFaqs = faqs.filter((topic: TopicType) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(topic).some(([key, value]) =>
      value.toString().toLowerCase().includes(filterValue.toLowerCase())
    )
  );

  const [deleteFAQ] = useDeleteFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();

  // pagination
  const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE);
  const totalFaqs = filteredFaqs.length;
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  //handlers
  const handleSelectAll = () => {
    setSelectedFAQs(
      selectedFAQs.length === faqs.length
        ? []
        : faqs.map((faq: { uuid: unknown }) => faq.uuid)
    );
  };

  const handleSelectFAQ = (uuid: string) => {
    setSelectedFAQs((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleEdit = async () => {
    if (selectedItem) {
      try {
        await updateFAQ({
          uuid: selectedItem.uuid,
          question: editedQuestion,
          answer: editedAnswer,
        }).unwrap();
        setEditModalOpen(false);
        console.log("FAQ updated successfully!");
        refetch();
      } catch (err) {
        console.error("Failed to update FAQ:", err);
      }
    }
  };

  const handleDeleteFAQ = async () => {
    if (selectedItem) {
      try {
        await deleteFAQ({ uuid: selectedItem.uuid }).unwrap();
        setDeleteModalOpen(false);
        refetch(); // Refresh the FAQs data
      } catch (err) {
        console.error("Failed to delete FAQ:", err);
      }
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

  if (isError) {
    return <div>No FAQs found.</div>;
  }

  return (
    <div className="space-y-4">
      <TopicTableFilter
        onFilterChange={handleFilterChange}
        onColumnsChange={handleColumnsChange}
      />
      <div className="rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedFAQs.length === paginatedFaqs.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {visibleColumns.map(
                (column) =>
                  column.checked && (
                    <TableHead key={column.id}>{column.label}</TableHead>
                  )
              )}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFaqs.map((faq: TopicType, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedFAQs.includes(faq.uuid)}
                    onCheckedChange={() => handleSelectFAQ(faq.uuid)}
                  />
                </TableCell>
                {visibleColumns.map(
                  (column) =>
                    column.checked && (
                      <TableCell key={column.id}>
                        {column.id === "createdAt"
                          ? convertToDayMonthYear(faq[column.id])
                          : faq[column.id]}
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
                          setEditedQuestion(faq.name);
                          setEditedAnswer(faq.name);
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
          <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
            <DialogHeader>
              <DialogTitle>View Topic Details</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="grid gap-4 py-4">
                <div>
                  <strong>Topic Name:</strong> {selectedItem?.name}
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  {convertToDayMonthYear(selectedItem.createdAt)}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
            <DialogHeader>
              <DialogTitle>Update Topic</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <h2 className="text-sm font-medium mb-2 block">Topic Name</h2>
                <Input
                  id="Answer"
                  value={editedAnswer}
                  onChange={(e) => setEditedAnswer(e.target.value)}
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
          <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this Topic?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteFAQ} variant="destructive">
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
              {currentPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalFaqs)} of {totalFaqs}
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
