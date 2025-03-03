import { useState } from "react";
import { useQuery, gql } from "@apollo/client"; // Apollo Client for GraphQL
import Sidebar from "../../components/Other/sideBar";
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectCard from "../../components/Other/ProjectCard";  
import MyTasksPage from "./MyTasksPage";
import TaskSubmissionPage from "./TaskSubmissionPage";

// 🔹 GraphQL Query for fetching projects
const GET_PROJECTS_BY_MEMBER = gql`
  query GetProjectsByMember($memberId: ID!) {
    getProjectsByMember(memberId: $memberId) {
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

// 🔹 Function to extract memberId from token
const getMemberIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return decodedToken.memberId;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
};

export default function TeamMemberDashboardPage() {
  const memberId = getMemberIdFromToken();

  // 🔹 Fetch projects from GraphQL
  const { data, loading, error } = useQuery(GET_PROJECTS_BY_MEMBER, {
    variables: { memberId },
    skip: !memberId,
  });

  // 🔹 Component States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeComponent, setActiveComponent] = useState("overview");

  // 🔹 Extract projects from data
  const projects = data?.getProjectsByMember || [];

  // 🔹 Filter projects based on search & status
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  // 🔹 Handle loading & error states
  if (loading) return <p className="text-center text-gray-500">Loading projects...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching projects: {error.message}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar with Fixed Width */}
      <div className="w-1/6 min-w-[250px] flex-shrink-0 bg-white shadow-md">
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-8 overflow-auto">
        {activeComponent === "tasks" ? (
          <MyTasksPage />
        ) : activeComponent === "taskSubmission" ? (
          <TaskSubmissionPage />
        ) : (
          <>
            {/* Header */}
            <h2 className="text-2xl font-semibold">Projects Overview</h2>

            {/* FilterBar */}
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />

            {/* Project List */}
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">No projects found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
