import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Trash2,
  LogOut,
  Settings,
  AlertTriangle,
  Check,
  X,
  Mail,
  UserCheck,
  Edit,
  Save,
} from "lucide-react";

// Define GraphQL Mutations
const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId)
  }
`;

const LEAVE_PROJECT = gql`
  mutation LeaveProject($projectId: ID!) {
    leaveProject(projectId: $projectId)
  }
`;

const DeleteOrLeaveProject = ({ projectId }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Apollo GraphQL Mutations
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const [leaveProject] = useMutation(LEAVE_PROJECT);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUserRole(decodedUser.role);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (userRole === "Project_Manager") {
        await deleteProject({ variables: { projectId } });
        alert("Project deleted successfully");
        window.location.href = "/projectDashboard";
      } else {
        await leaveProject({ variables: { projectId } });
        alert("You have left the project");
        setShowConfirm(false);

        if (userRole === "Team_Lead") {
          window.location.href = "/teamleaddashboard";
        } else {
          window.location.href = "/teammemberdashboard";
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userRole) return null;

  const isDelete = userRole === "Project_Manager";

  return (
    <div className="card h-fit">
      <div className="flex items-center gap-3 mb-4">
        {isDelete ? (
          <Trash2 className="w-5 h-5 text-error" />
        ) : (
          <LogOut className="w-5 h-5 text-warning" />
        )}
        <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
          {isDelete ? "Delete Project" : "Leave Project"}
        </h3>
      </div>

      <p className="text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
        {isDelete
          ? "Permanently delete this project and all associated data."
          : "Remove yourself from this project team."}
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
          isDelete
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-yellow-500 hover:bg-yellow-600 text-white"
        }`}
        onClick={() => setShowConfirm(true)}
      >
        {isDelete ? <Trash2 className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
        {isDelete ? "Delete This Project" : "Leave This Project"}
      </motion.button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <p className="font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                  Confirm Action
                </p>
                <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                  {isDelete
                    ? "This action cannot be undone. All project data will be permanently deleted."
                    : "You will lose access to this project and all its content."}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isDelete
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-yellow-600 hover:bg-yellow-700 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={handleAction}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {isDelete ? "Yes, Delete" : "Yes, Leave"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 rounded-lg font-medium text-txt-primary-light dark:text-txt-primary-dark hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                onClick={() => setShowConfirm(false)}
              >
                <X className="w-4 h-4" />
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(false);

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium text-txt-primary-light dark:text-txt-primary-dark">
          {label}
        </p>
        <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
          {description}
        </p>
      </div>
      <label className="flex items-center cursor-pointer ml-4">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors ${
              checked ? "bg-brand-primary-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                checked ? "translate-x-6" : "translate-x-1"
              } mt-1`}
            />
          </div>
        </div>
      </label>
    </div>
  );

  return (
    <div className="card h-fit">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-5 h-5 text-brand-primary-500" />
        <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
          Notification Preferences
        </h3>
      </div>

      <div className="space-y-1 border-t border-gray-200 dark:border-gray-700 pt-4">
        <ToggleSwitch
          checked={emailNotifications}
          onChange={(e) => setEmailNotifications(e.target.checked)}
          label="Email Notifications"
          description="Receive updates via email"
        />
        
        <ToggleSwitch
          checked={pushNotifications}
          onChange={(e) => setPushNotifications(e.target.checked)}
          label="Push Notifications"
          description="Browser push notifications"
        />
        
        <ToggleSwitch
          checked={taskReminders}
          onChange={(e) => setTaskReminders(e.target.checked)}
          label="Task Reminders"
          description="Deadline and due date alerts"
        />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary-500 hover:bg-brand-primary-600 text-white rounded-lg font-medium transition-all"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </motion.button>
      </div>
    </div>
  );
};

const RoleManagement = () => {
  return (
    <div className="card h-fit">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-5 h-5 text-brand-secondary-500" />
        <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
          Team Role Management
        </h3>
      </div>

      <div className="text-center py-8">
        <div className="w-16 h-16 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-txt-secondary-light dark:text-txt-secondary-dark" />
        </div>
        <p className="text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
          Advanced role management features are coming soon...
        </p>
        <div className="space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-300">
            🚧 Under Development
          </span>
          <div className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
            Expected Release: Q2 2024
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        setEditForm({
          username: decodedUser.username || '',
          email: decodedUser.email || ''
        });
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Here you would typically make an API call to update user info
    console.log('Saving user data:', editForm);
    setIsEditing(false);
    // For demo purposes, we'll just update the local state
    setUser({ ...user, ...editForm });
  };

  return (
    <div className="card h-fit">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-brand-accent-500" />
          <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
            User Information
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isEditing ? handleSave : handleEdit}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          {isEditing ? 'Save' : 'Edit'}
        </motion.button>
      </div>

      {user ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl">
            <User className="w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
            <div className="flex-1">
              <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Username
              </p>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full mt-1 px-2 py-1 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded font-medium text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20"
                />
              ) : (
                <p className="font-medium text-txt-primary-light dark:text-txt-primary-dark">
                  {user.username}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl">
            <Mail className="w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
            <div className="flex-1">
              <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Email Address
              </p>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full mt-1 px-2 py-1 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded font-medium text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20"
                />
              ) : (
                <p className="font-medium text-txt-primary-light dark:text-txt-primary-dark">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl">
            <UserCheck className="w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
            <div className="flex-1">
              <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Role
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-300">
                  {user.role.replace('_', ' ')}
                </span>
                <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                  Cannot be changed
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-txt-secondary-light dark:text-txt-secondary-dark" />
          </div>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
            User data not available
          </p>
        </div>
      )}
    </div>
  );
};

const SettingsPage = ({ projectId }) => {
  return (
    <div className="min-h-screen page-bg">
      <div className="section-container dashboard-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-brand-primary-500" />
            <h1 className="heading-lg">Settings</h1>
          </div>
          <p className="text-muted">
            Manage your account preferences and project settings
          </p>
        </motion.div>

        {/* Settings Grid - Updated for better alignment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto"
        >
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <UserProfile />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <RoleManagement />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NotificationSettings />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <DeleteOrLeaveProject projectId={projectId} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
