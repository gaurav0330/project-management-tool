import { useState } from "react";
import Sidebar from "../../components/Other/sideBar";
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectCard from "../../components/Other/ProjectCard"; // Import the ProjectCard component
import MyTasksPage from "./MyTasksPage";
import TaskSubmissionPage from "./TaskSubmissionPage";

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
  const [activeComponent, setActiveComponent] = useState("overview"); // State for active section

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 min-h-screen p-6 bg-white shadow-md">
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>

      {/* Main Content Area */}
      <div className="w-4/5 p-8 overflow-auto">
        {activeComponent === "tasks" ? (
          <MyTasksPage />
        ) : activeComponent === "taskSubmission" ? (
          <TaskSubmissionPage />
        ) : (
          <>
            <h2 className="text-2xl font-semibold">Projects Overview</h2>
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            {/* Project List using ProjectCard */}
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
