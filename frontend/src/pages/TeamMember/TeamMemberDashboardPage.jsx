import { useState } from "react";
import Sidebar from "../../components/Other/sideBar";
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectList from "../../components/TeamMember/ProjectList";

const initialProjects = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Redesigning the company website with modern UI/UX principles and improved functionality.",
    status: "Active",
    members: ["Sarah", "John", "Emma"],
    startDate: "Jan 15",
    endDate: "Mar 30",
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Creating a new mobile application for iOS and Android platforms.",
    status: "On Hold",
    members: ["Mike", "Anna"],
    startDate: "Feb 1",
    endDate: "Apr 15",
  },
  {
    id: 3,
    title: "Marketing Campaign",
    description: "Q1 2025 Digital Marketing Campaign for product launch.",
    status: "Completed",
    members: ["Chris", "Jane", "Leo", "Emma"],
    startDate: "Jan 1",
    endDate: "Mar 15",
  },
];

export default function TeamMemberDashboardPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "All" || project.status === statusFilter)
  );

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-semibold">Projects Overview</h2>
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <ProjectList projects={filteredProjects} />
      </div>
    </div>
  );
}
