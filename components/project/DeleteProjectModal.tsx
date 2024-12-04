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
import { Trash2 } from "lucide-react";

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
              className="text-red-500 cursor-pointer"
            />
          </DialogTrigger>

          {/* Modal content */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this project?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

export default DeleteProjectConfirmationModal;
