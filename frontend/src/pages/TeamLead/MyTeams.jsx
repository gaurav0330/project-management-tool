import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { FaPlus, FaUserPlus, FaEllipsisH } from "react-icons/fa";
import { gql } from "@apollo/client";
import {jwtDecode} from "jwt-decode"; // ✅ Fix import

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
    const token = localStorage.getItem("token"); // ✅ Handle localStorage safely
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    // console.log(decoded);
    // console.log(decoded.id);
    return decoded.id || null; // ✅ Use _id as leadId
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};



const MyTeams = () => {
  const { projectId } = useParams(); // ✅ Get projectId from URL
  const leadId = getTokenLeadId(); // ✅ Extract leadId from token
  const [search, setSearch] = useState("");

  const { loading, error, data } = useQuery(GET_TEAMS_BY_PROJECT_AND_LEAD, {
    variables: { projectId, leadId },
    skip: !projectId || !leadId, // ✅ Prevent unnecessary API calls
  });

 
  if (loading) return <div className="text-center">Loading teams...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  const teams = data?.getTeamsByProjectAndLead || [];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Teams Dashboard</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg">
            <FaPlus /> Create Team
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3 p-2 border rounded-md"
          />
          <div className="flex gap-4">
            <select className="p-2 border rounded-md">
              <option>Sort by</option>
            </select>
            <select className="p-2 border rounded-md">
              <option>All Teams</option>
            </select>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {teams
            .filter((team) => team.teamName.toLowerCase().includes(search.toLowerCase()))
            .map((team) => (
              <div key={team.id} className="p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{team.teamName}</h3>
                  <FaEllipsisH className="text-gray-500 cursor-pointer" />
                </div>
                <p className="mb-2 text-sm text-gray-500">Created {team.createdAt}</p>
                <p className="mb-3 text-gray-700">{team.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">+ Members</span>
                  <button className="flex items-center gap-1 ml-auto text-blue-600">
                    <FaUserPlus /> Invite
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyTeams;
