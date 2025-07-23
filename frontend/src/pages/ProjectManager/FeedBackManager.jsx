import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MessageCircle, 
  Send,
  Loader,
  FileText
} from "lucide-react";

// GraphQL Mutations
const APPROVE_TASK = gql`
  mutation ApproveTaskCompletion($taskId: ID!, $approved: Boolean!, $remarks: String!) {
    approveTaskCompletionByManager(taskId: $taskId, approved: $approved, remarks: $remarks) {
      success
      message
      task {
        id
        status
        history {
          updatedBy
          updatedAt
          oldStatus
          newStatus
        }
      }
    }
  }
`;

const REJECT_TASK = gql`
  mutation RejectTask($taskId: ID!, $reason: String!) {
    rejectTaskByManager(taskId: $taskId, reason: $reason) {
      success
      message
      task {
        id
        title
        status
      }
    }
  }
`;

const REQUEST_MODIFICATIONS = gql`
  mutation RequestTaskModifications($taskId: ID!, $feedback: String!) {
    requestTaskModificationsByManager(taskId: $taskId, feedback: $feedback) {
      success
      message
      task {
        id
        title
        status
      }
    }
  }
`;

export default function Feedback({ taskId }) {
  const { isDark } = useTheme();
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  const [approveTask] = useMutation(APPROVE_TASK);
  const [rejectTask] = useMutation(REJECT_TASK);
  const [requestModifications] = useMutation(REQUEST_MODIFICATIONS);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 4000);
  };

  const handleApprove = async () => {
    if (!feedback.trim()) {
      showNotification("error", "Please provide feedback before approving the task");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await approveTask({
        variables: { taskId, approved: true, remarks: feedback },
      });
      
      if (data.approveTaskCompletionByManager.success) {
        showNotification("success", data.approveTaskCompletionByManager.message);
        setFeedback("");
      } else {
        showNotification("error", data.approveTaskCompletionByManager.message);
      }
    } catch (error) {
      console.error("Approval failed:", error);
      showNotification("error", "Failed to approve task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      showNotification("error", "Please provide a reason for rejecting the task");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await rejectTask({
        variables: { taskId, reason: feedback },
      });
      
      if (data.rejectTaskByManager.success) {
        showNotification("success", data.rejectTaskByManager.message);
        setFeedback("");
      } else {
        showNotification("error", data.rejectTaskByManager.message);
      }
    } catch (error) {
      console.error("Rejection failed:", error);
      showNotification("error", "Failed to reject task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!feedback.trim()) {
      showNotification("error", "Please provide feedback for the requested changes");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await requestModifications({
        variables: { taskId, feedback },
      });
      
      if (data.requestTaskModificationsByManager.success) {
        showNotification("success", data.requestTaskModificationsByManager.message);
        setFeedback("");
      } else {
        showNotification("error", data.requestTaskModificationsByManager.message);
      }
    } catch (error) {
      console.error("Request changes failed:", error);
      showNotification("error", "Failed to request changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = [
    {
      label: "Approve",
      icon: CheckCircle,
      onClick: handleApprove,
      className: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white",
      disabled: false
    },
    {
      label: "Request Changes",
      icon: AlertTriangle,
      onClick: handleRequestChanges,
      className: "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white",
      disabled: false
    },
    {
      label: "Reject",
      icon: XCircle,
      onClick: handleReject,
      className: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white",
      disabled: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className={`p-4 rounded-xl border ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <p className={`text-sm font-medium ${
                notification.type === 'success' 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-lg flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-brand-primary-600 dark:text-brand-primary-400" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
          Manager Feedback
        </h3>
      </div>

      {/* Feedback Form */}
      <div className="space-y-4">
        {/* Textarea */}
        <div className="relative">
          <FileText className="absolute top-3 left-3 w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide detailed feedback about the task submission..."
            rows={5}
            disabled={isSubmitting}
            className="w-full pl-10 pr-4 py-3 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="absolute bottom-3 right-3 text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
            {feedback.length}/500
          </div>
        </div>

        {/* Character Counter Warning */}
        {feedback.length > 450 && (
          <motion.p
            className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertTriangle className="w-3 h-3" />
            Approaching character limit
          </motion.p>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.label}
              onClick={action.onClick}
              disabled={isSubmitting || action.disabled}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-button font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${action.className}`}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {isSubmitting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <action.icon className="w-4 h-4" />
              )}
              <span className="text-sm">
                {isSubmitting ? 'Processing...' : action.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Help Text */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-body text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Feedback Guidelines
              </h4>
              <ul className="font-body text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• <strong>Approve:</strong> Task meets all requirements and standards</li>
                <li>• <strong>Request Changes:</strong> Task needs minor modifications</li>
                <li>• <strong>Reject:</strong> Task requires significant rework</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
