import React, { useState, useEffect } from "react";
import { Search, User, X, Loader, Plus, UserCheck, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

// GraphQL Queries and Mutations
const GET_ALL_LEADS = gql`
  query {
    getAllLeads {
      id
      username
      email
    }
  }
`;

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
  const { isDark } = useTheme();
  const { loading, error, data } = useQuery(GET_ALL_LEADS);
  const [assignTeamLead, { loading: assigning }] = useMutation(ASSIGN_TEAM_LEAD);
  const navigate = useNavigate();

  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

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

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
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
        setShowSuccess(true);
        showNotification("success", "Team leads assigned successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification("warning", response.data.assignTeamLead.message);
      }
    } catch (error) {
      console.error("Error assigning team leads:", error);
      showNotification("error", "Failed to assign team leads. Please try again.");
    }
  };

  const isLeadAssigned = (leadId) => assignments.some(a => a.id === leadId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-brand-primary-500" />
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark">Loading team leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark p-6">
      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-bg-primary-light dark:bg-bg-primary-dark p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-brand-accent-500 to-brand-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                Assignment Successful!
              </h3>
              <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
                Team leads have been assigned successfully
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className="fixed top-4 right-4 z-40"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
          >
            <div className={`p-4 rounded-xl shadow-lg border ${
              notification.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
              notification.type === 'error' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
              'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
            }`}>
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800 dark:text-green-200' :
                notification.type === 'error' ? 'text-red-800 dark:text-red-200' :
                'text-yellow-800 dark:text-yellow-200'
              }`}>
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                Assign Team Leads
              </h1>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                Select and assign team leads with specific roles for your project
              </p>
            </div>
            
            <motion.button
              onClick={handleSaveAssignments}
              disabled={assigning || assignments.length === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                assigning || assignments.length === 0
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              }`}
              whileHover={!assigning && assignments.length > 0 ? { scale: 1.02 } : {}}
              whileTap={!assigning && assignments.length > 0 ? { scale: 0.98 } : {}}
            >
              {assigning ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5" />
                  Save Assignments ({assignments.length})
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Available Team Leads */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
                <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-primary-500" />
                  Available Team Leads
                </h3>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark transition-all duration-200"
                  />
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <motion.div
                        key={lead.id}
                        className={`flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isLeadAssigned(lead.id)
                            ? 'bg-brand-primary-50 dark:bg-brand-primary-900/20 border-brand-primary-200 dark:border-brand-primary-700'
                            : 'bg-bg-accent-light dark:bg-bg-accent-dark border-gray-200 dark:border-gray-600 hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark hover:border-brand-primary-300 dark:hover:border-brand-primary-600'
                        }`}
                        onClick={() => !isLeadAssigned(lead.id) && handleAssignLead(lead)}
                        whileHover={!isLeadAssigned(lead.id) ? { scale: 1.02 } : {}}
                        whileTap={!isLeadAssigned(lead.id) ? { scale: 0.98 } : {}}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isLeadAssigned(lead.id)
                            ? 'bg-brand-primary-500 text-white'
                            : 'bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 text-brand-primary-600 dark:text-brand-primary-400'
                        }`}>
                          {isLeadAssigned(lead.id) ? (
                            <UserCheck className="w-6 h-6" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="font-medium text-txt-primary-light dark:text-txt-primary-dark">
                            {lead.username}
                          </p>
                          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                            {lead.email}
                          </p>
                        </div>
                        {!isLeadAssigned(lead.id) && (
                          <Plus className="w-5 h-5 text-brand-primary-500" />
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-txt-secondary-light dark:text-txt-secondary-dark mx-auto mb-3 opacity-50" />
                      <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
                        {searchQuery ? 'No leads found matching your search' : 'No team leads available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assigned Team Leads */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/20">
                <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-brand-accent-500" />
                  Assigned Team Leads ({assignments.length})
                </h3>
              </div>

              <div className="p-6">
                {assignments.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {assignments.map((lead, index) => (
                        <motion.div
                          key={lead.id}
                          className="flex items-center gap-4 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200 dark:border-gray-600"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-accent-500 to-brand-accent-600 rounded-full flex items-center justify-center text-white">
                            <User className="w-6 h-6" />
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-medium text-txt-primary-light dark:text-txt-primary-dark mb-1">
                              {lead.username}
                            </p>
                            <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark mb-3">
                              {lead.email}
                            </p>
                            
                            <input
                              type="text"
                              placeholder="Enter domain/role (e.g., Frontend, Backend, DevOps)..."
                              value={lead.leadRole}
                              onChange={(e) => handleRoleChange(lead.id, e.target.value)}
                              className="w-full px-3 py-2 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark transition-all duration-200"
                            />
                          </div>
                          
                          <motion.button
                            onClick={() => handleRemoveAssignment(lead.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserCheck className="w-8 h-8 text-brand-primary-500" />
                    </div>
                    <h4 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                      No Team Leads Assigned
                    </h4>
                    <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
                      Select team leads from the available list to assign them to this project
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AssignTeamLead;
