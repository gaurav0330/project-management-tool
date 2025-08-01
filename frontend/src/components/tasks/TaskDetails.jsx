import {
  FileText,
  User,
  CalendarDays,
  Clock,
  Flag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Edit3,
} from "lucide-react";
import Attachments from "./Attachments";
import Feedback from "./Feedback";
import { motion } from "framer-motion";
import { useResponsive } from "../../hooks/useResponsive";

export default function TaskDetails({ task }) {
  const { isMobile } = useResponsive();

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center px-4">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-2xl flex items-center justify-center mb-4"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <FileText className="w-8 h-8 text-brand-primary-500" />
        </motion.div>
        <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
          No Task Selected
        </h3>
        <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark max-w-sm">
          Select a task from the list to view its complete details and manage its
          status
        </p>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "to do":
        return {
          classes:
            "bg-warning/10 text-warning border-warning/30 dark:bg-warning/20 dark:text-warning dark:border-warning/40",
          icon: Clock,
          bgClass: "bg-warning/5 dark:bg-warning/10",
        };
      case "approved":
      case "completed":
      case "done":
        return {
          classes:
            "bg-success/10 text-success border-success/30 dark:bg-success/20 dark:text-success dark:border-success/40",
          icon: CheckCircle,
          bgClass: "bg-success/5 dark:bg-success/10",
        };
      case "rejected":
        return {
          classes:
            "bg-error/10 text-error border-error/30 dark:bg-error/20 dark:text-error dark:border-error/40",
          icon: XCircle,
          bgClass: "bg-error/5 dark:bg-error/10",
        };
      case "in progress":
        return {
          classes:
            "bg-brand-primary-50 text-brand-primary-700 border-brand-primary-200 dark:bg-brand-primary-900/20 dark:text-brand-primary-300 dark:border-brand-primary-800",
          icon: Target,
          bgClass: "bg-brand-primary-50/50 dark:bg-brand-primary-900/10",
        };
      case "under review":
      case "pending approval":
        return {
          classes:
            "bg-brand-secondary-50 text-brand-secondary-700 border-brand-secondary-200 dark:bg-brand-secondary-900/20 dark:text-brand-secondary-300 dark:border-brand-secondary-800",
          icon: AlertCircle,
          bgClass: "bg-brand-secondary-50/50 dark:bg-brand-secondary-900/10",
        };
      case "needs revision":
        return {
          classes:
            "bg-warning/10 text-warning border-warning/30 dark:bg-warning/20 dark:text-warning dark:border-warning/40",
          icon: Edit3,
          bgClass: "bg-warning/5 dark:bg-warning/10",
        };
      default:
        return {
          classes:
            "bg-bg-accent-light dark:bg-bg-accent-dark text-txt-secondary-light dark:text-txt-secondary-dark border-bg-accent-light dark:border-bg-accent-dark",
          icon: FileText,
          bgClass: "bg-bg-accent-light/50 dark:bg-bg-accent-dark/50",
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return {
          classes: "text-error font-semibold",
          icon: "🔴",
          bgClass: "bg-error/10 dark:bg-error/20",
        };
      case "medium":
        return {
          classes: "text-warning font-medium",
          icon: "🟡",
          bgClass: "bg-warning/10 dark:bg-warning/20",
        };
      case "low":
        return {
          classes: "text-success font-medium",
          icon: "🟢",
          bgClass: "bg-success/10 dark:bg-success/20",
        };
      default:
        return {
          classes: "text-txt-muted-light dark:text-txt-muted-dark",
          icon: "⚪",
          bgClass: "bg-bg-accent-light dark:bg-bg-accent-dark",
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return { text: "No date set", status: "normal" };
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });

      if (diffDays < 0) {
        return { text: `${formattedDate} (${Math.abs(diffDays)} days overdue)`, status: "overdue" };
      } else if (diffDays <= 1) {
        return { text: `${formattedDate} (Due ${diffDays === 0 ? "today" : "tomorrow"})`, status: "urgent" };
      } else if (diffDays <= 3) {
        return { text: `${formattedDate} (${diffDays} days left)`, status: "soon" };
      }

      return { text: formattedDate, status: "normal" };
    } catch {
      return { text: "Invalid date", status: "normal" };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const StatusIcon = statusConfig.icon;
  const dueDateInfo = formatDate(task.dueDate);

  return (
    <motion.div
      className="p-4 sm:p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Task Header */}
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2 leading-tight break-words">
            {task.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${statusConfig.classes}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="font-caption">{task.status}</span>
            </div>

            {/* Priority Badge */}
            {task.priority && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${priorityConfig.classes} ${priorityConfig.bgClass}`}
              >
                <Flag className="w-3 h-3" />
                <span className="font-caption font-semibold">
                  {priorityConfig.icon} {task.priority}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Meta Information */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Assignee */}
        {(task.assignedTo || task.assignName) && (
          <motion.div
            className="flex items-center gap-4 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-bg-accent-light dark:border-bg-accent-dark"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-brand-primary-600 dark:text-brand-primary-400" />
            </div>
            <div>
              <p className="font-caption text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Assigned To
              </p>
              <p className="font-body font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                {task.assignName || task.assignedTo || "Unassigned"}
              </p>
            </div>
          </motion.div>
        )}

        {/* Due Date */}
        <motion.div
          className={`flex items-center gap-4 p-4 rounded-xl border ${
            dueDateInfo.status === "overdue"
              ? "bg-error/10 border-error/30 text-error dark:bg-error/20 dark:border-error/40 dark:text-error"
              : dueDateInfo.status === "urgent"
              ? "bg-warning/10 border-warning/30 text-warning dark:bg-warning/20 dark:border-warning/40 dark:text-warning"
              : "bg-bg-accent-light border-bg-accent-light text-txt-primary-light dark:bg-bg-accent-dark dark:border-bg-accent-dark dark:text-txt-primary-dark"
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              dueDateInfo.status === "overdue"
                ? "bg-error/10 dark:bg-error/20"
                : dueDateInfo.status === "urgent"
                ? "bg-warning/10 dark:bg-warning/20"
                : "bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30"
            }`}
          >
            <CalendarDays
              className={`w-5 h-5 ${
                dueDateInfo.status === "overdue"
                  ? "text-error"
                  : dueDateInfo.status === "urgent"
                  ? "text-warning"
                  : "text-brand-primary-600 dark:text-brand-primary-400"
              }`}
            />
          </div>
          <div>
            <p className="font-caption text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              Due Date
            </p>
            <p
              className={`font-body font-semibold ${
                dueDateInfo.status === "overdue"
                  ? "text-error"
                  : dueDateInfo.status === "urgent"
                  ? "text-warning"
                  : "text-txt-primary-light dark:text-txt-primary-dark"
              }`}
            >
              {dueDateInfo.text}
            </p>
          </div>
          {dueDateInfo.status === "overdue" && (
            <span className="ml-auto text-xs bg-error/10 text-error px-2 py-1 rounded-full font-medium animate-pulse whitespace-nowrap">
              OVERDUE
            </span>
          )}
          {dueDateInfo.status === "urgent" && (
            <span className="ml-auto text-xs bg-warning/10 text-warning px-2 py-1 rounded-full font-medium whitespace-nowrap">
              URGENT
            </span>
          )}
        </motion.div>

        {/* Created Date */}
        {task.createdAt && (
          <motion.div
            className="flex items-center gap-4 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-bg-accent-light dark:border-bg-accent-dark"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-brand-secondary-100 to-brand-secondary-200 dark:from-brand-secondary-900/30 dark:to-brand-secondary-800/30 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-brand-secondary-600 dark:text-brand-secondary-400" />
            </div>
            <div>
              <p className="font-caption text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Created On
              </p>
              <p className="font-body font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                {formatDate(task.createdAt).text}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-primary-500" />
            Task Description
          </h3>
          <div className="p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-bg-accent-light dark:border-bg-accent-dark">
            <p className="font-body text-txt-primary-light dark:text-txt-primary-dark leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        </motion.div>
      )}

      {/* Remarks */}
      {task.remarks && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-brand-secondary-500" />
            Remarks & Notes
          </h3>
          <div className="p-4 bg-brand-secondary-50 dark:bg-brand-secondary-900/20 rounded-xl border border-brand-secondary-200 dark:border-brand-secondary-800">
            <p className="font-body text-txt-primary-light dark:text-txt-primary-dark leading-relaxed whitespace-pre-wrap">
              {task.remarks}
            </p>
          </div>
        </motion.div>
      )}

      {/* Attachments & Feedback */}
      <motion.div
        className="space-y-6 pt-4 border-t border-bg-accent-light dark:border-bg-accent-dark"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Attachments files={task.attachments} />
        <Feedback taskId={task.id} />
      </motion.div>
    </motion.div>
  );
}
