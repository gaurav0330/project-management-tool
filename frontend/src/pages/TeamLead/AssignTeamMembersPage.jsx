import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// GraphQL Queries & Mutations
const GET_ALL_TEAM_MEMBERS = gql`
  query GetAllTeamMembers {
    getAllTeamMembers {
      id
      email
      role
    }
  }
`;

const ADD_MEMBERS_TO_TEAM = gql`
  mutation AddMemberToTeam($teamId: ID!, $teamMembers: [TeamMemberInput!]!) {
    addMemberToTeam(teamId: $teamId, teamMembers: $teamMembers) {
      success
      message
      team {
        id
        members {
          teamMemberId 
          memberRole
        }
      }
    }
  }
`;

function AssignTeamMembers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState([]);
  const teamId = "67c576657e93206daf547e56"; // Hardcoded for now

  // Fetch available members
  const { loading, error, data } = useQuery(GET_ALL_TEAM_MEMBERS);
  const [addMemberToTeam] = useMutation(ADD_MEMBERS_TO_TEAM);

  // Handle search input
  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Filter members based on search query and exclude already assigned members
  const availableMembers = data?.getAllTeamMembers?.filter(
    (member) =>
      !assignments.some((assigned) => assigned.teamMemberId === member.id) &&
      member.email.toLowerCase().includes(searchQuery)
  );

  // Assign a team member
  const handleAssign = (member) => {
    if (!assignments.some((assigned) => assigned.teamMemberId === member.id)) {
      setAssignments([...assignments, { teamMemberId: member.id, memberRole: member.role || "Member" }]);
    }
  };

  // Remove an assigned member
  const handleRemove = (id) => {
    setAssignments(assignments.filter((member) => member.teamMemberId !== id));
  };

  // Save Assignments
  const handleSaveAssignments = async () => {
    try {
      const response = await addMemberToTeam({
        variables: { teamId, teamMembers: assignments },
      });

      if (response.data.addMemberToTeam.success) {
        alert("Members assigned successfully!");
        navigate("/ProjectHome"); // Ensure this route exists
      } else {
        alert("Failed: " + response.data.addMemberToTeam.message);
      }
    } catch (error) {
      console.error("Error assigning members:", error);
      alert("An error occurred while assigning members.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center items-center">
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Assign Team Members</h2>
          <button
            onClick={handleSaveAssignments}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Members */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-700">Available Members</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">Error fetching members</p>
            ) : (
              <div className="space-y-2 h-48 overflow-y-auto border rounded-md p-2">
                {availableMembers.length === 0 ? (
                  <p className="text-gray-500">No members found</p>
                ) : (
                  availableMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                      onClick={() => handleAssign(member)}
                    >
                      <p className="text-sm font-medium text-gray-900">{member.email} ({member.role})</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Assigned Members */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-700">Assigned Members</h3>
            {assignments.length === 0 ? (
              <p className="text-gray-500">No members assigned yet.</p>
            ) : (
              <div className="space-y-2 h-48 overflow-y-auto border rounded-md p-2">
                {assignments.map((member) => (
                  <div key={member.teamMemberId} className="flex items-center justify-between p-2 bg-green-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Member ID: {member.teamMemberId} ({member.memberRole})</p>
                    <button onClick={() => handleRemove(member.teamMemberId)}>
                      <X className="w-5 h-5 text-red-500 transition hover:text-red-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignTeamMembers;
