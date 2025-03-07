import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Other/sideBar";
import MyTasksPage from "./MyTasksPage";
import TaskSubmissionPage from "./TaskSubmissionMemberPage";
import Footer from "../../components/Other/Footer2";
import ProjectDetailsCard from "../../components/Other/ProjectDeailsCard";

// GraphQL Query for fetching project by ID
const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: ID!) {
    getProjectById(id: $id) {
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

export default function TeamMemberDashboardPage() {
  const { projectId } = useParams();

  // Fetch project data from GraphQL
  const { data, loading, error } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
  });

  // Component States
  const [activeComponent, setActiveComponent] = useState("overview");

  if (error) return <p className="text-center text-red-500">Error fetching project: {error.message}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-1/6 min-w-[250px] flex-shrink-0 bg-white shadow-lg">
          <Sidebar setActiveComponent={setActiveComponent} />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-8 overflow-auto">
          {activeComponent === "tasks" ? (
            <MyTasksPage />
          ) : activeComponent === "taskSubmission" ? (
            <TaskSubmissionPage />
          ) : (
            <ProjectDetailsCard project={data?.getProjectById} loading={loading} />
          )}
        </div>
      </div>

      {/* Footer (Sticks to the bottom) */}
      {/* <Footer /> */}
    </div>
  );
}
