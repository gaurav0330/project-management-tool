import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Sidebar from "../../components/Other/sideBar";
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectCard from "../../components/Other/ProjectCard";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";
import AssignTasks from "../../components/tasks/AssignTasks";
import CreateProjectPage from "../../pages/ProjectManager/CreateProjectPage";
import TaskApprovalPage from "./TaskApprovalPage";
import TeamMemberDashboardPage from "../TeamMember/TeamMemberDashboardPage";
import TeamLeadDashboard from "../../pages/TeamLead/teamLeadDashboard";

// GraphQL Query to Fetch All Projects
const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    getAllProjects {
      id
      title
      description
      startDate
      endDate
      category
    }
  }
`;


export default function ProjectDashboard() {
  const { loading, error, data } = useQuery(GET_ALL_PROJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeComponent, setActiveComponent] = useState("overview");

  if (loading) return <p className="text-center text-gray-500">Loading projects...</p>;
  if (error) return <p className="text-center text-red-500">Error loading projects.</p>;

  const projects = data?.getAllProjects || [];

  // Filter projects based on search and status
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-full min-h-screen bg-white shadow-lg">
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>

      {/* Main Content Area */}
      <div className="w-4/5 p-8 overflow-auto">
        {activeComponent === "addproject" ? (
          <CreateProjectPage />
        ) : activeComponent === "taskapproval" ? (
          <TaskApprovalPage />
        ) : activeComponent === "tasks" ? (
          <AssignTasks />
        ) : activeComponent === "members" ? (
          <AssignTeamLead />
        ) : activeComponent === "teammember" ? (
          <TeamMemberDashboardPage />
        ) : activeComponent === "teamlead" ? (
          <TeamLeadDashboard />
        ) : (
          <>
            {/* Project Overview Header */}
            <h2 className="text-2xl font-semibold">Projects Overview</h2>

            {/* Filter Bar */}
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
