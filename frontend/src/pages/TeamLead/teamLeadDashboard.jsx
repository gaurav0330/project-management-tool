import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode"; // Ensure you installed: npm install jwt-decode
import ProjectCard from "../../components/Other/ProjectCard";
import Filters from "../../components/TeamLeadComponent/Filters";
import Footer from "../../components/Other/Footer";
import { Skeleton } from "../../components/UI/Skeleton";
import SkeletonCard from "../../components/UI/SkeletonCard";

// ✅ GraphQL Query (Using leadId as a variable)
const GET_PROJECTS_BY_LEAD_ID = gql`
  query GetProjectsByLeadId($leadId: ID!) {
    getProjectsByLeadId(leadId: $leadId) {
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

const TeamLeadDashboard = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [leadId, setLeadId] = useState(null);

  // ✅ Extract Lead ID from Token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // console.log("🔑 Decoded Token:", decoded); // Debugging
        setLeadId(decoded.userId || decoded.id || decoded._id); // Use the correct field
      } catch (error) {
        console.error("❌ Invalid token:", error);
      }
    }
  }, []);

  // ✅ Fetch Projects
  const { data, loading, error } = useQuery(GET_PROJECTS_BY_LEAD_ID, {
    variables: { leadId: leadId || "" }, // Ensures query doesn't fail
    skip: !leadId, // Prevents query execution if leadId is not available
    fetchPolicy: "network-only", // Ensures fresh data is fetched
  });

  // console.log("🔍 Apollo Query Response:", { data, loading, error });
  if (error) console.error("❌ GraphQL Error:", error);

  // ✅ Filter Projects Based on Search and Status
  const filteredProjects = data?.getProjectsByLeadId?.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  ) || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
  <div className="flex-1 h-full min-h-screen p-6 overflow-auto bg-gray-100">
    <h2 className="text-2xl font-semibold">Projects Overview</h2>

    <Filters
      search={search}
      setSearch={setSearch}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
    />

    {/* Loading Skeletons */}
    {loading && (
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )}

    {/* Error Handling */}
    {error && <p className="text-red-500">{error.message}</p>}

    {/* Display Projects */}
    {!loading && !error && (
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    )}
  </div>

  {/* Footer at bottom */}
  <Footer />
</div>

  );
};

export default TeamLeadDashboard;
