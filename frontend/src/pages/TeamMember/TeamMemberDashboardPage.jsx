import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client"; // Apollo Client for GraphQL
import Sidebar from "../../components/Other/sideBar";
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectCard from "../../components/Other/ProjectCard"; 
import MyTasksPage from "./MyTasksPage";
import TaskSubmissionPage from "./TaskSubmissionMemberPage";

// GraphQL Query
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

// Function to extract memberId from token
const getMemberIdFromToken = () => {
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return decodedToken.id; // Extract memberId
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default function TeamMemberDashboardPage() {
  const memberId = getMemberIdFromToken();
  const { data, loading, error } = useQuery(GET_PROJECTS_BY_MEMBER, {
    variables: { memberId },
    skip: !memberId, // Skip query if no memberId found
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeComponent, setActiveComponent] = useState("overview");

  const projects = data?.getProjectsByMember || [];

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error fetching projects: {error.message}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      

      <div className="w-4/5 p-8 overflow-auto">
        {activeComponent === "tasks" ? (
          <MyTasksPage />
        ) : activeComponent === "taskSubmission" ? (
          <TaskSubmissionPage />
        ) : (
          <>
            <h2 className="text-2xl font-semibold">My Projects </h2>
            {/* <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            /> */}

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
