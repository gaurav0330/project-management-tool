import React, { useState, useEffect } from "react";
import { Search, User, X, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";

// ✅ Fetch all leads
const GET_ALL_LEADS = gql`
  query {
    getAllLeads {
      id
      username
      email
    }
  }
`;

// ✅ Assign Team Lead Mutation
const ASSIGN_TEAM_LEAD = gql`
  mutation AssignTeamLead($projectId: ID!, $teamLeads: [TeamLeadInput!]!) {
    assignTeamLead(projectId: $projectId, teamLeads: $teamLeads) {
      success
      message
      project {
        id
        teamLeads {
          teamLeadId {
            id
            username
          }
          leadRole
        }
      }
    }
  }
`;

function AssignMembers({ projectId }) {
  const { loading, error, data } = useQuery(GET_ALL_LEADS);
  const [assignTeamLead, { loading: assigning }] = useMutation(ASSIGN_TEAM_LEAD);
  const navigate = useNavigate();

  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (data?.getAllLeads) {
      setFilteredLeads(data.getAllLeads);
    }
  }, [data]);

  // ✅ Handle Search Input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredLeads(
      data?.getAllLeads.filter(
        (lead) =>
          lead.username.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query)
      ) || []
    );
  };

  // ✅ Assign multiple leads (Prevent duplicate entries)
  const handleAssignLead = (lead) => {
    setAssignments((prevAssignments) => {
      if (!prevAssignments.some((l) => l.id === lead.id)) {
        return [...prevAssignments, { ...lead, leadRole: "" }];
      }
      return prevAssignments;
    });
  };

  // ✅ Remove a lead
  const handleRemoveAssignment = (leadId) => {
    setAssignments((prevAssignments) => prevAssignments.filter((lead) => lead.id !== leadId));
  };

  // ✅ Update lead role
  const handleRoleChange = (leadId, role) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((lead) =>
        lead.id === leadId ? { ...lead, leadRole: role } : lead
      )
    );
  };

  // ✅ Submit assigned leads to backend
  const handleSaveAssignments = async () => {
    try {
      const teamLeads = assignments.map(({ id, leadRole }) => ({
        teamLeadId: String(id),
        leadRole: String(leadRole),
      }));

      const response = await assignTeamLead({
        variables: {
          projectId: String(projectId),
          teamLeads,
        },
      });

      if (response.data.assignTeamLead.success) {
        alert("✅ Team leads assigned successfully!");
        navigate(`/ProjectHome/${projectId}`)
        // Redirect after success
      } else {
        alert(`⚠️ ${response.data.assignTeamLead.message}`);
      }
    } catch (error) {
      console.error("Error assigning team leads:", error);
      alert("❌ Failed to assign team leads.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Assign Team Leads</h2>
          <button
            onClick={handleSaveAssignments}
            disabled={assigning}
            className={`px-4 py-2 rounded-md text-white transition ${
              assigning ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {assigning ? <Loader className="animate-spin" size={18} /> : "Save Assignments"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Available Team Leads */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-sm font-medium text-gray-700">Available Team Leads</h3>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
            </div>

            {loading ? (
              <p className="text-gray-500">Loading leads...</p>
            ) : error ? (
              <p className="text-red-500">Error fetching leads</p>
            ) : filteredLeads.length === 0 ? (
              <p className="text-gray-500">No leads found</p>
            ) : (
              <div className="space-y-2">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center p-2 transition border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => handleAssignLead(lead)}
                  >
                    <User className="w-8 h-8 text-gray-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{lead.username}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Team Leads */}
          <div className="md:col-span-2">
            <h3 className="mb-4 text-sm font-medium text-gray-700">Assigned Team Leads</h3>
            {assignments.length === 0 ? (
              <p className="text-gray-500">No team leads assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {assignments.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="w-full">
                      <p className="text-sm font-medium text-gray-900">{lead.username}</p>
                      <input
                        type="text"
                        placeholder="Role (e.g., Design Lead)"
                        value={lead.leadRole}
                        onChange={(e) => handleRoleChange(lead.id, e.target.value)}
                        className="w-full px-2 py-1 mt-1 text-sm border rounded-md focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <button onClick={() => handleRemoveAssignment(lead.id)}>
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

export default AssignMembers;
