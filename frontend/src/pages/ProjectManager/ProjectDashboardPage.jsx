import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode"; // Install this if not already installed // Import Skeleton from ShadCN
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectCard from "../../components/Other/ProjectCard";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";
import AssignTasks from "../../components/tasks/AssignTasks";
import CreateProjectPage from "../../pages/ProjectManager/CreateProjectPage";
import TaskApprovalPage from "./TaskApprovalPage";
import TeamMemberDashboardPage from "../TeamMember/TeamMemberDashboardPage";
import TeamLeadDashboard from "../../pages/TeamLead/teamLeadDashboard";
import Footer from "../../components/Other/Footer";
import  SkeletonCard  from "../../components/UI/SkeletonCard";

// Function to get managerId from the token
const getManagerIdFromToken = () => {
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id; // Ensure this matches the key in your token payload
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

// GraphQL Query to Fetch Projects by Manager ID
const GET_PROJECTS_BY_MANAGER_ID = gql`
  query GetProjectsByManagerId($managerId: ID!) {
    getProjectsByManagerId(managerId: $managerId) {
      id
      title
      description
      startDate
      endDate
      category
      status
    }
  }
`;

export default function ProjectDashboard() {
  const managerId = getManagerIdFromToken(); // Extract managerId from token

  const { loading, error, data } = useQuery(GET_PROJECTS_BY_MANAGER_ID, {
    variables: { managerId }, // Pass managerId dynamically
    skip: !managerId, // Skip query if managerId is not available
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeComponent, setActiveComponent] = useState("overview");

  if (!managerId) {
    return <p className="text-center text-red-500">Unauthorized: No valid token found.</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading projects.</p>;
  }

  const projects = data?.getProjectsByManagerId || [];

  // Filter projects based on search and status
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content Area */}
      <div className="w-screen p-8 overflow-auto">
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

            <button
              onClick={() => setActiveComponent("addproject")}
              className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              + Add Project
            </button>

            {/* Show Skeleton while loading */}
            {loading ? (
              <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </>
        )}
        <Footer />
      </div>
    </div>
  );
}
