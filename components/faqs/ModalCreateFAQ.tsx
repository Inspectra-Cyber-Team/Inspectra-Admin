"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateFAQMutation, useGetAllFAQQuery } from "@/redux/service/faqs";

interface CreatefaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatefaqModal({ isOpen, onClose }: CreatefaqModalProps) {
  const [createFAQ] = useCreateFAQMutation();
  const { refetch } = useGetAllFAQQuery(); // Access the refetch function from the FAQ query
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setIsLoading(true);
      await createFAQ({ question, answer }).unwrap();
      console.log("FAQ created successfully!");
      refetch(); // Refetch FAQs to update the list
      setQuestion(""); // Reset question field
      setAnswer(""); // Reset answer field
      onClose(); // Close the modal after successful creation
    } catch (err) {
      console.error("Failed to create FAQ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCreate(); // Call the create handler on form submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
        <DialogHeader>
          <DialogTitle>Create FAQ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 py-4">
            <div>
              <h2 className="text-sm font-medium mb-2 block">Question</h2>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter Question"
                className="w-full rounded-lg p-4 text-sm"
                required
              />
            </div>
            <div>
              <h2 className="text-sm font-medium mb-2 block">Answer</h2>
              <Input
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter Answer"
                className="w-full rounded-lg p-4 text-sm"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
