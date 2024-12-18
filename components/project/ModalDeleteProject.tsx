import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {  Trash2 } from "lucide-react";

type DeleteProjectConfirmationModalProps = {
  isOpen: boolean; 
  onClose: () => void; 
  onDeleteConfirm: () => void; 
};

// The component now accepts the typed props
const DeleteProjectConfirmationModal =
  ({}: DeleteProjectConfirmationModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDeleteConfirm = () => {
      console.log("Delete confirmed!");
      setIsModalOpen(false); // Close modal after delete
    };

    return (
      <div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          {/* Trigger to open the modal */}
          <DialogTrigger asChild>
            <Trash2
              onClick={() => setIsModalOpen(true)}
              className="text-destructive cursor-pointer"
            />
          </DialogTrigger>

          {/* Modal content */}
          <DialogContent  className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl text-foreground">Confirm Delete</DialogTitle>
              <DialogDescription className=" text-base my-2">
                Are you sure you want to delete this project?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)} variant="ghost" >Cancel</Button>
              <Button onClick={handleDeleteConfirm} variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

export default DeleteProjectConfirmationModal;
