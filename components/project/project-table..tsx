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
import { ChevronLeft, ChevronRight } from "lucide-react";
import DeleteProjectConfirmationModal from "@/components/project/DeleteProjectModal";

type Project = {
  uuid: string; // Changed to `uuid` with type string
  name: string;
  createdAt: string;
};

const ITEMS_PER_PAGE = 10;

async function fetchProject(query: string): Promise<Project[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allProjects: Project[] = [
    { uuid: "1e456d4f-4c9b-4726-b8a7-1f6a12345678", name: "Spring Scan", createdAt: "Nov 21, 2024" },
    { uuid: "2e456d4f-4c9b-4726-b8a7-1f6a12345678", name: "HNextJs Scan", createdAt: "Nov 21, 2024" },
    { uuid: "3e456d4f-4c9b-4726-b8a7-1f6a12345678", name: "NextJs Scan", createdAt: "Nov 21, 2024" },
    { uuid: "4e456d4f-4c9b-4726-b8a7-1f6a12345678", name: "Laravel Scan", createdAt: "Nov 21, 2024" },
    { uuid: "5e456d4f-4c9b-4726-b8a7-1f6a12345678", name: "Go Scan", createdAt: "Nov 21, 2024" },
  ];

  if (!query) return allProjects;

  return allProjects.filter((project) =>
    project.name.toLowerCase().includes(query.toLowerCase())
  );
}

export function ProjectTable({ query = "" }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]); // Using string for UUIDs
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    console.log("Delete confirmed!");
    // Implement delete logic here
    setIsModalOpen(false); // Close the modal after confirming deletion
  };

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const fetchedProjects = await fetchProject(query);
      setProjects(fetchedProjects);
      setCurrentPage(1);
      setSelectedProjects([]);
      setIsLoading(false);
    };

    loadProjects();
  }, [query]);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedProjects.length === currentProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(currentProjects.map((project) => project.uuid));
    }
  };

  const handleSelectProject = (projectUuid: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectUuid)
        ? prev.filter((uuid) => uuid !== projectUuid)
        : [...prev, projectUuid]
    );
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="rounded-md bg-card border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedProjects.length === currentProjects.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProjects.map((project) => (
            <TableRow key={project.uuid}>
              <TableCell>
                <Checkbox
                  checked={selectedProjects.includes(project.uuid)}
                  onCheckedChange={() => handleSelectProject(project.uuid)}
                />
              </TableCell>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.createdAt}</TableCell>
              <TableCell>
                <DeleteProjectConfirmationModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  onDeleteConfirm={handleDeleteConfirm}
                />
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
            {startIndex + 1}-{Math.min(endIndex, projects.length)} of{" "}
            {projects.length}
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
