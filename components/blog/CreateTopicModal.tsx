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
import { useUseCreatTopicMutation } from "@/redux/service/topic";
import { useToast } from "@/hooks/use-toast";


interface CreatefaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTopicModal({ isOpen, onClose }: CreatefaqModalProps) {

  const {toast} = useToast();   

  const [createTopic] = useUseCreatTopicMutation();
 // Access the refetch function from the FAQ query

  const [topicName, setTopicName] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setIsLoading(true);
  
      const res = await createTopic({name:topicName }).unwrap();

      if (res.data) {
        
        toast({
          description: "Topic has been created successfully",
          variant: "success",
        });


      setTopicName(""); 
      onClose(); 

      }
  
      // Close the modal after successful creation
    } catch (err) {
      console.error("Failed to create Topic:", err);
      toast({
        description: "An error occurred while creating the Topic",
        variant: "error",
      });
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
          <DialogTitle>Create Topic</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 py-4">
            <div>
              <h2 className="text-sm font-medium mb-2 block">Topic Name</h2>
              <Input
                id="question"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="Enter Topic Name"
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
