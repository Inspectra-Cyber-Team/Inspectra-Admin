"use client";

import { useState} from "react";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import DeleteProjectConfirmationModal from "@/components/project/ModalDeleteProject";
import { useGetAllProjectsNameQuery } from "@/redux/service/project";
import { ProjectNameType } from "@/types/ProjectNameType";
import { convertToDayMonthYear } from "@/lib/utils";


const ITEMS_PER_PAGE = 10;


export function ProjectTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]); // Using string for UUIDs
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: projectsData, isLoading, isError } = useGetAllProjectsNameQuery();
  console.log(projectsData)

  const projects = projectsData?.data || [];
  const totalPages = projectsData?.totalPages || 1;
  const totalprojects = projectsData?.totalElements || 0;

  const handleSelectAll = () => {
    setSelectedProjects(
      selectedProjects.length === projects.length
        ? []
        : projects.map((project: { uuid: unknown }) => project.uuid)
    );
  };

  const handleSelectProject = (uuid: string) => {
    setSelectedProjects((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    console.log("Delete confirmed!");
    // Implement delete logic here
    setIsModalOpen(false); // Close the modal after confirming deletion
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (isError) {
    return <div>Error loading projects. Please try again later.</div>;
  }

  return (
    <div className="rounded-md bg-card border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedProjects.length === projects.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {projects?.map((project: ProjectNameType, index: number) =>
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                   checked={selectedProjects.includes(project.projectName)}
                   onCheckedChange={() => handleSelectProject(project.projectName)}
                />
              </TableCell>
              <TableCell>{project?.projectName || "None"}</TableCell>
              <TableCell>{convertToDayMonthYear(project?.createdAt)}</TableCell>
              <TableCell>
                <DeleteProjectConfirmationModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  onDeleteConfirm={handleDeleteConfirm}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-t flex-wrap">
        <div className="text-sm text-muted-foreground">Rows per page: {ITEMS_PER_PAGE}</div>
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
              totalprojects
            )} of {totalprojects}
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
  );
}
