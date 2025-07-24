import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaUsers, 
  FaPlus, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaArrowLeft,
  FaEdit,
  FaFileAlt 
} from "react-icons/fa";

// GraphQL Mutation for Creating a Team
const CREATE_TEAM = gql`
  mutation CreateTeam($projectId: ID!, $teamName: String!, $description: String!) {
    createTeam(projectId: $projectId, teamName: $teamName, description: $description) {
      success
      message
      team {
        id
        teamName
        description
      }
    }
  }
`;

const CreateTeam = ({ projectId }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    console.log("🔍 Debug: Received projectId:", projectId);
    if (!projectId) {
      console.error("❌ Error: projectId is undefined or null!");
    }
  }, [projectId]);

  const [createTeam] = useMutation(CREATE_TEAM);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!teamName.trim()) {
      showNotification("error", "Team name is required");
      return;
    }

    if (!projectId) {
      showNotification("error", "Project ID is missing");
      return;
    }

    setLoading(true);

    try {
      console.log("🔍 Debug: Submitting with:", { projectId, teamName, description });

      const { data } = await createTeam({
        variables: {
          projectId: projectId.toString(),
          teamName: teamName.trim(),
          description: description.trim(),
        },
      });

      console.log("✅ Mutation response:", data);

      if (data.createTeam.success) {
        setShowSuccess(true);
        showNotification("success", "Team created successfully!");
        
        // Reset form after a delay
        setTimeout(() => {
          setTeamName("");
          setDescription("");
          setShowSuccess(false);
        }, 2000);
      } else {
        showNotification("error", data.createTeam.message || "Failed to create team.");
      }
    } catch (err) {
      console.error("❌ GraphQL Request Failed:", err);
      showNotification("error", "Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  const handleCancel = () => {
    if (teamName.trim() || description.trim()) {
      if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
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
              className="bg-bg-primary-light dark:bg-bg-primary-dark p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4 border border-gray-200/20 dark:border-gray-700/20"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                Team Created Successfully!
              </h3>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                Your new team is ready for collaboration
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
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-3">
                {notification.type === 'success' ? (
                  <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <p className={`text-sm font-medium ${
                  notification.type === 'success' 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              onClick={handleCancel}
              className="p-2 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft className="w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
            </motion.button>
            <div>
              <h1 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FaUsers className="w-5 h-5 text-white" />
                </div>
                Create New Team
              </h1>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mt-2">
                Set up your team and invite members to collaborate effectively
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Name */}
              <div>
                <label className="flex items-center gap-2 font-body font-medium text-txt-primary-light dark:text-txt-primary-dark mb-3">
                  <FaEdit className="w-4 h-4 text-brand-primary-500" />
                  Team Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter team name (e.g., Frontend Development, Marketing Team)"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                  Choose a clear, descriptive name for your team
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 font-body font-medium text-txt-primary-light dark:text-txt-primary-dark mb-3">
                  <FaFileAlt  className="w-4 h-4 text-brand-primary-500" />
                  Description
                </label>
                <textarea
                  placeholder="Describe the team's purpose, goals, and responsibilities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200 resize-none"
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                  Optional: Add details about the team's role and objectives
                </p>
              </div>

              {/* Form Preview */}
              {(teamName.trim() || description.trim()) && (
                <motion.div
                  className="bg-brand-primary-50 dark:bg-brand-primary-900/20 border border-brand-primary-200 dark:border-brand-primary-800 rounded-xl p-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-heading font-semibold text-brand-primary-700 dark:text-brand-primary-300 mb-2">
                    Preview:
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-brand-primary-200 dark:border-brand-primary-700">
                    <h5 className="font-body font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                      {teamName.trim() || "Team Name"}
                    </h5>
                    {description.trim() && (
                      <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
                        {description.trim()}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-bg-secondary-light dark:hover:bg-bg-secondary-dark transition-all duration-200 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={loading || !teamName.trim()}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    loading || !teamName.trim()
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  }`}
                  whileHover={!loading && teamName.trim() ? { scale: 1.02 } : {}}
                  whileTap={!loading && teamName.trim() ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="w-5 h-5 animate-spin" />
                      Creating Team...
                    </>
                  ) : (
                    <>
                      <FaPlus className="w-5 h-5" />
                      Create Team
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          className="mt-8 bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💡</span>
            </div>
            Team Creation Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl p-4">
              <h4 className="font-body font-semibold text-txt-primary-light dark:text-txt-primary-dark mb-2">
                Choose Clear Names
              </h4>
              <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Use descriptive names that clearly indicate the team's purpose or department.
              </p>
            </div>
            <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl p-4">
              <h4 className="font-body font-semibold text-txt-primary-light dark:text-txt-primary-dark mb-2">
                Define Purpose
              </h4>
              <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Add a description to help team members understand their role and objectives.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTeam;
