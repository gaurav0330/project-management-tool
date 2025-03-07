import { useState } from "react";
import { useQuery, gql } from "@apollo/client"; // Apollo Client for GraphQL
import { jwtDecode } from "jwt-decode"; // Safely decode JWT
import ProjectCard from "../../components/Other/ProjectCard"; 
import MyTasksPage from "./MyTasksPage";
import TaskSubmissionPage from "./TaskSubmissionMemberPage";
import SkeletonCard from "../../components/UI/SkeletonCard"; // Ensure this path is correct
import Footer from "../../components/Other/Footer";

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
    const decoded = jwtDecode(token); // Use jwt-decode for safer handling
    return decoded.id; // Extract memberId
  } catch (error) {
    console.error("Invalid token:", error);
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

  if (error)
    return <p className="text-center text-red-500">Error fetching projects: {error.message}</p>;

  const projects = data?.getProjectsByMember || [];
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  return (
    <div>
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-4/5 p-8 overflow-auto">
          {activeComponent === "tasks" ? (
            <MyTasksPage />
          ) : activeComponent === "taskSubmission" ? (
            <TaskSubmissionPage />
          ) : (
            <>
              {/* Display Skeleton Cards While Loading */}
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
        </div>
      </div>
      <Footer />
    </div>
  );
}
