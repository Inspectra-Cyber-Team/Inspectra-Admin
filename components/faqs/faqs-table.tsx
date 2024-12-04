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
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FAQ {
  id: number;
  question: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

async function fetchFAQs(query: string): Promise<FAQ[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allFAQs = [
    {
      id: 1,
      question:
        "Which languages and frameworks does Inspectra support in its scans?",
      createdAt: "Nov, 21, 2024",
    },
    {
      id: 2,
      question:
        "What scanning tools and frameworks does Inspectra use for security testing?",
      createdAt: "Nov, 21, 2024",
    },
    {
      id: 3,
      question:
        "Does Inspectra support containerized and cloud-native environments?",
      createdAt: "Nov, 21, 2024",
    },
    {
      id: 4,
      question: "What types of databases does Inspectra support?",
      createdAt: "Nov, 21, 2024",
    },
    {
      id: 5,
      question: "How does Inspectra perform white-box testing?",
      createdAt: "Nov, 21, 2024",
    },
  ];

  if (!query) return allFAQs;

  return allFAQs.filter((faq) =>
    faq.question.toLowerCase().includes(query.toLowerCase())
  );
}

export function FAQsTable({ query = "" }) {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFAQs, setSelectedFAQs] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (selectedFAQs.length === currentFAQs.length) {
      setSelectedFAQs([]);
    } else {
      setSelectedFAQs(currentFAQs.map((faq) => faq.id));
    }
  };

  const handleSelectFAQ = (faqId: number) => {
    setSelectedFAQs((prev) =>
      prev.includes(faqId)
        ? prev.filter((id) => id !== faqId)
        : [...prev, faqId]
    );
  };

  if (isLoading) {
    return <div>Loading FAQs...</div>;
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
            <TableRow key={faq.id}>
              <TableCell>
                <Checkbox
                  checked={selectedFAQs.includes(faq.id)}
                  onCheckedChange={() => handleSelectFAQ(faq.id)}
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
                    <DropdownMenuItem className="text-yellow-600">
                      <Eye className="h-5 w-5 mr-2" />
                      View details
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="text-yellow-600">
                      <Edit className="h-5 w-5 mr-2" />
                      Edit
                    </DropdownMenuItem>

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
