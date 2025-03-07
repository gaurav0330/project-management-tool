import React, { useState, useEffect } from "react";
import { Search, User, X, Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

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
    }
  }
`;

function AssignTeamLead() {
  const { projectId } = useParams();
  const { loading, error, data } = useQuery(GET_ALL_LEADS);
  const [assignTeamLead, { loading: assigning }] = useMutation(ASSIGN_TEAM_LEAD);
  const navigate = useNavigate();

  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (data?.getAllLeads) {
      setFilteredLeads(data.getAllLeads);
    }
  }, [data]);

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

  const handleAssignLead = (lead) => {
    setAssignments((prev) =>
      prev.some((l) => l.id === lead.id) ? prev : [...prev, { ...lead, leadRole: "" }]
    );
  };

  const handleRemoveAssignment = (leadId) => {
    setAssignments((prev) => prev.filter((lead) => lead.id !== leadId));
  };

  const handleRoleChange = (leadId, role) => {
    setAssignments((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, leadRole: role } : lead))
    );
  };

  const handleSaveAssignments = async () => {
    try {
      const teamLeads = assignments.map(({ id, leadRole }) => ({
        teamLeadId: id,
        leadRole,
      }));

      const response = await assignTeamLead({
        variables: { projectId, teamLeads },
      });

      if (response.data.assignTeamLead.success) {
        setSnackbarMessage("✅ Team leads assigned successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => navigate(window.location.reload()), 600);
      } else {
        setSnackbarMessage(`⚠️ ${response.data.assignTeamLead.message}`);
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error assigning team leads:", error);
      setSnackbarMessage("❌ Failed to assign team leads.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-10 bg-gray-50">
      <motion.div
        className="w-full max-w-5xl p-8 bg-white border border-gray-200 shadow-lg rounded-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Assign Team Leads</h2>
          <motion.button
            onClick={handleSaveAssignments}
            disabled={assigning}
            className={`px-5 py-2 rounded-lg text-white font-medium transition-all shadow-md ${assigning ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {assigning ? <Loader className="animate-spin" size={18} /> : "Save Assignments"}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div className="p-6 border border-gray-200 bg-gray-50 rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Available Team Leads</h3>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <div className="mt-4 space-y-3">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
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
          </motion.div>

          <motion.div className="p-6 border border-gray-200 md:col-span-2 bg-gray-50 rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Assigned Team Leads</h3>
            {assignments.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                <div className="w-full">
                  <p className="text-sm font-medium text-gray-900">{lead.username}</p>
                  <input
                    type="text"
                    placeholder="Enter role..."
                    value={lead.leadRole}
                    onChange={(e) => handleRoleChange(lead.id, e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
                <button onClick={() => handleRemoveAssignment(lead.id)}>
                  <X className="w-5 h-5 text-red-500 hover:text-red-700" />
                </button>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </div>
  );
}

export default AssignTeamLead;
