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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteProjectConfirmationModal from "@/components/project/ModalDeleteProject";
import { useGetAllProjectsNameQuery } from "@/redux/service/project";
import { ProjectNameType } from "@/types/ProjectNameType";
import { convertToDayMonthYear } from "@/lib/utils";
import { ProjectTableFilter } from "@/components/project/ProjectTableFilter";

const ITEMS_PER_PAGE = 10;

interface Column {
  id: keyof ProjectNameType;
  label: string;
  checked: boolean;
}

export function ProjectTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Column[]>([
    { id: "projectName", label: "Project Name", checked: true },
    { id: "createdAt", label: "Created At", checked: true },
  ]);

  const { data: projectsData, isLoading, isError } = useGetAllProjectsNameQuery();

  const projects = projectsData?.data || [];
  console.log(projects)

  const filteredProjects = projects.filter((project: ProjectNameType) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(project).some(([key,value]) =>
      value.toString().toLowerCase().includes(filterValue.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const totalProjects = filteredProjects.length;

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = () => {
    setSelectedProjects(
      selectedProjects.length === paginatedProjects.length
        ? []
        : paginatedProjects.map((project: { projectName: unknown }) => project.projectName)
    );
  };

  const handleSelectProject = (projectName: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectName) ? prev.filter((name) => name !== projectName) : [...prev, projectName]
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    console.log("Delete confirmed!");
    // Implement delete logic here
    setIsModalOpen(false);
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handleColumnsChange = (columns: Column[]) => {
    setVisibleColumns(columns);
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (isError) {
    return <div>Error loading projects. Please try again later.</div>;
  }

  return (
    <div className="space-y-4">
      <ProjectTableFilter onFilterChange={handleFilterChange} onColumnsChange={handleColumnsChange} />
      <div className="rounded-md bg-card border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProjects.length === paginatedProjects.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {visibleColumns.map((column) => column.checked && (
                <TableHead key={column.id}>{column.label}</TableHead>
              ))}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.map((project: ProjectNameType, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={selectedProjects.includes(project.projectName)}
                    onCheckedChange={() => handleSelectProject(project.projectName)}
                  />
                </TableCell>
                {visibleColumns.map((column) => column.checked && (
                  <TableCell key={column.id}>
                    {column.id === 'createdAt' 
                      ? convertToDayMonthYear(project[column.id])
                      : project[column.id]}
                  </TableCell>
                ))}
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
              {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(
                currentPage * ITEMS_PER_PAGE,
                totalProjects
              )} of {totalProjects}
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

