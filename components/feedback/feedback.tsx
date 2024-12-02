"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface FeedbackItem {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  content: string;
}

const feedbackItems: FeedbackItem[] = [
  {
    id: "1",
    author: {
      name: "PhalPhea Pheakdey",
      avatar: "/lyhou.jpg?height=40&width=40",
    },
    date: "12/10/2024",
    content:
      "Great job on creating an efficient, streamlined code scanner for vulnerabilities! Its minimal code approach makes it accessible and easy to integrate, helping developers catch issues quickly.",
  },
  {
    id: "2",
    author: {
      name: "Votey",
      avatar: "/lyhou.jpg?height=40&width=40",
    },
    date: "12/10/2024",
    content:
      "The detailed insights into code quality, security issues, and best practices have been invaluable for improving our codebase. The platform's intuitive interface and clear reporting make it easy to pinpoint and resolve issues quickly.",
  },
  {
    id: "3",
    author: {
      name: "Lyhou",
      avatar: "/lyhou.jpg?height=40&width=40",
    },
    date: "12/10/2024",
    content:
      "The automated scanning features are exceptional. It saves our team countless hours while maintaining high security standards.",
  },
];

const ITEMS_PER_PAGE = 5;

export default function FeedbackDashboard() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(feedbackItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFeedback = feedbackItems.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <div className="space-y-4">
          {currentFeedback.map((item) => (
            <Card key={item.id} className="border-none shadow-none">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={item.author.avatar}
                        alt={item.author.name}
                        className="object-cover"
                      />
                      <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{item.author.name}</div>
                      </div>
                      <div className="text-sm text-gray-600">{item.date}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Delete feedback</span>
                  </Button>
                </div>
                <p className="mt-4 text-gray-600">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t mt-4">
          <div className="text-sm text-muted-foreground">
            Rows per page: {ITEMS_PER_PAGE}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>
              {startIndex + 1}-{Math.min(endIndex, feedbackItems.length)} of{" "}
              {feedbackItems.length}
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
      </main>
    </div>
  );
}
