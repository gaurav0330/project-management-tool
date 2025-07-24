import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Flag, 
  User,
  Send,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  FileText,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🔹 GraphQL Queries & Mutations
const GET_TASK_BY_ID = gql`
  query GetTaskById($taskId: ID!) {
    getTaskById(taskId: $taskId) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
      attachments
      remarks
      assignedTo
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      success
      message
      task {
        id
        title
        status
        updatedAt
      }
    }
  }
`;

const SEND_TASK_FOR_APPROVAL = gql`
  mutation SendTaskForApproval($taskId: ID!) {
    sendTaskForApproval(taskId: $taskId) {
      success
      message
      task {
        id
        status
      }
    }
  }
`;

const TaskSubmissionPage = () => {
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const { isDark } = useTheme();

  // 🔹 Fetch Task Data
  const { data, loading, error, refetch } = useQuery(GET_TASK_BY_ID, {
    variables: { taskId },
    skip: !taskId,
    pollInterval: 30000, // Auto refresh every 30 seconds
  });

  const [updateTaskStatus, { loading: updating }] = useMutation(UPDATE_TASK_STATUS, {
    onCompleted: (data) => {
      refetch();
      setNotification({
        type: 'success',
        message: data.updateTaskStatus.message || 'Task status updated successfully!',
        show: true
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
    },
    onError: (error) => {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to update task status',
        show: true
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
    }
  });

  const [sendTaskForApproval, { loading: approving }] = useMutation(SEND_TASK_FOR_APPROVAL, {
    onCompleted: (data) => {
      refetch();
      setNotification({
        type: 'success',
        message: data.sendTaskForApproval.message || 'Task sent for approval successfully!',
        show: true
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
    },
    onError: (error) => {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to send task for approval',
        show: true
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
    }
  });

  const [status, setStatus] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '', show: false });

  // 🔹 Update status when data is fetched
  useEffect(() => {
    if (data?.getTaskById?.status) {
      setStatus(data.getTaskById.status);
    }
  }, [data]);

  // 🔹 Handle Status Update
  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateTaskStatus({ variables: { taskId, status: newStatus } });
      setStatus(newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 🔹 Handle Sending Task for Approval
  const handleSendForApproval = async () => {
    try {
      await sendTaskForApproval({ variables: { taskId } });
    } catch (err) {
      console.error("Error sending task for approval:", err);
    }
  };

  // Helper functions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "from-red-500 to-red-600";
      case "Medium": return "from-yellow-500 to-yellow-600";
      case "Low": return "from-green-500 to-green-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
      case "Completed": return "text-green-600 dark:text-green-400";
      case "In Progress": return "text-blue-600 dark:text-blue-400";
      case "Pending Approval": return "text-yellow-600 dark:text-yellow-400";
      case "To Do": return "text-gray-600 dark:text-gray-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done":
      case "Completed": return CheckCircle;
      case "In Progress": return PlayCircle;
      case "Pending Approval": return Clock;
      case "To Do": return PauseCircle;
      default: return AlertCircle;
    }
  };

  const isOverdue = data?.getTaskById?.dueDate && 
                   new Date(data.getTaskById.dueDate) < new Date() && 
                   status !== "Done" && status !== "Completed";

  // Loading Component
  if (loading) {
    return (
      <div className="min-h-screen p-6 lg:p-8 bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <motion.div 
          className="max-w-4xl mx-auto bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-center space-x-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-brand-primary-500 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <p className="text-center mt-4 font-body text-txt-secondary-light dark:text-txt-secondary-dark">
            Loading task details...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error Component
  if (error) {
    return (
      <div className="min-h-screen p-6 lg:p-8 bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <motion.div 
          className="max-w-4xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Loading Task
            </h3>
            <p className="font-body text-red-600 dark:text-red-300 mb-4">
              {error.message}
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/teamMember/project/${projectId}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </motion.button>
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => refetch()}
              >
                Try Again
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const task = data?.getTaskById;
  if (!task) {
    return (
      <div className="min-h-screen p-6 lg:p-8 bg-bg-secondary-light dark:bg-bg-secondary-dark">
        <motion.div 
          className="max-w-4xl mx-auto bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Task Not Found
            </h3>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-6">
              The task you're looking for doesn't exist or has been removed.
            </p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/teamMember/project/${projectId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(status);

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-bg-secondary-light dark:bg-bg-secondary-dark">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <NotificationBanner 
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(prev => ({ ...prev, show: false }))}
            />
          )}
        </AnimatePresence>

        {/* Header with Back Button */}
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-6"
          layout
        >
          <div className="flex items-center justify-between">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-600 rounded-xl font-body text-txt-primary-light dark:text-txt-primary-dark hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/teamMember/project/${projectId}`)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </motion.button>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${getStatusColor(status)}`}>
                <StatusIcon className="w-5 h-5" />
                <span className="font-medium">{status || 'Unknown'}</span>
              </div>
              {isOverdue && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Overdue</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Task Header */}
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg overflow-hidden"
          layout
        >
          {/* Priority Strip */}
          <div className={`h-2 bg-gradient-to-r ${getPriorityColor(task.priority)}`} />
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-3">
                  {task.title}
                </h1>
                <p className="font-body text-lg text-txt-secondary-light dark:text-txt-secondary-dark leading-relaxed">
                  {task.description}
                </p>
              </div>
            </div>

            {/* Task Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TaskMetadataCard
                icon={Flag}
                label="Priority"
                value={task.priority}
                color={getPriorityColor(task.priority)}
              />
              
              {task.dueDate && (
                <TaskMetadataCard
                  icon={Calendar}
                  label="Due Date"
                  value={new Date(task.dueDate).toLocaleDateString()}
                  isOverdue={isOverdue}
                />
              )}
              
              <TaskMetadataCard
                icon={User}
                label="Assigned By"
                value={task.assignedTo || 'Unknown'}
              />
              
              <TaskMetadataCard
                icon={Clock}
                label="Created"
                value={new Date(task.createdAt).toLocaleDateString()}
              />
            </div>
          </div>
        </motion.div>

        {/* Progress Visualization */}
        <TaskProgressCard status={status} />

        {/* File Upload Section */}
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-8"
          layout
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                Task Submission
              </h3>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                Upload files and submit your completed work
              </p>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-brand-primary-500 transition-colors duration-200">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Upload Your Work
            </h4>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
              Drag and drop files here or click to browse
            </p>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Choose Files
            </motion.button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <TaskActionButtons
          status={status}
          onStatusUpdate={handleStatusUpdate}
          onSendForApproval={handleSendForApproval}
          updating={updating}
          approving={approving}
        />
      </motion.div>
    </div>
  );
};

// Task Metadata Card Component
const TaskMetadataCard = ({ icon: Icon, label, value, color, isOverdue }) => (
  <motion.div
    className="bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        color ? `bg-gradient-to-br ${color}` : 'bg-gray-100 dark:bg-gray-700'
      }`}>
        <Icon className={`w-5 h-5 ${color ? 'text-white' : 'text-gray-400'}`} />
      </div>
      <div>
        <p className="font-body text-xs text-txt-secondary-light dark:text-txt-secondary-dark mb-1">
          {label}
        </p>
        <p className={`font-heading text-sm font-semibold ${
          isOverdue ? 'text-red-600 dark:text-red-400' : 'text-heading-primary-light dark:text-heading-primary-dark'
        }`}>
          {value} {isOverdue && '(Overdue)'}
        </p>
      </div>
    </div>
  </motion.div>
);

// Task Progress Card Component
const TaskProgressCard = ({ status }) => {
  const getProgressPercentage = (status) => {
    switch (status) {
      case "To Do": return 0;
      case "In Progress": return 50;
      case "Done": return 75;
      case "Pending Approval": return 90;
      case "Completed": return 100;
      default: return 0;
    }
  };

  const progress = getProgressPercentage(status);

  return (
    <motion.div 
      className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-8"
      layout
    >
      <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-6">
        Task Progress
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">Progress</span>
          <span className="font-heading text-lg font-semibold text-brand-primary-500">{progress}%</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="h-3 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="grid grid-cols-5 gap-2 mt-6">
          {['To Do', 'In Progress', 'Done', 'Pending Approval', 'Completed'].map((step, index) => {
            const isActive = getProgressPercentage(status) >= (index * 25);
            const isCurrent = step === status;
            
            return (
              <div key={step} className="text-center">
                <div className={`w-4 h-4 rounded-full mx-auto mb-2 transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-primary-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                } ${isCurrent ? 'ring-4 ring-brand-primary-200 dark:ring-brand-primary-800' : ''}`} />
                <p className={`text-xs font-body ${
                  isActive 
                    ? 'text-brand-primary-500 font-medium' 
                    : 'text-txt-secondary-light dark:text-txt-secondary-dark'
                }`}>
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// Task Action Buttons Component
const TaskActionButtons = ({ status, onStatusUpdate, onSendForApproval, updating, approving }) => (
  <motion.div 
    className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-8"
    layout
  >
    <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-6">
      Actions
    </h3>
    
    <AnimatePresence mode="wait">
      {status === "Completed" ? (
        <motion.div
          key="completed"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
        >
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
          <div>
            <h4 className="font-heading text-lg font-semibold text-green-800 dark:text-green-200">
              Task Completed
            </h4>
            <p className="font-body text-green-600 dark:text-green-300">
              Great job! This task has been completed successfully.
            </p>
          </div>
        </motion.div>
      ) : status === "Pending Approval" ? (
        <motion.div
          key="pending"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex items-center justify-center p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
        >
          <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mr-3" />
          <div>
            <h4 className="font-heading text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              Pending Approval
            </h4>
            <p className="font-body text-yellow-600 dark:text-yellow-300">
              Your submission is being reviewed. Please wait for approval.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {status === "Done" ? (
            <motion.button
              className="flex-1 btn-primary flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSendForApproval}
              disabled={approving}
            >
              {approving ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send for Approval
                </>
              )}
            </motion.button>
          ) : (
            <>
              {status === "To Do" && (
                <motion.button
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStatusUpdate("In Progress")}
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      Start Working
                    </>
                  )}
                </motion.button>
              )}
              
              {status === "In Progress" && (
                <motion.button
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStatusUpdate("Done")}
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Mark as Done
                    </>
                  )}
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Notification Banner Component
const NotificationBanner = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className={`p-4 rounded-xl border ${
      type === 'success' 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          type === 'success' 
            ? 'bg-green-100 dark:bg-green-800/30' 
            : 'bg-red-100 dark:bg-red-800/30'
        }`}>
          {type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
        </div>
        <p className={`font-body ${
          type === 'success' 
            ? 'text-green-800 dark:text-green-200' 
            : 'text-red-800 dark:text-red-200'
        }`}>
          {message}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className={`p-1 rounded-full hover:bg-opacity-20 ${
          type === 'success' 
            ? 'text-green-600 dark:text-green-400 hover:bg-green-600' 
            : 'text-red-600 dark:text-red-400 hover:bg-red-600'
        }`}
      >
        <X className="w-4 h-4" />
      </motion.button>
    </div>
  </motion.div>
);

export default TaskSubmissionPage;
