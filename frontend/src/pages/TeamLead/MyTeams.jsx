import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import TeamCard from "../../components/Other/TeamCard";

// GraphQL Query
const GET_TEAMS_BY_PROJECT_AND_LEAD = gql`
  query GetTeamsByProjectAndLead($projectId: ID!, $leadId: ID!) {
    getTeamsByProjectAndLead(projectId: $projectId, leadId: $leadId) {
      id
      teamName
      description
      createdAt
    }
  }
`;

// Function to decode JWT and get leadId
export const getTokenLeadId = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    return decoded.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const MyTeams = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const leadId = getTokenLeadId();
  const [search, setSearch] = useState("");

  const { loading, error, data } = useQuery(GET_TEAMS_BY_PROJECT_AND_LEAD, {
    variables: { projectId, leadId },
    skip: !projectId || !leadId,
  });

  if (loading) return <div className="py-6 text-center text-gray-500">Loading teams...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  const teams = data?.getTeamsByProjectAndLead || [];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl p-6 mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Teams</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
            <FaPlus /> Create Team
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Teams Grid */}
        {teams
  .filter((team) => team.teamName.toLowerCase().includes(search.toLowerCase()))
  .map((team) => (
    <TeamCard key={team.id} team={team} projectId={projectId} navigate={navigate} />
  ))}
      </div>
    </div>
  );
};

export default MyTeams;
