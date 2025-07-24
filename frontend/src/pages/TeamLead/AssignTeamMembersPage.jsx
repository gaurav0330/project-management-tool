import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Search, X, Users, UserPlus, UserCheck, AlertCircle, Check, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

function AssignTeamMembers({ projectId, teamId }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });

  // Fetch available members
  const { loading, error, data, refetch } = useQuery(GET_ALL_TEAM_MEMBERS);
  const [addMemberToTeam] = useMutation(ADD_MEMBERS_TO_TEAM);

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "info" });
    }, 4000);
  };

  // Handle search input
  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Filter members based on search query and exclude already assigned members
  const availableMembers = data?.getAllTeamMembers?.filter(
    (member) =>
      !assignments.some((assigned) => assigned.teamMemberId === member.id) &&
      member.email.toLowerCase().includes(searchQuery)
  ) || [];

  // Get member details for assigned members
  const getAssignedMemberDetails = (memberId) => {
    return data?.getAllTeamMembers?.find(member => member.id === memberId);
  };

  // Assign a team member
  const handleAssign = (member) => {
    if (!assignments.some((assigned) => assigned.teamMemberId === member.id)) {
      setAssignments([...assignments, { teamMemberId: member.id, memberRole: member.role || "Member" }]);
      showNotification(`${member.email} added to team`, "success");
    }
  };

  // Remove an assigned member
  const handleRemove = (id) => {
    const member = getAssignedMemberDetails(id);
    setAssignments(assignments.filter((member) => member.teamMemberId !== id));
    if (member) {
      showNotification(`${member.email} removed from team`, "info");
    }
  };

  // Save Assignments
  const handleSaveAssignments = async () => {
    if (assignments.length === 0) {
      showNotification("Please assign at least one team member", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const response = await addMemberToTeam({
        variables: { teamId, teamMembers: assignments },
      });

      if (response.data.addMemberToTeam.success) {
        showNotification("Team members assigned successfully! You can now create tasks.", "success");
        setTimeout(() => {
          navigate(`/teamlead/project/${projectId}/${teamId}`);
        }, 2000);
      } else {
        showNotification(response.data.addMemberToTeam.message || "Failed to assign members", "error");
      }
    } catch (error) {
      console.error("Error assigning members:", error);
      showNotification("An error occurred while assigning members. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark flex items-center justify-center">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-2xl flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-brand-primary-500 animate-spin" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark">
            Loading Team Members...
          </h3>
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
            Please wait while we fetch available members
          </p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark flex items-center justify-center p-6">
        <motion.div 
          className="text-center space-y-6 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 mx-auto bg-error/10 dark:bg-error/20 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-error" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Failed to Load Members
            </h3>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
              {error.message || "Something went wrong while loading team members"}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 font-button font-semibold text-white bg-brand-primary-500 hover:bg-brand-primary-600 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 focus:ring-offset-bg-primary-light dark:focus:ring-offset-bg-primary-dark transform hover:scale-105"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-2xl shadow-xl border border-bg-accent-light dark:border-bg-accent-dark overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50 dark:from-brand-primary-900/20 dark:to-brand-secondary-900/20 border-b border-bg-accent-light dark:border-bg-accent-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-primary-600 dark:text-brand-primary-400" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                    Assign Team Members
                  </h1>
                  <p className="font-caption text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
                    Build your project team by assigning members
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-caption text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                    Assigned Members
                  </p>
                  <p className="font-heading text-2xl font-bold text-brand-primary-600 dark:text-brand-primary-400">
                    {assignments.length}
                  </p>
                </div>
                <button
                  onClick={handleSaveAssignments}
                  disabled={isLoading || assignments.length === 0}
                  className="px-6 py-3 font-button font-semibold text-white bg-brand-primary-500 hover:bg-brand-primary-600 disabled:bg-txt-muted-light disabled:cursor-not-allowed rounded-lg transition-all duration-200 focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 focus:ring-offset-bg-primary-light dark:focus:ring-offset-bg-primary-dark transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Save Team
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Search Input */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-txt-muted-light dark:text-txt-muted-dark" />
                <input
                  type="text"
                  placeholder="Search members by email..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 font-body bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-all duration-200 placeholder:text-txt-muted-light dark:placeholder:text-txt-muted-dark"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-txt-muted-light dark:text-txt-muted-dark" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Available Members */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <UserPlus className="w-5 h-5 text-brand-primary-500" />
                  <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                    Available Members
                  </h3>
                  <span className="font-caption text-sm text-txt-secondary-light dark:text-txt-secondary-dark bg-bg-accent-light dark:bg-bg-accent-dark px-2 py-1 rounded-full">
                    {availableMembers.length}
                  </span>
                </div>
                
                <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-xl border-2 border-bg-accent-light dark:border-bg-accent-dark p-4 h-80 overflow-y-auto">
                  {availableMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-brand-primary-500" />
                      </div>
                      <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                        {searchQuery ? "No members found matching your search" : "No available members"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availableMembers.map((member, index) => (
                        <motion.div
                          key={member.id}
                          onClick={() => handleAssign(member)}
                          className="group flex items-center justify-between p-4 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-lg cursor-pointer hover:bg-brand-primary-50 dark:hover:bg-brand-primary-900/20 border border-transparent hover:border-brand-primary-200 dark:hover:border-brand-primary-800 transition-all duration-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-secondary-100 to-brand-secondary-200 dark:from-brand-secondary-900/30 dark:to-brand-secondary-800/30 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-brand-secondary-600 dark:text-brand-secondary-400">
                                {member.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-body text-sm font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                                {member.email}
                              </p>
                              <p className="font-caption text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                                {member.role}
                              </p>
                            </div>
                          </div>
                          <UserPlus className="w-4 h-4 text-brand-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Assigned Members */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="w-5 h-5 text-success" />
                  <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                    Assigned Members
                  </h3>
                  <span className="font-caption text-sm text-txt-secondary-light dark:text-txt-secondary-dark bg-success/10 dark:bg-success/20 text-success px-2 py-1 rounded-full">
                    {assignments.length}
                  </span>
                </div>
                
                <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-xl border-2 border-bg-accent-light dark:border-bg-accent-dark p-4 h-80 overflow-y-auto">
                  {assignments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/30 rounded-full flex items-center justify-center mb-4">
                        <UserCheck className="w-6 h-6 text-success" />
                      </div>
                      <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                        No members assigned yet
                      </p>
                      <p className="font-caption text-xs text-txt-muted-light dark:text-txt-muted-dark mt-1">
                        Click on available members to assign them
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <AnimatePresence>
                        {assignments.map((assignment, index) => {
                          const memberDetails = getAssignedMemberDetails(assignment.teamMemberId);
                          return (
                            <motion.div
                              key={assignment.teamMemberId}
                              className="group flex items-center justify-between p-4 bg-success/10 dark:bg-success/20 rounded-lg border border-success/30 dark:border-success/40"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-success/20 dark:bg-success/30 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-success">
                                    {memberDetails?.email.charAt(0).toUpperCase() || 'M'}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-body text-sm font-semibold text-success">
                                    {memberDetails?.email || `Member ID: ${assignment.teamMemberId}`}
                                  </p>
                                  <p className="font-caption text-xs text-success/80">
                                    {assignment.memberRole}
                                  </p>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleRemove(assignment.teamMemberId)}
                                className="p-2 hover:bg-error/10 dark:hover:bg-error/20 rounded-full transition-colors group-hover:opacity-100 opacity-70"
                              >
                                <X className="w-4 h-4 text-error hover:text-error/80 transition-colors" />
                              </button>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className="fixed top-4 right-4 z-50 max-w-md"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            <div className={`p-4 rounded-xl shadow-2xl border-2 ${
              notification.type === 'success' 
                ? 'bg-success/10 dark:bg-success/20 border-success/30 dark:border-success/40 text-success' 
                : notification.type === 'error'
                  ? 'bg-error/10 dark:bg-error/20 border-error/30 dark:border-error/40 text-error'
                  : notification.type === 'warning'
                    ? 'bg-warning/10 dark:bg-warning/20 border-warning/30 dark:border-warning/40 text-warning'
                    : 'bg-info/10 dark:bg-info/20 border-info/30 dark:border-info/40 text-info'
            }`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && <Check className="w-5 h-5" />}
                  {notification.type === 'error' && <X className="w-5 h-5" />}
                  {notification.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                  {notification.type === 'info' && <Users className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => setNotification({ show: false, message: "", type: "info" })}
                  className="flex-shrink-0 p-1 hover:bg-black/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AssignTeamMembers;
