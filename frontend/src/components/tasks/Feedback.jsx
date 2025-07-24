import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MessageSquare, 
  Send,
  Loader2,
  Check,
  X,
  RefreshCw
} from "lucide-react";

// GraphQL Mutations
const APPROVE_TASK = gql`
  mutation ApproveTaskCompletion($taskId: ID!, $approved: Boolean!, $remarks: String!) {
    approveTaskCompletion(taskId: $taskId, approved: $approved, remarks: $remarks) {
      success
      message
    }
  }
`;

const REJECT_TASK = gql`
  mutation RejectTask($taskId: ID!, $reason: String!) {
    rejectTask(taskId: $taskId, reason: $reason) {
      success
      message
    }
  }
`;

const REQUEST_MODIFICATIONS = gql`
  mutation RequestTaskModifications($taskId: ID!, $feedback: String!) {
    requestTaskModifications(taskId: $taskId, feedback: $feedback) {
      success
      message
    }
  }
`;

export default function Feedback({ taskId }) {
  const [feedback, setFeedback] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const [approveTask] = useMutation(APPROVE_TASK);
  const [rejectTask] = useMutation(REJECT_TASK);
  const [requestModifications] = useMutation(REQUEST_MODIFICATIONS);

  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "info" });
    }, 4000);
  };

  const handleAction = async (mutation, variables, successMessage, actionType) => {
    if (!feedback.trim() && actionType !== 'approve') {
      showNotification("Please provide feedback before proceeding.", "warning");
      return;
    }

    setLoading(true);
    setActiveAction(actionType);
    
    try {
      const { data } = await mutation({ variables });
      const response = data[Object.keys(data)[0]];
      
      if (response.success) {
        showNotification(response.message || successMessage, "success");
        setFeedback(""); // Clear feedback after success
      } else {
        showNotification(response.message || "Action failed", "error");
      }
    } catch (error) {
      console.error(`${actionType} failed:`, error);
      showNotification(
        error.message || "Something went wrong! Please try again.", 
        "error"
      );
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const actions = [
    {
      type: 'approve',
      label: 'Approve Task',
      icon: CheckCircle,
      onClick: () => handleAction(
        approveTask, 
        { taskId, approved: true, remarks: feedback || "Task approved without remarks" }, 
        "Task approved successfully!",
        'approve'
      ),
      className: "bg-success hover:bg-success/90 text-white shadow-lg hover:shadow-xl",
      loadingClass: "bg-success/80",
      emoji: "✅"
    },
    {
      type: 'modify',
      label: 'Request Changes',
      icon: RefreshCw,
      onClick: () => handleAction(
        requestModifications, 
        { taskId, feedback }, 
        "Modification request sent successfully!",
        'modify'
      ),
      className: "bg-warning hover:bg-warning/90 text-white shadow-lg hover:shadow-xl",
      loadingClass: "bg-warning/80",
      emoji: "🔄"
    },
    {
      type: 'reject',
      label: 'Reject Task',
      icon: XCircle,
      onClick: () => handleAction(
        rejectTask, 
        { taskId, reason: feedback }, 
        "Task rejected successfully!",
        'reject'
      ),
      className: "bg-error hover:bg-error/90 text-white shadow-lg hover:shadow-xl",
      loadingClass: "bg-error/80",
      emoji: "❌"
    }
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-brand-primary-600 dark:text-brand-primary-400" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
          Task Review & Feedback
        </h3>
      </div>

      {/* Feedback Textarea */}
      <div className="space-y-2">
        <label className="block font-caption text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark">
          Your Feedback & Comments
        </label>
        <div className="relative">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide detailed feedback, suggestions, or reasons for your decision..."
            rows={4}
            className="w-full p-4 font-body bg-bg-primary-light dark:bg-bg-primary-dark text-txt-primary-light dark:text-txt-primary-dark border-2 border-bg-accent-light dark:border-bg-accent-dark rounded-xl focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-all duration-200 placeholder:text-txt-muted-light dark:placeholder:text-txt-muted-dark resize-none"
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className={`text-xs font-caption ${
              feedback.length > 500 ? 'text-error' : 'text-txt-muted-light dark:text-txt-muted-dark'
            }`}>
              {feedback.length}/1000
            </span>
            {feedback.trim() && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 bg-brand-primary-500 rounded-full"
              />
            )}
          </div>
        </div>
        <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark font-caption">
          💡 Detailed feedback helps team members understand your decision and improve their work
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <h4 className="font-caption text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
          Choose an action:
        </h4>
        
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            const isActive = activeAction === action.type;
            const isLoading = loading && isActive;
            
            return (
              <motion.button
                key={action.type}
                onClick={action.onClick}
                disabled={loading}
                className={`group relative p-4 rounded-xl font-button font-semibold text-sm transition-all duration-200 transform focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary-light dark:focus:ring-offset-bg-primary-dark disabled:cursor-not-allowed ${
                  isLoading 
                    ? action.loadingClass 
                    : action.className
                } ${
                  !loading ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
                }`}
                whileHover={!loading ? { y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-center gap-3">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <span className="flex items-center gap-2">
                    <span>{action.emoji}</span>
                    <span>{isLoading ? 'Processing...' : action.label}</span>
                  </span>
                </div>

                {/* Loading overlay */}
                {isLoading && (
                  <motion.div
                    className="absolute inset-0 bg-black/10 rounded-xl flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-2 text-white">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">Processing...</span>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
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
                  {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                  {notification.type === 'info' && <MessageSquare className="w-5 h-5" />}
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
    </motion.div>
  );
}
