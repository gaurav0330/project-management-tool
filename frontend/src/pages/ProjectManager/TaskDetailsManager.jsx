import { 
  FileText, 
  User, 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Flag,
  Calendar,
  Tag,
  MessageCircle,
  Loader
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, gql } from "@apollo/client";
import { useTheme } from "../../contexts/ThemeContext";
import Attachments from "../../components/tasks/Attachments";
import Feedback from "./FeedBackManager";

// Query to get user details
const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      email
      role
    }
  }
`;

// Component to display user information
const UserDisplay = ({ userId }) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId },
    skip: !userId, // Skip query if no userId provided
  });

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader className="w-4 h-4 animate-spin text-brand-primary-500" />
        <span className="font-heading text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
          Loading...
        </span>
      </div>
    );
  }

  if (error || !data?.getUser) {
    return (
      <span className="font-heading text-sm font-semibold text-txt-primary-light dark:text-txt-primary-dark">
        {userId} {/* Fallback to showing the ID if user fetch fails */}
      </span>
    );
  }

  return (
    <div>
      <p className="font-heading text-sm font-semibold text-txt-primary-light dark:text-txt-primary-dark">
        {data.getUser.username}
      </p>
      {data.getUser.email && (
        <p className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
          {data.getUser.email}
        </p>
      )}
    </div>
  );
};

export default function TaskDetails({ task }) {
  const { isDark } = useTheme();

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-secondary-100 to-brand-secondary-200 dark:from-brand-secondary-900/30 dark:to-brand-secondary-800/30 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-brand-secondary-500" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
          Select a Task
        </h3>
        <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
          Choose a task from the list to view its details
        </p>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "to do":
        return {
          classes: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
          icon: Clock,
          color: "text-yellow-600 dark:text-yellow-400"
        };
      case "approved":
      case "completed":
      case "done":
        return {
          classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
          icon: CheckCircle,
          color: "text-green-600 dark:text-green-400"
        };
      case "rejected":
        return {
          classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
          icon: XCircle,
          color: "text-red-600 dark:text-red-400"
        };
      case "in progress":
        return {
          classes: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
          icon: Clock,
          color: "text-blue-600 dark:text-blue-400"
        };
      case "under review":
      case "pending approval":
        return {
          classes: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
          icon: AlertCircle,
          color: "text-purple-600 dark:text-purple-400"
        };
      case "needs revision":
        return {
          classes: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
          icon: AlertCircle,
          color: "text-orange-600 dark:text-orange-400"
        };
      default:
        return {
          classes: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600",
          icon: FileText,
          color: "text-gray-600 dark:text-gray-400"
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return {
          classes: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
          icon: "🔴",
          label: "High Priority"
        };
      case "medium":
        return {
          classes: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
          icon: "🟡",
          label: "Medium Priority"
        };
      case "low":
        return {
          classes: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
          icon: "🟢",
          label: "Low Priority"
        };
      default:
        return {
          classes: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600",
          icon: "⚪",
          label: "Normal Priority"
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div 
      className="h-full overflow-y-auto"
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.4 }}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200/20 dark:border-gray-700/20 pb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-heading text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark line-clamp-2 pr-4">
              {task.title}
            </h1>
            
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.classes} shrink-0`}>
              <StatusIcon className="w-4 h-4" />
              <span>{task.status}</span>
            </div>
          </div>

          {/* Priority Badge */}
          {task.priority && (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${priorityConfig.classes}`}>
              <Flag className="w-3 h-3" />
              <span>{priorityConfig.icon} {priorityConfig.label}</span>
            </div>
          )}
        </div>

        {/* Task Meta Information */}
        <div className="grid grid-cols-1 gap-4">
          {/* Assigned To */}
          {task.assignedTo && (
            <div className="flex items-center gap-3 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-brand-primary-600 dark:text-brand-primary-400" />
              </div>
              <div className="flex-1">
                <p className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark uppercase tracking-wide">
                  Assigned To
                </p>
                <UserDisplay userId={task.assignedTo} />
              </div>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-3 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20">
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark uppercase tracking-wide">
                  Due Date
                </p>
                <p className="font-heading text-sm font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                  {formatDate(task.dueDate)}
                </p>
              </div>
            </div>
          )}

          {/* Created Date */}
          {task.createdAt && (
            <div className="flex items-center gap-3 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark uppercase tracking-wide">
                  Created
                </p>
                <p className="font-heading text-sm font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                  {formatDate(task.createdAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-primary-500" />
              Description
            </h3>
            <div className="p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20">
              <p className="font-body text-txt-primary-light dark:text-txt-primary-dark leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          </div>
        )}

        {/* Remarks */}
        {task.remarks && (
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-brand-secondary-500" />
              Remarks
            </h3>
            <div className="p-4 bg-brand-secondary-50 dark:bg-brand-secondary-900/20 rounded-xl border border-brand-secondary-200 dark:border-brand-secondary-800">
              <p className="font-body text-txt-primary-light dark:text-txt-primary-dark leading-relaxed whitespace-pre-wrap">
                {task.remarks}
              </p>
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark flex items-center gap-2">
              <Tag className="w-5 h-5 text-brand-accent-500" />
              Attachments
            </h3>
            <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20 p-4">
              <Attachments files={task.attachments} />
            </div>
          </div>
        )}

        {/* Feedback Section */}
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-brand-primary-500" />
            Feedback & Actions
          </h3>
          <div className="bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20 p-4">
            <Feedback taskId={task.id} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
