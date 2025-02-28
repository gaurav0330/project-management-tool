import React, { useState } from "react";
import Header from "../../components/TeamLeadComponent/Header";
import Filters from "../../components/TeamLeadComponent/Filters";
import Sidebar from "../../components/Other/sideBar";
import ProjectCard from "../../components/Other/card"; // Correct import
import TaskManagementPage from "./TaskManagementPage";
import DisplayTeamTaskPage from "./DisplayTeamTaskPage";
import TaskDistributionPage from "./TaskDistributionPage";

const initialProjects = [
  {
    id: 1,
    title: "Website Redesign",
    status: "Active",
    description: "Redesigning the company website with modern UI/UX.",
    members: ["Sarah", "John", "Emma"],
    startDate: "Jan 15",
    endDate: "Mar 30",
  },
  {
    id: 2,
    title: "Mobile App Development",
    status: "On Hold",
    description: "Creating a new mobile application for iOS and Android.",
    members: ["Mike", "Anna"],
    startDate: "Feb 1",
    endDate: "Apr 15",
  },
  {
    id: 3,
    title: "Marketing Campaign",
    status: "Completed",
    description: "Q1 2025 Digital Marketing Campaign for product launch.",
    members: ["Chris", "Jane", "Leo", "Emma"],
    startDate: "Jan 1",
    endDate: "Mar 15",
  },
];

const TeamLeadDashboard = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeComponent, setActiveComponent] = useState("projects"); // Default to 'projects'

  const filteredProjects = initialProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 min-h-screen p-6 bg-white shadow-md">
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeComponent === "taskManagement" && <TaskManagementPage />}
        {activeComponent === "displayTeamTask" && <DisplayTeamTaskPage />}
        {activeComponent === "taskDistribution" && <TaskDistributionPage />}

        {activeComponent === "projects" && (
          <div>
            <h2 className="text-2xl font-semibold">Projects Overview</h2>
            <Filters
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            {/* Project List */}
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamLeadDashboard;
