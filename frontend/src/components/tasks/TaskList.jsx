import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  Flag,
  FileText,
} from "lucide-react";
import { useResponsive } from "../../hooks/useResponsive";

export default function TaskList({ tasks, onSelectTask, selectedTaskId }) {
  const { isDark } = useTheme();
  const [localSelectedId, setLocalSelectedId] = useState(selectedTaskId);
  const { isMobile } = useResponsive();

  useEffect(() => {
    // Sync localSelectedId when selectedTaskId prop changes
    setLocalSelectedId(selectedTaskId);
  }, [selectedTaskId]);

  const handleSelectTask = (task) => {
    setLocalSelectedId(task.id);
    onSelectTask(task);
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "to do":
        return {
          classes:
            "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
          icon: Clock,
          color: "text-yellow-600 dark:text-yellow-400",
        };
      case "approved":
      case "completed":
      case "done":
        return {
          classes:
            "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
          icon: CheckCircle,
          color: "text-green-600 dark:text-green-400",
        };
      case "rejected":
        return {
          classes:
            "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
          icon: XCircle,
          color: "text-red-600 dark:text-red-400",
        };
      case "in progress":
        return {
          classes:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
          icon: Clock,
          color: "text-blue-600 dark:text-blue-400",
        };
      case "under review":
      case "pending approval":
        return {
          classes:
            "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
          icon: AlertCircle,
          color: "text-purple-600 dark:text-purple-400",
        };
      case "needs revision":
        return {
          classes:
            "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
          icon: AlertCircle,
          color: "text-orange-600 dark:text-orange-400",
        };
      default:
        return {
          classes:
            "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600",
          icon: FileText,
          color: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return {
          classes: "text-red-600 dark:text-red-400",
          icon: "🔴",
        };
      case "medium":
        return {
          classes: "text-yellow-600 dark:text-yellow-400",
          icon: "🟡",
        };
      case "low":
        return {
          classes: "text-green-600 dark:text-green-400",
          icon: "🟢",
        };
      default:
        return {
          classes: "text-gray-600 dark:text-gray-400",
          icon: "⚪",
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-brand-primary-500" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
          No Tasks Available
        </h3>
        <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark max-w-xs">
          Tasks will appear here once they are created and assigned
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${isMobile ? "px-2" : "px-0"}`}>
      {tasks.map((task, index) => {
        const statusConfig = getStatusConfig(task.status);
        const priorityConfig = getPriorityConfig(task.priority);
        const isSelected = localSelectedId === task.id || selectedTaskId === task.id;
        const StatusIcon = statusConfig.icon;

        return (
          <motion.div
            key={task.id}
            onClick={() => handleSelectTask(task)}
            className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
              isSelected
                ? "bg-brand-primary-50 dark:bg-brand-primary-900/20 border-brand-primary-300 dark:border-brand-primary-700 shadow-lg ring-2 ring-brand-primary-200 dark:ring-brand-primary-800"
                : "bg-bg-primary-light dark:bg-bg-primary-dark border-gray-200 dark:border-gray-600 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark hover:border-brand-primary-300 dark:hover:border-brand-primary-600 hover:shadow-md"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Task Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 pr-3">
                <h3 className="font-heading text-base font-semibold text-heading-primary-light dark:text-heading-primary-dark truncate mb-1">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.classes} shrink-0`}
              >
                <StatusIcon className="w-3 h-3" />
                <span>{task.status}</span>
              </div>
            </div>

            {/* Task Meta Information */}
            <div className="space-y-2">
              {/* Assignee */}
              {task.assignName && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-brand-primary-600 dark:text-brand-primary-400" />
                  </div>
                  <span className="font-body text-sm text-txt-primary-light dark:text-txt-primary-dark">
                    {task.assignName}
                  </span>
                </div>
              )}

              {/* Bottom Row: Priority, Due Date */}
              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                {/* Priority */}
                {task.priority && (
                  <div className="flex items-center gap-1.5">
                    <Flag className={`w-3 h-3 ${priorityConfig.classes}`} />
                    <span className={`font-medium ${priorityConfig.classes}`}>
                      {priorityConfig.icon} {task.priority}
                    </span>
                  </div>
                )}

                {/* Due Date */}
                {(task.dueDate || task.submittedDate || task.createdAt) && (
                  <div className="flex items-center gap-1.5 text-txt-secondary-light dark:text-txt-secondary-dark whitespace-nowrap">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span>
                      {task.dueDate
                        ? `Due: ${formatDate(task.dueDate)}`
                        : task.submittedDate
                        ? `Submitted: ${formatDate(task.submittedDate)}`
                        : `Created: ${formatDate(task.createdAt)}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
              <motion.div
                className="absolute top-3 left-3 w-2 h-2 bg-brand-primary-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
