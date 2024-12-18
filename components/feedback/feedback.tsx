"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { convertToDayMonthYear } from "@/lib/utils";
import { useGetAllUserFeedbackQuery , useDeleteFeedbackMutation } from "@/redux/service/feedback";
import { feedbackType } from "@/types/Feedback";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";


export default function FeedbackDashboard() {

  const { data, isLoading } = useGetAllUserFeedbackQuery({ page: 0, size: 10 });

  const result = data?.content;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [deletefeedback] = useDeleteFeedbackMutation();

  const [uuid, setUuid] = useState<string>("");

  const handleDelete = async (uuid: string) => {
    try {
      await deletefeedback({ uuid: uuid });
      setDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading){
    return <div className="loader-container">
      <div className="loader"></div>
    </div>;
  }

  if (data?.content.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <img className="w-full" src="/null.png" alt="Empty" />
        </div>
      </div>
    )
  }

  // const [currentPage, setCurrentPage] = useState(1);

  // const totalPages = Math.ceil(feedbackItems.length / ITEMS_PER_PAGE);
  // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // const endIndex = startIndex + ITEMS_PER_PAGE;
  // const currentFeedback = feedbackItems.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <div className="space-y-4">
          {result?.map((feedback: feedbackType, index: number) => (
            <Card key={index} className="border-none shadow-none">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage
                        src={feedback?.profile}
                        alt={feedback?.firstName}
                        className="object-cover"
                      />
                      <AvatarFallback>{feedback?.firstName}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">
                          {feedback?.firstName} {feedback?.lastName}
                        </div>
                      </div>
                      <div className="text-sm">
                        {convertToDayMonthYear(feedback?.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setUuid(feedback?.uuid);
                      setDeleteModalOpen(true);
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-4">{feedback?.message}</p>
              </CardContent>
            </Card>
          ))}

          {/* Delete Modal */}
          <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-xl text-foreground">
                  Comfirm Delete
                </DialogTitle>
                <DialogDescription className="text-[#888888] text-base my-2">
                  Are you sure you want to delete this feedback?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(uuid)}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* 
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
        </div> */}
      </main>
    </div>
  );
}
