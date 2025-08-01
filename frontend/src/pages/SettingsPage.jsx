import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import {jwtDecode} from "jwt-decode";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
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
  Download,
  Upload,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  FileText,
  Database,
  Share2
} from "lucide-react";

import Switch from "react-switch";
import { ClipLoader, PulseLoader } from "react-spinners";


// GraphQL mutations (unchanged)
const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId)
  }
`;

const UPDATE_PROJECT_STATUS = gql`
  mutation UpdateProjectStatus($projectId: ID!, $status: String!) {
    updateProjectStatus(projectId: $projectId, status: $status) {
      success
      message
    }
  }
`;

const LEAVE_PROJECT = gql`
  mutation LeaveProject($projectId: ID!) {
    leaveProject(projectId: $projectId)
  }
`;

// EnhancedButton component - responsive width fix for smaller devices
const EnhancedButton = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  children,
  onClick,
  className = "",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 transform";

  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-md hover:shadow-lg focus:ring-gray-500",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500",
    outline: "border-2 border-gray-200 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-gray-500",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-gray-500"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
    xl: "px-8 py-5 text-xl"
  };

  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed transform-none" : "hover:scale-105 active:scale-95";

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className} w-full sm:w-auto`} // w-full on xs for responsiveness
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ClipLoader size={16} color="currentColor" />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      {children}
    </motion.button>
  );
};


const DeleteOrLeaveProject = ({ projectId }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    const isDelete = userRole === "Project_Manager";

    confirmAlert({
      customUI: ({ onClose }) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-full ${isDelete ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
              <AlertTriangle className={`w-8 h-8 ${isDelete ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {isDelete ? "Delete Project?" : "Leave Project?"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-sm sm:text-base">
            {isDelete
              ? "All project data, tasks, and team assignments will be permanently deleted."
              : "You will lose access to this project and all its content."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <EnhancedButton
              variant={isDelete ? "danger" : "warning"}
              loading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  if (isDelete) {
                    await deleteProject({ variables: { projectId } });
                    toast.success("Project deleted successfully!", {
                      icon: "🗑️",
                      duration: 3000,
                    });
                    setTimeout(() => {
                      window.location.href = "/projectDashboard";
                    }, 2000);
                  } else {
                    await leaveProject({ variables: { projectId } });
                    toast.success("You have left the project!", {
                      icon: "👋",
                      duration: 3000,
                    });
                    setTimeout(() => {
                      if (userRole === "Team_Lead") {
                        window.location.href = "/teamleaddashboard";
                      } else {
                        window.location.href = "/teammemberdashboard";
                      }
                    }, 2000);
                  }
                } catch (error) {
                  console.error("Error:", error);
                  toast.error("Something went wrong. Please try again.", {
                    icon: "❌",
                    duration: 4000,
                  });
                } finally {
                  setIsLoading(false);
                  onClose();
                }
              }}
              className="flex-1"
            >
              {isDelete ? "Delete Forever" : "Leave Project"}
            </EnhancedButton>

            <EnhancedButton
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </EnhancedButton>
          </div>
        </motion.div>
      )
    });
  };

  if (!userRole) return null;

  const isDelete = userRole === "Project_Manager";

  return (
    <div className="card h-fit w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
        <div className={`p-3 rounded-xl shrink-0 ${isDelete ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
          {isDelete ? (
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          ) : (
            <LogOut className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          )}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
            {isDelete ? "Delete Project" : "Leave Project"}
          </h3>
          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark max-w-xs sm:max-w-none">
            {isDelete ? "Permanently remove this project" : "Remove yourself from team"}
          </p>
        </div>
      </div>

      <div className={`bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-red-200/50 dark:border-red-700/50 mb-6 text-sm sm:text-base`}>
        <p className="text-red-800 dark:text-red-200 leading-relaxed max-w-full">
          {isDelete
            ? "⚠️ This will permanently delete all project data, tasks, files, and team assignments. This action cannot be undone."
            : "⚠️ You will lose access to all project content, tasks, and team communications."}
        </p>
      </div>

      <EnhancedButton
        variant={isDelete ? "danger" : "warning"}
        size="lg"
        icon={isDelete ? Trash2 : LogOut}
        onClick={handleAction}
        className="w-full max-w-md mx-auto sm:mx-0"
      >
        {isDelete ? "Delete This Project" : "Leave This Project"}
      </EnhancedButton>
    </div>
  );
};


const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: false,
    weeklyReports: true,
    securityAlerts: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast.success("Notification preferences saved!", {
      icon: "🔔",
      duration: 3000,
    });
  };

  const notificationOptions = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive project updates via email",
      icon: Mail
    },
    {
      key: "pushNotifications",
      label: "Push Notifications",
      description: "Browser push notifications",
      icon: Bell
    },
    {
      key: "taskReminders",
      label: "Task Reminders",
      description: "Deadline and due date alerts",
      icon: AlertTriangle
    },
    {
      key: "weeklyReports",
      label: "Weekly Reports",
      description: "Weekly project progress summaries",
      icon: FileText
    },
    {
      key: "securityAlerts",
      label: "Security Alerts",
      description: "Account security notifications",
      icon: Shield
    }
  ];

  return (
    <div className="card h-fit w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl shrink-0">
          <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
            Notification Preferences
          </h3>
          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark max-w-xs sm:max-w-none">
            Customize how you receive updates
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {notificationOptions.map(({ key, label, description, icon: Icon }) => (
          <motion.div
            key={key}
            className="flex items-center justify-between p-4 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg shrink-0">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate text-txt-primary-light dark:text-txt-primary-dark">
                  {label}
                </p>
                <p className="text-sm truncate text-txt-secondary-light dark:text-txt-secondary-dark">
                  {description}
                </p>
              </div>
            </div>

            <Switch
              checked={settings[key]}
              onChange={() => handleToggle(key)}
              onColor="#3b82f6"
              offColor="#d1d5db"
              onHandleColor="#ffffff"
              offHandleColor="#ffffff"
              handleDiameter={24}
              uncheckedIcon={false}
              checkedIcon={false}
              height={32}
              width={56}
              className="ml-4 shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <EnhancedButton
          variant="success"
          size="lg"
          icon={Save}
          loading={isSaving}
          onClick={handleSave}
          className="flex-1"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </EnhancedButton>

        <EnhancedButton
          variant="outline"
          size="lg"
          icon={RefreshCw}
          onClick={() => {
            setSettings({
              emailNotifications: true,
              pushNotifications: true,
              taskReminders: false,
              weeklyReports: true,
              securityAlerts: true,
            });
            toast.success("Reset to default settings");
          }}
          className="flex-1"
        >
          Reset
        </EnhancedButton>
      </div>
    </div>
  );
};


const RoleManagement = () => {
  return (
    <div className="card h-fit w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl shrink-0">
          <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
            Role Management
          </h3>
          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark max-w-xs sm:max-w-none">
            Advanced team role controls
          </p>
        </div>
      </div>

      <div className="text-center py-12 px-4 sm:px-0">
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400" />
        </motion.div>

        <h4 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-3">
          Coming Soon!
        </h4>
        <p className="text-txt-secondary-light dark:text-txt-secondary-dark mb-6 text-base leading-relaxed max-w-md mx-auto">
          Advanced role management features with permissions, custom roles, and team hierarchy controls are in development.
        </p>

        <div className="space-y-4 max-w-xs mx-auto">
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 shadow-lg">
            <PulseLoader size={8} color="currentColor" className="mr-3" />
            Under Development
          </div>
          <div className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark text-center">
            📅 Expected Release: Q2 2024
          </div>
        </div>

        <div className="mt-8">
          <EnhancedButton
            variant="outline"
            icon={Bell}
            onClick={() => toast.success("You'll be notified when this feature is ready!")}
            className="w-full max-w-xs mx-auto"
          >
            Notify Me When Ready
          </EnhancedButton>
        </div>
      </div>
    </div>
  );
};


const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEditing(false);
    setUser({ ...user, ...editForm });
    setIsSaving(false);
    toast.success("Profile updated successfully!", {
      icon: "✅",
      duration: 3000,
    });
  };

  const handleExportData = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          // Create dummy data for download
          const data = JSON.stringify(user, null, 2);
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'user-data.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        }, 2000);
      }),
      {
        loading: 'Preparing your data...',
        success: 'Data exported successfully!',
        error: 'Failed to export data',
      }
    );
  };

  return (
    <div className="card h-fit w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl shrink-0">
            <User className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
              User Information
            </h3>
            <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark max-w-xs sm:max-w-none">
              Manage your account details
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <EnhancedButton
            variant="ghost"
            size="sm"
            icon={Download}
            onClick={handleExportData}
            className="text-xs w-full sm:w-auto"
          >
            Export
          </EnhancedButton>

          <EnhancedButton
            variant={isEditing ? "success" : "outline"}
            size="sm"
            icon={isEditing ? Save : Edit}
            loading={isSaving}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
          </EnhancedButton>
        </div>
      </div>

      {user ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg shrink-0">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark block mb-2">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg font-semibold text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all"
                  />
                ) : (
                  <p className="font-semibold text-txt-primary-light dark:text-txt-primary-dark text-lg truncate">
                    {user.username}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg shrink-0">
                <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark block mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg font-semibold text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all"
                  />
                ) : (
                  <p className="font-semibold text-txt-primary-light dark:text-txt-primary-dark text-lg truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg shrink-0">
                <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark block mb-2">
                  Role
                </label>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 text-brand-primary-700 dark:text-brand-primary-300 shadow-sm truncate max-w-full">
                    {user.role.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full shrink-0">
                    🔒 Protected
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <EnhancedButton
              variant="secondary"
              icon={Lock}
              onClick={() => toast.success("Password change feature coming soon!")}
              className="w-full"
            >
              Change Password
            </EnhancedButton>

            <EnhancedButton
              variant="outline"
              icon={Share2}
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin);
                toast.success("Profile link copied!");
              }}
              className="w-full"
            >
              Share Profile
            </EnhancedButton>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 px-4">
          <div className="w-20 h-20 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-txt-secondary-light dark:text-txt-secondary-dark" />
          </div>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-lg">
            User data not available
          </p>
        </div>
      )}
    </div>
  );
};

const ProjectStatusUpdater = ({ projectId }) => {
  const [userRole, setUserRole] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(""); // optionally show current status if available
  const [newStatus, setNewStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    "In Progress",
    "On Hold",
    "Completed",
    "Cancelled",
    "Delayed"
  ];
  const [updateProjectStatus] = useMutation(UPDATE_PROJECT_STATUS);

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
    // Optionally set the current status if you have a way to fetch it
  }, []);

  // Only show if Project Manager
  if (userRole !== "Project_Manager") return null;

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error("Please select a status.");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await updateProjectStatus({
        variables: { projectId, status: newStatus }
      });

      if (data?.updateProjectStatus?.success) {
        toast.success(data.updateProjectStatus.message || "Project status updated!", {
          icon: "✅",
        });
        setCurrentStatus(newStatus);
      } else {
        toast.error(data?.updateProjectStatus?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card h-fit w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl shrink-0">
          <Database className="w-6 h-6 text-yellow-700 dark:text-yellow-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
            Update Project Status
          </h3>
          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark max-w-xs sm:max-w-none">
            Change the current status of this project
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
        <select
          className="px-2 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-medium w-full sm:w-auto flex-grow bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark"
          value={newStatus}
          onChange={e => setNewStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <EnhancedButton
          variant="success"
          icon={Save}
          loading={isLoading}
          disabled={!newStatus || isLoading}
          onClick={handleUpdateStatus}
          className="w-full sm:w-auto"
        >
          Update
        </EnhancedButton>
      </div>
      {currentStatus && (
        <div className="text-sm text-green-600 dark:text-green-400">
          Current Status: <span className="font-bold">{currentStatus}</span>
        </div>
      )}
    </div>
  );
};


const SettingsPage = ({ projectId }) => {
  return (
    <div className="min-h-screen page-bg px-4 sm:px-8 md:px-10 lg:px-20 xl:px-36 py-10">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-primary-light)',
            color: 'var(--txt-primary-light)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
      <div className="section-container dashboard-padding max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
            <div className="p-4 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-3xl shadow-xl shrink-0">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                Settings
              </h1>
              <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-xl max-w-lg mx-auto sm:mx-0">
                Manage your account preferences and project settings
              </p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-full"></div>
        </motion.div>

        {/* Enhanced Settings Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {/* Left Column */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <UserProfile />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <RoleManagement />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NotificationSettings />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* --- ADD THE PROJECT STATUS UPDATER HERE --- */}
              <ProjectStatusUpdater projectId={projectId} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
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
