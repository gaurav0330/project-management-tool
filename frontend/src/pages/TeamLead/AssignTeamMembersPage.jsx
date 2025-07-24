import React, { useState, useMemo } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🚀 GraphQL operations
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

function AssignTeamMembers({ projectId, teamId }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState([]);

  const { loading, error, data } = useQuery(GET_ALL_TEAM_MEMBERS);
  const [addMemberToTeam, { loading: saving }] = useMutation(ADD_MEMBERS_TO_TEAM);

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  const availableMembers = useMemo(() => {
    return data?.getAllTeamMembers?.filter(
      (member) =>
        !assignments.find((a) => a.teamMemberId === member.id) &&
        member.email.toLowerCase().includes(searchQuery)
    ) || [];
  }, [data, assignments, searchQuery]);

  const handleAssign = (member) => {
    if (!assignments.find((m) => m.teamMemberId === member.id)) {
      setAssignments([
        ...assignments,
        {
          teamMemberId: member.id,
          memberRole: member.role || "Member",
          email: member.email,
        },
      ]);
    }
  };

  const handleRemove = (id) => {
    setAssignments(assignments.filter((m) => m.teamMemberId !== id));
  };

  const handleSaveAssignments = async () => {
    if (assignments.length === 0) {
      alert("Please assign at least one member.");
      return;
    }
    try {
      const { data } = await addMemberToTeam({
        variables: {
          teamId,
          teamMembers: assignments.map(({ teamMemberId, memberRole }) => ({ teamMemberId, memberRole })),
        },
      });

      if (data.addMemberToTeam.success) {
        alert("Members added successfully!");
        navigate(-1); // Back to previous page or replace with project page
      } else {
        alert("Failed: " + data.addMemberToTeam.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="page-bg min-h-screen py-10 px-6 flex justify-center items-start">
      <div className="card w-full max-w-4xl">
        {/* 🚀 Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl heading-accent">Assign Team Members</h2>
          <button
            onClick={handleSaveAssignments}
            className="btn-primary px-6 py-2"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {/* 🔎 Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full block px-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-bg-accent-light dark:bg-bg-accent-dark placeholder-txt-secondary-light dark:placeholder-txt-secondary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
          />
          <Search className="absolute right-4 top-3 w-5 h-5 text-txt-muted" />
        </div>

        {/* 👥 Members Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Available Members */}
          <div>
            <h3 className="text-md font-medium text-heading-primary-light dark:text-heading-primary-dark mb-3">
              Available Members
            </h3>
            <div className="border rounded-xl h-60 overflow-y-auto space-y-2 p-3 bg-bg-accent-light dark:bg-bg-accent-dark">
              {loading ? (
                <p className="text-muted">Loading...</p>
              ) : error ? (
                <p className="text-error font-medium">Error loading users.</p>
              ) : availableMembers.length === 0 ? (
                <p className="text-muted">No users available.</p>
              ) : (
                availableMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleAssign(member)}
                    className="cursor-pointer flex justify-between items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900 transition"
                  >
                    <span className="text-sm">
                      <span className="font-medium">{member.email}</span>{" "}
                      <span className="text-muted">({member.role})</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assigned Members */}
          <div>
            <h3 className="text-md font-medium text-heading-primary-light dark:text-heading-primary-dark mb-3">
              Assigned Members
            </h3>
            <div className="border rounded-xl h-60 overflow-y-auto space-y-2 p-3 bg-bg-accent-light dark:bg-bg-accent-dark">
              {assignments.length === 0 ? (
                <p className="text-muted">No members assigned yet.</p>
              ) : (
                assignments.map((member) => (
                  <div
                    key={member.teamMemberId}
                    className="flex justify-between items-center bg-green-100 dark:bg-green-900/40 text-sm px-3 py-2 rounded-md"
                  >
                    <span>
                      <span className="font-medium">{member.email}</span>{" "}
                      <span className="text-muted">({member.memberRole})</span>
                    </span>
                    <X
                      size={18}
                      onClick={() => handleRemove(member.teamMemberId)}
                      className="cursor-pointer text-error hover:text-red-800 transition"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignTeamMembers;
